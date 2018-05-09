const { app, dialog, Menu, shell } = require("electron")
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
                    click() { shell.openExternal('https://electron.atom.io') }
                }
            ]
        }
    ]

    if (process.platform === 'darwin') {
    }

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}