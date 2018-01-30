/**
 * 提示信息
 */
const path = require("path")

const {dialog, nativeImage} = require('electron')
const moment = require("moment")
const SshUtil = require("../service/ssh")
const Util = require("../service/util")
const config = require("../config")

/**
 * 从 images 中加载图标信息
 * 
 * 目前读取静态资源时（存放于 ./static 目录下）
 * 判断是否为 开发环境，如果是则直接只用 static 进行读取，否则加上 __dirname
 * @param {*} name 
 */
const IS_DEV = process.env.NODE_ENV !== 'production'
const _loadIcon = (name)=> nativeImage.createFromPath(IS_DEV?"static/images/"+name : path.join(__dirname, "/static/images/"+name))

/**
 * 常用小图标
 */
const icons = {
    succes:     _loadIcon("/ok.png"),
    security:   _loadIcon("main.png"),
    fail:       _loadIcon("fail.png"),
    bug:        _loadIcon("bug.png"),
    exit:       _loadIcon("exit.png"),
    about:      _loadIcon("about.png"),
    home:       _loadIcon("home.png"),

    disconnect: _loadIcon("disconnect.png"),
    monitor:    _loadIcon("monitor.png"),
}

const connectionSummary = ()=>{
    let summary = SshUtil.summary()
    
    let msg = summary.alive?
        (()=>{
            return [
                "连接建立："+ new Date(summary.date).toLocaleString(),
                "本地地址："+summary.address,
                "接收流量："+Util.filesize(summary.receive),
                "连接总数："+summary.connect
            ].join("\n")
        })()
        :
        "请先建立 SSH 连接"
    
    dialog.showMessageBox({
        title:"通道信息",
        message:msg,
        detail:"从系统托盘选择“关闭连接”即可关闭本地端口监听",
        icon: icons.monitor
    })
}

const ok = (message, title="操作成功", detail="欢迎使用 "+config.name)=>{
    dialog.showMessageBox({title: title, message:message, detail: detail, icon:icons.ok})
}

const fail = (message, title="操作失败", detail="欢迎使用 "+config.name)=>{
    dialog.showMessageBox({title: title, message:message, detail: detail, icon:icons.fail})
}

const info = (message, title="提示", detail="欢迎使用 "+config.name)=>{
    dialog.showMessageBox({title: title, message:message, detail: detail, icon:icons.about})
}

const bug = (message, title="BUG 出现啦", detail="欢迎使用 "+config.name)=>{
    dialog.showMessageBox({title: title, message:message, detail: detail, icon:icons.bug})
}

const aboutUs = ()=>{
    dialog.showMessageBox({title: "关于 SSH-Browser", message:config.summary, detail: "当前版本 "+config.version, icon:icons.about})
}

module.exports = {
    connectionSummary,
    icons,
    ok, fail, bug,info,
    aboutUs
}