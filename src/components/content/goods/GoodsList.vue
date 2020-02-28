<!--  -->
<template>
  <div class="goods">
    <goods-list-item v-for="(item,i) in goods" :key="i" :goods-item="item"/>
  </div>
</template>

<script>
import GoodsListItem from './GoodsListItem';

export default {
  name: "GoodsList",
  components: {
    GoodsListItem
  },
  props:{
    goods:{
      type:Array,
      default() {
        return []
      }
    }
  },
  
};
</script>
<style  scoped>
/*@import url(); 引入公共css类*/
.goods {
    display: flex;
    flex-wrap: wrap;/*换行，第一行在上方。 */
    justify-content: space-around;/*	项目位于各行之前、之间、之后都留有空白的容器内。 */

    padding: 2px;
  }

</style>