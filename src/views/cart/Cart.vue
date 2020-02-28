<template>
  <div class="shopcart">
    <nav-bar class="home-nav">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>
    <cart-list class="cart-list" :cart-list="list"/>
    <cart-bottom-bar />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import CartList from "./childComps/CartList"
import CartBottomBar from "./childComps/CartBottomBar"

import { mapGetters } from "vuex";
export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    // cartLength() {
      //返回数量
    //   return this.$store.getters.cartLength
    //   // return this.$store.state.cartList.length
    // }

    ...mapGetters({
      length: "cartLength",
      list: "cartList"
    })
  }
};
</script>

<style scoped>

.shopcart {
    /*position: relative;*/
    height: 100vh;
  }
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  font-weight: 700;
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 999; */
}

.cart-list {
    position: absolute;
    top: 44px;
    bottom: 41px;
    width: 100%;
  }
</style>
