<template>
  <div class="cart">
    <nav-bar class="nav-cart"><div slot="center">购物车({{cartLength}})</div></nav-bar>
    <cart-list/>
    <cart-bottom-bar/>
  </div>
</template>

<script type="text/ecmascript-6">
import NavBar from 'components/common/navbar/NavBar'
import CartList from './childComps/CartList'
import CartBottomBar from './childComps/CartBottomBar'

import {mapGetters} from 'vuex'

export default {
  name: "Shopcart",
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    /*
      ...mapGetters({
        length:'cartLength',//起别名
      })
    */
    ...mapGetters(['cartLength'])
  }
}
</script>

<style scoped>
  .cart {
    height: 100vh;
  }

  .nav-cart {
    background-color: var(--color-tint);
    color: #fff;
  }
</style>
