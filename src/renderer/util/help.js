/**
 * 常用组件的封装
 */
let H={
    color:{
        RED : "#ff5500",
        BLUE : "#2db7f5",
        YELLOW :"#ff9900",
        GREEN :"#00cc66"
    },
    /**
     * 简单的 html 转换
     * @param v
     * @param tips
     * @returns {*}
     */
    html (v,tips){
        return v?v.replace(/\n/g,"<br>"):tips||"内容为空"
    },
    /**
     * 去除为空的属性
     * @param t
     */
    fixBean (t,keeAddDate){
        if(typeof t ==='object'){
            const nt={}
            Object.keys(t).map(function (k) {
                const v=t[k]
                if(v===''||v===undefined||v===null)
                    return
                if(v.id)
                    nt[k+".id"]=v.id
                else
                    nt[k]=v
            })
            if(keeAddDate !== true)
                delete nt['addDate']
            return nt
        }
        return t
    },
    spliceById (datas, id) {
        for(var i=0;i<datas.length;i++){
            if(datas[i].id && datas[i].id==id){
                datas.splice(i,1);
                return ;
            }
        }
    },
    /**
     * 对数值进行千位添加逗号
     * @param {*} num 
     */
    toThousands (num) {
        var num = (num || 0).toString(), result = '';
        while (num.length > 3) {
            result = ',' + num.slice(-3) + result;
            num = num.slice(0, num.length - 3);
        }
        if (num) { result = num + result; }
        return result;
    },
    /**
     * 格式化文件大小
     * @param {*} mem 
     */
    filesize (mem){
        var G = 0
        var M = 0
        var KB = 0
        mem > (1 << 30) && (G = (mem / (1 << 30)).toFixed(2))
        mem > (1 << 20) && (mem < (1 << 30)) && (M = (mem / (1 << 20)).toFixed(2))
        mem > (1 << 10) && (mem < (1 << 20)) && (KB = (mem / (1 << 10)).toFixed(2))
        return G > 0
            ? G + ' G'
            : M > 0
            ? M + ' M'
            : KB > 0
                ? KB + ' KB'
                : mem + ' B'
    }
}

window.H = window.H || H
export default H