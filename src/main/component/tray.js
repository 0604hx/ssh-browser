/**
 * 系统托盘，提供以下功能：
 * 1. 查看连接信息
 * 2. 断开通道
 * 3. 退出 SSH-Browser
 */
const path = require("path")

const { app, nativeImage, Tray, Menu, dialog } = require('electron')
const config = require("../config")
const Tip = require("./tip")
const SshUtil = require("../service/ssh")

const _isOnMainPage = mainWindow=> mainWindow.webContents.getURL().indexOf(global.MAIN_PAGE)>-1

module.exports = (mainWindow) => {
    if (!config.tray.enable) return

    appTray = new Tray(Tip.icons.security)

    const contextMenu = Menu.buildFromTemplate([
        {
            label: "访问当前通道",
            icon: Tip.icons.security,
            click: ()=>{
                let local = SshUtil.getLocal()
                if(!!local){
                    mainWindow.loadURL && mainWindow.loadURL(local)
                }else
                    Tip.fail("当前还没有建立通道")
            }
        },
        {
            label: "查看连接信息",
            icon: Tip.icons.monitor,
            click: Tip.connectionSummary
        },
        {
            label: "断开通道",
            icon: Tip.icons.disconnect,
            click: () => {
                if(!SshUtil.isOpen()){
                    return Tip.info("还未建立本地端口通道，无法执行关闭操作")
                }
                dialog.showMessageBox({
                    title:config.name,
                    type: "question",
                    buttons: ["确定关闭", "取消"],
                    message: "确定关闭本地端口映射通道吗？ \n\n 温馨提示：关闭后将无法使用通道",
                    cancelId:1
                }, index => {
                    if (index == 0) {
                        SshUtil.close(success=>{
                            if(success==true){
                                if(_isOnMainPage(mainWindow))
                                    return
                                dialog.showMessageBox({
                                    message:"本地端口映射隧道已经关闭，现在可以开启其他通道了 ^.^ \n\n现在打开程序首页吗？",
                                    buttons:['好！','先不要打开']
                                }, i=>{
                                    if(i==0)
                                        mainWindow.loadURL(global.MAIN_PAGE)
                                })
                            }
                            else    Tip.fail("本地端口通道关闭失败，是否忘记建立连接？")
                        })
                    }
                })
            }
        },
        {type: 'separator'},
        {
            label:"返回浏览器首页",
            icon: Tip.icons.home,
            click: ()=>{
                if(mainWindow.webContents && mainWindow.loadURL){
                    if(_isOnMainPage(mainWindow))
                        return
                    mainWindow.loadURL(global.MAIN_PAGE)
                }
            }
        },
        {
            label:"关于",
            icon: Tip.icons.about,
            click: Tip.aboutUs
        },
        {type: 'separator'},
        {
            label: "退出 SSH-Browser",
            icon: Tip.icons.exit,
            click: () => app.exit()
        }
    ])

    appTray.setToolTip("点击打开主界面")
    appTray.on("click", (event) => {
        if(!!mainWindow)    mainWindow.show()
        else    Tip.fail("主窗口还未创建，无法显示程序主界面，请重新运行")
    })
    // Call this again for Linux because we modified the context menu
    appTray.setContextMenu(contextMenu)
}