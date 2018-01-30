/**
 * 常用工具封装
 */

 module.exports = {
    filesize :(size)=>{
        var G = 0
        var M = 0
        var KB = 0
        size > (1 << 30) && (G = (size / (1 << 30)).toFixed(2))
        size > (1 << 20) && (size < (1 << 30)) && (M = (size / (1 << 20)).toFixed(2))
        size > (1 << 10) && (size < (1 << 20)) && (KB = (size / (1 << 10)).toFixed(2))
        return G > 0
            ? G + ' G'
            : M > 0
            ? M + ' M'
            : KB > 0
                ? KB + ' KB'
                : size + ' B'
    }
 }