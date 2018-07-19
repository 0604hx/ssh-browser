<template>
    <div style="position: absolute; bottom: 8px;width: 100%;" class="c h">
        当前版本：<code id="version">{{c.version}}</code>
        <!-- ( Build on <code id="build">{{c.buildOn}}</code> ) -->
    </div>
</template>
<script>
    let timer
    export default {
        data(){
            return {
                c: {}
            }
        },
        mounted (){
            timer = setInterval(()=>{
                if(window.config && window.config.version){
                    this.c = window.config
                    clearInterval(timer)
                }
            }, 1000)
        }
    }
</script>