const moment = require("moment")

/**
 * 日期封装
 * @type {{}}
 */
let D={
    F:"YYYY-MM-DD",
    FT:"YYYY-MM-DD HH:mm:ss",
    ago (ds){
        return ds?new moment(ds).fromNow():""
    },
    datetime (v,df){
        return v?moment(v).format(df||(D.F+" HH:mm:ss")):""
    },
    date (v,df){
        return v?moment(v).format(df||D.F):""
    },
    today (){
        return moment().format(D.F)
    },
    toDate (ds,df){
        return new moment(ds,df||D.F)
    },
    time (df){
        return moment().format(df||D.FT)
    },
    addDay (ds,step,df){
        const m=moment(ds)
        return m.add(step,"d").format(df||this.F)
    },
    /**
     * 获取指定日期对应的月初
     * @param ds
     * @param df
     */
    getMonthBegin (ds,df){
        return new moment(ds).date(1).format(df||this.F)
    },
    getMonthEnd (ds,df){
        return this.toMonthEnd(new moment(ds)).format(df || this.F)
    },
    yearBegin (ds,df){return new moment(ds).month(0).date(1).format(df||this.F)},
    yearEnd (ds,df){return new moment(ds).month(11).date(31).format(df||this.F)},
    now (){return new Date().getTime()}
  }

  window.D=window.D||D
  export default D