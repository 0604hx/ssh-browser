const SSH = require("../src/main/service/ssh")

SSH.connect({
    host: "192.168.1.131:10200",
    name: "root",
    password: "root2",
    dstHost: "127.0.0.1",
    dstPort: 8000,
    localHost: '127.0.0.1',
    localPort: 8000,
}).then(d => {
    console.log("本地端口连接成功：", d)

    let count = 0

    let timer = setInterval(() => {
        console.log(SSH.summary())
        count++
        if (count > 1)
            SSH.close()
    }, 5000)
}).catch(e => {
    console.log(e)
})