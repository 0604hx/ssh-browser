const { app, dialog, Menu } = require("electron")
const {connectionSummary} = require("./tip")

module.exports = (mainWindow) => {
    const template = [
        {
            label: 'Connection',
            submenu: [
                {
                    label: 'information',
                    click: connectionSummary
                },
                {type: 'separator'},
                {label:"quit"}
            ]
        },
        {
            label: 'About',
            submenu: [
                {
                    label: 'Get code',
                    click() { require('electron').shell.openExternal('https://electron.atom.io') }
                }
            ]
        }
    ]

    if (process.platform === 'darwin') {
    }

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}