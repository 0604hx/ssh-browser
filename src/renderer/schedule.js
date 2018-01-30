/**
 * 定时器
 * 每隔一分钟执行一次
 * 
 * 依赖加入：
 * "node-schedule": "^1.2.5",
 */

const schedule = require('node-schedule')
import D from "./util/date"

/**
 * 
 */
let _clockIn = ()=>{

}

var clockSchedule = schedule.scheduleJob('*/1 * * * *', ()=>{
    console.log("现在是 "+D.time()+" ....")
})