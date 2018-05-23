/**
 * LOGS
 * 
 * 2017年9月18日
 *  1. 增加 F12 事件监听，打开 开发者工具（无论是开发模式还是 production 都可以查看，方便定位问题）
 * 
 * 2018年1月25日
 *  1. 发现在这里不能使用 JSON 对象 =.=
 */
const { ipcMain, dialog, ipcRenderer } = require('electron')
// import SshUtil from "./service/ssh"
const SshUtil = require('../service/ssh')
const Tip = require("../component/tip")

let SSH = "ssh"
let SSH_TEST = "ssh.test"
let SSH_PORT = "ssh.port"

let PORT_IN_USE = ['EACCES', 'EADDRINUSE']

const errHumanTip = e=>{
    if(e.code && PORT_IN_USE.indexOf(e.code)>-1)
        return ` （无法监听端口 ${e.port}，可能此端口正在被占用）`
    return ""
}

module.exports = (mainWindow) => {
    ipcMain.on('F12', (e, args) => {
        mainWindow.webContents.openDevTools()
    })

    /**
     * args 示例：
     * {
            host:"192.168.1.131:10200",
            name:"root", 
            password:"root",
            dstHost:"127.0.0.1", 
            dstPort:8000,
            localHost: '127.0.0.1',
            localPort: 8000,
        }
     */
    ipcMain.on(SSH, (e, args) => {
        SshUtil.connect(args)
        .then(config=>{
            e.sender.send(SSH, null, config)

            dialog.showMessageBox({
                message:"立即使用通道 "+config.local+" 吗？",
                buttons:['好！',"等下我自己打开"],
                cancelIndex:1
            }, index=>{
                if(index==0 && mainWindow.loadURL)
                    mainWindow.loadURL(config.local)
            })
        })
        .catch(err=>{
            console.log("----------------", err)
            let msg = err.message+ errHumanTip(err)
            e.sender.send(SSH, msg)
        })
    })

    ipcMain.on(SSH_TEST, (e, args)=>{
        try{
            SshUtil.test(args)
            .then(d=>e.sender.send(SSH_TEST, d))
            .catch(err=>e.sender.send(SSH_TEST, "无法连接到 SSH 服务器，请检查你的帐密或者私钥是否正确: code="+err.code))
        }catch(ee){
            Tip.fail(ee.message)
            e.sender.send(SSH_TEST)
        }
    })

    /**
     * 获取本地已经监听的端口
     */
    ipcMain.on(SSH_PORT, e=>{
        e.sender.send(SSH_PORT, SshUtil.getPorts())
    })
}
