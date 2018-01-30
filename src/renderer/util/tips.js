/**
 * 基于 iviewui 实现的对话框、确认框等组件
 * Created by zengxm on 4/28/2017.
 */
import iView from 'iview'
const M = {
    duration : 3000,
    ok (m,d){
        iView.Message.success(m,d)
    },
    info (m,d){
        iView.Message.info(m,d)
    },
    warn (m,d=5){
        iView.Message.warning(m,d)
    },
    error (m,d=10){
        iView.Message.error(m,d)
    },
    alert (m,t){
        iView.Modal.info({title:t, content:m})
    },
    confirm (t,m,onOk,onCancel){
        iView.Modal.confirm({
            title: t,
            content: m||'',
            okText: '确定',
            cancelText: '我再想想',
            onOk: () => {
                if(onOk) onOk()
            },
            onCancel: () => {
                if(onCancel) onCancel()
            }
        });
    },
    notify (m,d,cb){
        iView.Notice.info({
            desc: m||'',
            duration:d||5
        });
    },
    notice:{
        ok (m,t="操作成功",d){
            iView.Notice.success({
                title: t,
                desc: m||'',
                duration:d||5
            });
        },
        warn (m,t="警告",d){
            iView.Notice.warning({
                title: t,
                desc: m||'',
                duration:d||5
            });
        },
        info (m,t="",d){
            iView.Notice.info({
                title: t,
                desc: m||'',
                duration:d||5
            });
        },
        error (m,t="操作失败",d){
            iView.Notice.error({
                title: t,
                desc: m||'',
                duration:d||5
            });
        }
    },
    loadingStart (tips="加载中..."){
        window.Loading = iView.Message.loading({content:tips, duration:0})
    },
    loadingClose (){
        if(window.Loading)  window.Loading()
    }
}

window.M = window.M || M
export default M