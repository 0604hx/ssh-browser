/**
 * 常量定义
 */
const fs = require("fs")
const path = require("path")

const pk = require("../../package.json")

let BUILD_ON = ""

let buildFile = path.join(__dirname, "main.js")
BUILD_ON = fs.existsSync(buildFile)? fs.statSync(buildFile).ctime : "dev-mode"

module.exports = {
    name: pk.name,
    summary: pk.description,
    version: pk.version,
    buildOn: BUILD_ON,
    author: pk.author,

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