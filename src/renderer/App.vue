<style>
  body {
    /* background: rgb(34, 8, 7); */
    /* padding-top: 60px; */
    /* overflow-y:scroll; */
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
  </div>
</template>

<script>
  export default {
    name: 'SSH-Browser',
    methods: {
    }
  }

</script>

<style>
  /* CSS */
</style>