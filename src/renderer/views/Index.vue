<style>
    body {background-color: #f0f0f0;}
    .mainDiv {
        width: 900px;
        margin: 100px auto;
    }
    .tunnelCard .ivu-card-extra {top:10px}
</style>

<template>
    <div>
        <Card class="mainDiv" dis-hover>
            <Row :gutter="12" style="min-height:200px">
                <Col span="8" v-for="(t,$ti) in tunnels" :key="$ti">
                    <Card class="tunnelCard">
                        <h3 slot="title">{{t.title}}</h3>
                        <span slot="extra">
                            <Button type="ghost" shape="circle" size="small" icon="compose" @click="toEdit($ti)" title="编辑"></Button>
                            <Button type="ghost" shape="circle" size="small" icon="ios-trash" @click="del($ti)" title="删除"></Button>
                        </span>
                        <p class="info"><b>{{t.host}}</b></p>
                        <p>{{t.user}}</p>
                        <p><span class="h">本地</span> <span class="info">{{t.localPort}}</span> 映射至 <span class="info">{{t.dstHost}}:{{t.dstPort}}</span></p>
                        <div class="h">{{t.type=='pwd'?"密码方式授权":"私钥文件授权"}}</div>
                        <Button :loading="t.loading" :disabled="t.connected" class="mt10" long 
                            type="success" @click="connect($ti)" v-text="t.connected?'已连接':'立即建立本地端口通道'"></Button>
                    </Card>
                </Col>
                <Col span="8" class="c" style="padding-top:80px">
                    <Icon title="新增通道" style="cursor:pointer;" class="success" type="ios-plus-outline" @click.native="toEdit(-1)" size="50"></Icon>
                    <Icon title="刷新列表" style="cursor:pointer;" class="ml10" type="ios-reload" @click.native="refresh" size="50"></Icon>
                </Col>
            </Row>
        </Card>

        <Add ref="add" @submit="onSubmit"></Add>
    </div>
</template>

<script>
    const TUNNEL = "tunnels"
    const SSH = "ssh"
    const SSH_PORT = "ssh.port"

    import Add from './Add.vue'

    let portTimer

    export default {
        components: {
            Add
        },
        data() {
            return {
                index:-1,
                tunnels: []
            }
        },
        methods: {
            refresh (){
                window.location.reload()
            },
            update(ps){
                this.$set(this.tunnels, this.index, Object.assign(this.tunnels[this.index],ps))
            },
            toEdit (index){
                this.$refs['add'].open(index, this.tunnels[index])
            },
            del (index){
                let t = this.tunnels[index]
                M.confirm("删除通道信息",`确定删除通道 ${t.title} 吗？`, ()=>{
                    this.tunnels.splice(index, 1)
                    S.set(TUNNEL, this.tunnels)
                    M.notice.ok(`通道 ${t.title} 删除成功`)
                })
            },
            connect(index){
                this.index = index
                let t = this.tunnels[index]
                this.update({loading:true})
                this.$electron.ipcRenderer.send(SSH, t)
            },
            onSubmit (index, t){
                //保存通道信息
                if(!!this.tunnels[index])
                    this.tunnels[index] = t
                else
                    this.tunnels.push(t)

                S.set(TUNNEL, this.tunnels)
                this.$refs['add'].close()
            },
            onPorts (ports){
                //更新状态
                let ps = Object.keys(ports).map(v=>parseInt(v))
                let ts = this.tunnels
                ts.forEach((t,i)=>this.$set(ts, i, Object.assign(t,{connected: ports[parseInt(t.localPort)] == `${t.dstHost}:${t.dstPort}`})))
            }
        },
        mounted() {
            this.tunnels = S.get(TUNNEL, [])

            this.$electron.ipcRenderer.on(SSH, (e,err,d)=>{
                let t = this.tunnels[this.index]
                if(!!t){
                    this.update({loading: false, connected:!err})
                    if(!!err)
                        M.notice.error(err, `${t.title} 通道失败`)
                    else
                        M.notice.ok(`本地 ${d.address} >> ${d.remote}`,`${t.title} 通道连接成功`)
                }
            })

            this.$electron.ipcRenderer.on(SSH_PORT, (e, ports)=>this.onPorts(ports))

            this.portTimer = setInterval(()=>{
                this.$electron.ipcRenderer.send(SSH_PORT)
            }, 5000)

            this.$electron.ipcRenderer.send(SSH_PORT)
        },
        destroyed () {
            this.$electron.ipcRenderer.removeListener(SSH)
            this.$electron.ipcRenderer.removeListener(SSH_PORT)

            clearInterval(portTimer)
        }
    }
</script>