<!--  -->
<template>
  <div class>
    <swiper v-if="swiperImages.length" class="detail-swiper">
      <swiper-item v-for="(item,index) in swiperImages" :key="index">
        <a href="#">
          <img :src="item" alt="" >
        </a>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>

import { Swiper, SwiperItem } from "components/common/swiper";

export default {
  components: {
    Swiper,
    SwiperItem
  },
  props:{
    swiperImages:{
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
.detail-swiper{
  height: 350px;
  overflow: hidden;
}
</style>