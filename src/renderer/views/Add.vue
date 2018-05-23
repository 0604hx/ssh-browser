<style>
    /* .loginM {color: whitesmoke} */
    .loginM .ivu-modal-header {padding-bottom: 0px;}
    .loginM .ivu-modal-close {z-index: 9999;}
    .pwdItem .ivu-switch {height: 22px}
    .pwdItem .ivu-switch:after {height: 18px}
    .loginM .ivu-modal-body {padding-bottom: 0px}
</style>

<template>
    <Modal class="loginM" v-model="show" width="550" :styles="{top:'20px'}" :maskClosable="false">
        <div slot="header" class="c">
            <Row>
                <Col span="5" class="l"><img width="72px" src="../assets/security.svg"></Col>
                <Col span="19" class="l">
                    <div style="font-size:1rem;">请先填写服务器登录信息</div>
                    <div class="h mt10" style="line-height:120%">
                        <div>1. 服务器地址、帐密信息必须填写</div>
                        <div>2. 默认映射本地 <code class="info">8080</code> 到服务器 <code class="info">80</code> 端口</div>
                    </div>
                </Col>
            </Row>
            <!-- <h2><Icon type="ios-locked" class="mr10"></Icon>请先填写服务器登录信息</h2> -->
        </div>
        <div>
            <i-form ref="tunnelForm" :model="tunnel" :rules="ruleValidate" :label-width="0" slot="left">
                <Form-item prop="title">
                    <i-input v-model="tunnel.title" placeholder="备注信息">
                        <Icon type="ios-information-outline" slot="prepend"></Icon>
                    </i-input>
                </Form-item>
                <Form-item prop="host">
                    <i-input v-model="tunnel.host" placeholder="服务器地址，格式为 IP:端口，示例 192.168.1.161:22">
                        <Icon type="social-tux" slot="prepend"></Icon>
                    </i-input>
                </Form-item>
                <Form-item prop="user">
                    <i-input v-model="tunnel.user" placeholder="请输入姓名，默认 root">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </i-input>
                </Form-item>

                <!--目前只提供密码登录-->
                <!-- <Form-item style="margin-bottom: 0px;">
                    <RadioGroup v-model="tunnel.type">
                        <Radio label="raw">密码登录</Radio>
                        <Radio label="key">私钥文件登录</Radio>
                    </RadioGroup>
                    <span class="h" v-text="tunnel.type=='pwd'?'使用输入密码的方式进行登录':'使用私钥方式登录，请选择私钥文件'"></span>
                </Form-item> -->

                <Form-item prop="password" class="pwdItem">
                    <i-input v-model="tunnel.password" :type="tunnel.type=='raw'?'password':'text'"
                        :placeholder="tunnel.type=='raw'?'请输入登录密码':'请填写私钥文件的完整路径'">
                        <Icon type="ios-locked-outline" slot="prepend"></Icon>
                        <!-- <i-switch v-model="tunnel.remember" slot="append" title="记住密码，方便下次登录，请慎用"></i-switch> -->
                        <RadioGroup v-model="tunnel.type" slot="append">
                            <Radio label="raw">密码</Radio>
                            <Radio label="key">私钥</Radio>
                        </RadioGroup>
                    </i-input>
                </Form-item>

                <Form-item prop="dstHost">
                    本地
                    <i-input style="width:57px" v-model="tunnel.localPort" placeholder="本地端口"></i-input>
                    <span class="info">映射到</span>
                    <div class="ivu-input-wrapper" style="width:220px; display:inline-block">
                        <i-input v-model="tunnel.dstHost" placeholder="远程主机">
                            <Select v-model="tunnel.protocol" slot="prepend" style="width:80px">
                                <Option value="http">http://</Option>
                                <Option value="https">https://</Option>
                            </Select>
                        </i-input>
                    </div>
                    :
                    <i-input style="width:57px" v-model="tunnel.dstPort"  placeholder="远程端口"></i-input>
                </Form-item>
            </i-form>
        </div>

        <div slot="footer">
            <i-button type="ghost" size="large" long :loading="working" @click.native="test">测试 SSH 连接</i-button>
            <br>
            <i-button type="success" size="large" long :loading="working" @click.native="save" class="mt10">保存通道信息</i-button>
        </div>
    </Modal>
</template>

<script>
    const SSH = "ssh"
    const SSH_TEST = "ssh.test"

    const fields = ['localPort', 'dstPort']

    const _fixup = t=>{
        let nt = JSON.parse(JSON.stringify(t))
        fields.forEach(v=>nt[v] = parseInt(nt[v]))
        return nt
    }

    export default {
        name:"index",
        data () {
            return {
                index:-1,
                show:false,
                tunnel:{},
                ruleValidate: {
                    title: [
                        { required: true, message: '连接名称不能为空', trigger: 'blur' },
                        { type: 'string', min: 1, message: '连接名称不能少于1个字', trigger: 'blur' }
                    ],
                    host: [
                        { required: true, message: '服务器地址不能为空', trigger: 'blur' },
                        { type: 'string', min: 8, message: '地址不能少于8个字', trigger: 'blur' }
                    ],
                    user: [
                        { required: true, message: '姓名不能为空', trigger: 'blur' },
                        { type: 'string', min: 2, message: '登录名不能少于2个字', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' },
                        { type: 'string', min:4, message: '密码不能少于4个字', trigger: 'blur' }
                    ],
                    dstHost: [
                        { required: true, message: '远程地址不能为空', trigger: 'blur' },
                        { type: 'string', min: 4, message: '地址不能少于4个字', trigger: 'blur' }
                    ],
                },
                working:false
            }
        },
        methods: {
            close() {
                this.show = false
            },
            open(index, tunnel){
                this.index = index
                this.tunnel = tunnel && tunnel.host ? tunnel : {
                    host:"localhost:22",
                    user:'root',
                    password:'',
                    type:"raw",
                    localPort:8000,
                    dstHost:"127.0.0.1",
                    dstPort:80,
                    protocol:"http",
                    remember:false
                }

                this.show = true
            },
            save(){
                this.$refs['tunnelForm'].validate((valid) => {
                    if (valid) {
                        this.$emit("submit", this.index, _fixup(this.tunnel))
                    } else {
                        M.notice.warn("请填写完整的登录信息")
                    }
                })
            },
            test (){
                this.$refs['tunnelForm'].validate((valid) => {
                    if (valid) {
                        this.working = true
                        this.$electron.ipcRenderer.send(SSH_TEST, _fixup(this.tunnel))
                    } else {
                        M.notice.warn("请填写完整的登录信息")
                    }
                })
            }
        },
        mounted () {
            this.$electron.ipcRenderer.on(SSH_TEST, (e, result)=>{
                this.working = false
                if(result == true)  {
                    this.checkResult = "success"
                    M.notice.ok("SSH 连接检测成功，少年不迷路 ^.^")
                }
                else M.notice.error(!!result.message ? result.message : result)
            })
        },
        destroyed () {
            this.$electron.ipcRenderer.removeListener(SSH_TEST)
        }
    }
</script>