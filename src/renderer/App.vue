<style>
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/

  ::-webkit-scrollbar {
    width: 3px;
    height: 3px;
    background-color: #F5F5F5;
  }

  /*定义滚动条轨道 内阴影+圆角*/

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.6);
    border-radius: 2px;
    background-color: #F5F5F5;
  }

  /*定义滑块 内阴影+圆角*/

  ::-webkit-scrollbar-thumb {
    border-radius: 2px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .6);
    background-color: #555;
  }

  body {
    width: 100%;
    font-family: "Monospaced Number", "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  body,
  html,
  #app {
    height: 100%;
  }

  .fixed-header,
  .fixed-footer {
    width: 100%;
    position: fixed;
    z-index: 10;
  }

  .fixed-header {
    top: 0;
  }
</style>

<template>
  <div id="app">
    <div class="p10">
      <router-view></router-view>
    </div>
    <BackTop></BackTop>
    <Version></Version>
  </div>
</template>

<script>
  import Version from 'C/version.vue'

  export default {
    name: 'SSH-Browser',
    components:{Version},
    methods: {
    }
  }

</script>