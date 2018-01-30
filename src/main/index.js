import { app, BrowserWindow, globalShortcut, Menu, Tray, dialog, Notification } from 'electron'
// import { request } from 'http';
const path = require("path")

const config = require("./config")
const api = require("./component/api")
const AppMenu = require("./component/menu")
const AppTray = require("./component/tray")
const AppEvent = require("./component/event")

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
//设置常量信息
global.version = config.version

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
global.MAIN_PAGE = winURL


/**
 * 注册 CTRL+12 键盘监听，可以打开开发者模式
 */
function initKeyboard() {
  globalShortcut.register('CommandOrControl+F12', () => {
    if (!!mainWindow)
      mainWindow.webContents.openDevTools()
  })
}

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    title: config.name,
    height: 760,
    useContentSize: true,
    width: 1440,
    icon: config.icon
  })

  mainWindow.setMenu(null)
  mainWindow.loadURL(winURL)

  api(mainWindow)
  AppEvent(mainWindow)
  //暂不需要菜单
  //AppMenu(mainWindow)


  mainWindow.on('close', (event) => {
    if (process.platform !== 'darwin') {
      //关闭操作默认是最小化到系统托盘
      event.preventDefault()

      dialog.showMessageBox({
        title:config.name,
        type: "question",
        buttons: ["直接退出", "最小化到托盘", "取消"],
        message: "确定退出本程序吗？ \n\n 温馨提示：退出前请确保已保存的您的数据",
        cancelId:2
      }, index => {
        if (index == 0) app.exit()
        else if (index == 1) {
          mainWindow.hide()
          if (config.notify.enable) appNotification.show()
        }
      })
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function onActive() {
  if (mainWindow === null) {
    createWindow()
  } else
    mainWindow.show()
}

/**
 * 系统提示框，在主窗口关闭或者隐藏时显示
 */
let appNotification
function initNotification() {
  if (!config.notify.enable) return

  appNotification = new Notification({
    body: config.notify.hideText
  })

  appNotification.on('click', () => {
    onActive()
  })
}

app.on('ready', createWindow)

app.on('ready', () => {
  AppTray(mainWindow)

  initNotification()

  initKeyboard()
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', onActive)

/**
 * 适配 https
 * 详见：http://rion.io/2017/01/17/when-insecure-responses-and-certificate-transparency-completely-break-electron/
 */
app.commandLine.appendSwitch('ignore-certificate-errors')

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
