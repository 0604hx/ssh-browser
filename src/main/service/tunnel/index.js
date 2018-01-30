/**
 * 源代码：https://github.com/agebrock/tunnel-ssh/blob/master/index.js
 * 
 * 源码思路：
 * 1. 开启监听 localPort 的本地服务，收到请求后建立 SSHConnection 并转发上述的请求
 * 2. SSHConnection 每次有请求时都要创建（考虑到 SSH 服务器可能自动关闭没有活动的连接）
 * 
 * 2018年1月25日22:21:03
 *  增加功能：
 *      1. 对接收到的数据总量进行统计
 *      2. 对总的链接数进行统计
 *      3. 增加 data 事件，通过 server.on('data', d=>{}) 监听数据，其中参数 d 为 Buffer 对象
 * 
 *  源代码出现的问题：
 *      1. 建立本地端口映射时，无法检测能否链接 SSH 服务器
 */
var net = require('net')
var Connection = require('ssh2')
var createConfig = require('./config')
var events = require('events')
var noop = function () {
};

function bindSSHConnection(config, netConnection) {
    var sshConnection = new Connection();
    netConnection.on('close', sshConnection.end.bind(sshConnection));

    sshConnection.on('ready', function () {
        netConnection.emit('sshConnection', sshConnection, netConnection);
        sshConnection.forwardOut(config.srcHost, config.srcPort, config.dstHost, config.dstPort, function (err, sshStream) {
            if (err) {
                // Bubble up the error => netConnection => server
                netConnection.emit('error', err);
                console.log('Destination port:', err);
                return;
            }

            netConnection.emit('sshStream', sshStream);
            netConnection.pipe(sshStream).pipe(netConnection);
        });
    });
    return sshConnection;
}

function createServer(config) {
    var server;
    var connections = [];
    var connectionCount = 0;
    
    let startDate = 0   //服务开启的时间点（时间戳）
    let counter = {
        receive: 0,//接收到的数据总大小
        connect: 0
    }

    server = net.createServer(function (netConnection) {
        counter.connect ++

        var sshConnection;
        connectionCount++;
        netConnection.on('error', server.emit.bind(server, 'error'));
        netConnection.on('close', function () {
            connectionCount--;
            if (connectionCount === 0) {
                if (!config.keepAlive) {
                    setTimeout(function () {
                        if (connectionCount === 0) {
                            server.close();
                        }
                    }, 2);
                }
            }
        });

        server.emit('netConnection', netConnection, server);
        sshConnection = bindSSHConnection(config, netConnection);
        sshConnection.on('error', server.emit.bind(server, 'error'));

        netConnection.on('sshStream', function (sshStream) {
            sshStream.on('error', function () {
                server.close();
            });
            sshStream.on('data', function(d){
                counter.receive += d.length
                server.emit('data',d)
            })
        });

        connections.push(sshConnection, netConnection);
        sshConnection.connect(config);
    });

    server.on('close', function () {
        connections.forEach(function (connection) {
            connection.end();
        });
    });

    server.getReceive = ()=> counter.receive
    server.getConnect = ()=>counter.connect
    server.port = config.localPort
    startDate = new Date().getTime()
    server.getDate = ()=> startDate

    return server;
}

const checkSshConnection = (config)=> {
    return new Promise((resolve, reject)=>{
        var sshConnection = new Connection();
        sshConnection.on('ready', ()=>{
            console.info("[SSH-Test] connection ok!")
    
            sshConnection.end()
            resolve(true)
        }).on('error', err=>{
            console.info("[SSH-Test] fail", err)
            reject(err)
        })
        .connect(config)
    })
}

function tunnel(configArgs, callback) {
    var server;
    var config;

    if (!callback) {
        callback = noop;
    }
    try {
        config = createConfig(configArgs);

        server = createServer(config);

        server.listen(config.localPort, config.localHost, function (error) {
            callback(error, server);
        });
        
    } catch (e) {
        server = new events.EventEmitter();
        setImmediate(function () {
            callback(e);
            server.emit('error', e);
        });
    }
    return server;
}

module.exports = {
    tunnel,
    checkSSH : checkSshConnection
}