<template>
  <div class="nav-bar">
    <div class="lift"><slot name="left"></slot></div>
    <div class="center"><slot name="center"></slot></div>
    <div class="right"><slot name="right"></slot></div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "NavBar",
  data() {
    return {}
  },
  components: {}
}
</script>

<style scoped>
  .nav-bar {
    display: flex;
    height: 44px;
    line-height: 44px;
    text-align: center;
    box-shadow: 0 1px 1px rgba(100,100,100,.1);
  }

  .lift,.right {
    width: 60px;
  }

  .center {
    flex: 1;
  }
</style>