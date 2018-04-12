/**
 * 常量定义
 */
const fs = require("fs")
const path = require("path")

let version = "1.0.2"

module.exports = {
    name:"SSH-Browser "+version,
    version,
    summary:"基于 Electron 搭建的 ssh 隧道浏览器，主要用于需要通过隧道进行 web 访问的场景",

    /**
     * 系统托盘相关
     */
    tray:{
        //是否开启托盘
        enable:true,
    },
    /**
     * main 进程提示信息
     */
    notify:{
        enable:true,
        //主窗口隐藏时提示信息
        hideText:"主窗口隐藏了，点击系统托盘的图标即可显示哦",
    }
}