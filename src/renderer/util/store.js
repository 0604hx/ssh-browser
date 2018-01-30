/**
 * 存储工具：https://github.com/marcuswestin/store.js
 */
import store from 'store'
import moment from 'moment'
let S = {
    set (k,v){
        return store.set(k,v)
    },
    get (k,dv){
        let v = store.get(k)
        return v===undefined||v===null?dv:v
    },
    instance:store
}

window.S = window.S || S
export default S