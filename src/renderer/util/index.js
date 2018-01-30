import M from './tips'
import D from './date'
import Store from './store'
import H from './help'

window.log = window.log || function (msg){
    console.log(`[${window.D.time()}] ${msg}`)
}

export {
    M,D,Store
}