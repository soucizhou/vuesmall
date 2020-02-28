<!--  -->
<template>
  <div class="cart_list">
    <scroll class="content" ref="scroll">
      <cart-list-item v-for="item in cartList" :key="item.iid" :item-info="item"/>
    </scroll>
  </div>
</template>

<script>
import Scroll from "components/common/scroll/Scroll";
import CartListItem from "./CartListItem"

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    Scroll,
    CartListItem
  },
  props: {
    cartList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  activated() {
    this.$refs.scroll.refresh()
  } //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style  scoped>
/*@import url(); 引入公共css类*/
/* -底部-计算-图片 */
.cart_list {
  height: calc(100% - 44px - 49px - 50px);
}
.content {
  height: 100%;
  overflow: hidden;
}
</style>