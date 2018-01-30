// import { tunnel, checkSSH } from './tunnel'
const Tunnel = require("./tunnel")
// const {tunnel, checkSSH} = window.require("./tunnel")

let instance    //当前 SSH 连接
let ports = {}  //本地已监听端口
let config

let LOCALHOST = "127.0.0.1"

const _isOnWork = ()=> !!instance && !!instance._handle

const _buildConfig = cfg=>{
    //处理 server 的ip跟端口
    let host = cfg.host.split(":")

    return {
        protocol: cfg.protocol || "http",
        username:cfg.user,
        password:cfg.password,
        host:host[0],
        port: host.length == 1?22:parseInt(host[1]),
        dstHost: cfg.dstHost || LOCALHOST,
        dstPort: cfg.dstPort? parseInt(cfg.dstPort): 80,
        localHost: LOCALHOST,
        localPort: cfg.localPort? parseInt(cfg.localPort) : 8000,
        keepAlive:true
    }
}

module.exports = {
    isOpen: _isOnWork,

    /**
     * 获取当前开通的通道（本地地址）
     */
    getLocal: ()=> _isOnWork() && config ? config.local:undefined,

    getCurrent: () => instance,

    test: (cfg)=> Tunnel.checkSSH(_buildConfig(cfg)),

    connect: (cfg) => {
        return new Promise((resolve, reject)=>{
            if(_isOnWork())
                //已经存在 连接
                return reject(new Error(`已经存在本地端口映射 ${config.local}, 请先关闭再连接`))
            
            let _cfg = _buildConfig(cfg)

            Tunnel.checkSSH(_cfg)
            .then(d=>{
                instance = Tunnel.tunnel(_cfg, (err, server)=>{
                    if(err) {
                        reject(err)
                    }else{
                        config = _cfg
                        config.local = `${_cfg.protocol}://${_cfg.localHost}:${_cfg.localPort}`

                        ports[_cfg.localPort] = `${_cfg.dstHost}:${_cfg.dstPort}`
                        resolve(_cfg)
                    }
                })
                instance.on("error", err => {
                    console.log("server error", err)
                })
            })
            .catch(err => reject(new Error("无法连接到 SSH 服务器，请检查你的帐密或者私钥是否正确:"+err.message)))
        })
    },
    /**
     * 获取当前的连接信息
     */
    summary: ()=> {
        let alive = _isOnWork()
        return {
            alive:   alive,
            address: config.local,
            remote:  `${config.dstHost}:${config.dstPort}`,
            connect: alive?instance.getConnect():-1,
            receive: alive?instance.getReceive():-1,
            date:    alive?instance.getDate():0
        }
    },
    close: (cb)=>{
        if(_isOnWork())
            instance.close(e=>{
                delete ports[instance.port]
                console.log("SSH 连接关闭！")
                if(cb) cb(true)
            })
        else
            if(cb) cb(false)
    },
    getPorts: ()=> ports
}