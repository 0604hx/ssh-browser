var _process = process
const ipcRender = require('electron').ipcRenderer

/**
 * add on 2018年5月9日16:17:55
 * 
 * 目前不提供 API
 */
process.once('loaded', function () {
    //API 母体
    const ZEUS = {
    }
    global.ZEUS = ZEUS
})