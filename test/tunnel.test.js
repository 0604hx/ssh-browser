const { tunnel, checkSSH } = require('../src/main/service/tunnel')

/**
 * 建立本地 8000 端口到 远程 8000 端口的映射 
 */
let config = {
    username: 'ironman',
    password: 'ironman',
    host: "192.168.1.131",
    port: 10200,
    dstHost: "192.168.1.161",
    dstPort: 8999,
    localHost: '127.0.0.1',
    localPort: 8000,
    keepAlive: true
}

let channel

let checkAndRun = async () => {
    let isOk = await checkSSH(config).catch(err => false)

    if (!!isOk) {
        console.log("SSH 检测成功！ 即将开始本地端口映射...")
    
        let channel = tunnel(config, (err, server) => {
            if (err) throw err
    
            console.log("连接成功")
        })
    
        channel.on("error", err => {
            console.log("error", err)
        })
        channel.on('netConnection', (conn, server) => {
            console.log("netConnection ====>>>>")
        })
        channel.on('data', d => {
            // console.log("data ======>>> ", d.length)
        })
    
        let timer = setInterval(() => {
            console.log(`[${new Date().toLocaleTimeString()}] connections=${channel.getConnect()} \t totalSize=${channel.getReceive()} b`)
        }, 10000)
    }
    else{
        console.log("无法连接到 SSH 服务器，请检查你的帐密或者私钥是否正确")
    }
}

checkAndRun()


// setTimeout(() => {
//     console.log("即将关闭！")
//     channel.close()
// }, 300000)