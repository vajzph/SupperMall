<template>
  <div id="app">
    <keep-alive exclude="Detail"><!-- 离开时不会销毁（有问题bscroll） -->
      <router-view></router-view>
    </keep-alive>
    <main-tab-bar/>
  </div>
</template>

<script>
  import MainTabBar from 'components/content/mainTabBar/MainTabBar.vue'

  export default {
    name: 'App',
    components: {
      MainTabBar
    }
  }
</script>

<style>
  @import "assets/css/base.css";
</style>
