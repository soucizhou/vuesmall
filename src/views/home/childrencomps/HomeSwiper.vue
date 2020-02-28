<!--  -->
<template>
    <swiper v-if="banners.length">
      <swiper-item v-for="(item,index) in banners" :key="index">
        <a :href="item.link">
          <img :src="item.image" alt="" @load="ImageLoad">
        </a>
      </swiper-item>
    </swiper>
</template>

<script>
import { Swiper, SwiperItem } from "components/common/swiper";

export default {
  name: "HomeSwiper",
  components: {
    Swiper,
    SwiperItem
  },
  props: {
    banners: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      isLoad: false
    };
  },
  methods: {
    //监听图片加载完成发送方法给Home.vue
    ImageLoad() {
      //load发了4次，太多，实际只需要获取一次的高度
      if (!this.isLoad) {
        this.$emit('swiperImageLoad')
        this.isLoad = true
      }
      
    }
  }
};
</script>
<style  scoped>
/*@import url(); 引入公共css类*/

</style>