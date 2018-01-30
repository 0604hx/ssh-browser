const {app} = require("electron")

const Tip = require("./tip")

/**
 * 
 */
const _onFinishLoad = ()=>{

}

/**
 * 
 * @param {*} e 
 */
const _onNavigateInPage = e=>{

}

/**
 * @param {*} e 
 * @param {*} errorCode 
 * @param {*} errorDescription 
 * @param {*} validatedURL 
 * @param {*} isMainFrame 
 */
const _onPageLoadFail = (
    e,
    errorCode,
    errorDescription,
    validatedURL,
    isMainFrame
  ) => {
    Tip.fail("无法加载页面："+validatedURL)
}

module.exports = mainWindow=>{

    const web = mainWindow.webContents
    if(web){
        //dom-ready,did-finish-load
        web.on("did-finish-load",_onFinishLoad)
        web.on("did-navigate-in-page",_onNavigateInPage)
        web.on("did-fail-load",_onPageLoadFail)
    }
}