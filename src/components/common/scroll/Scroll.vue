<template>
  <div ref="wrapper">
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  name: "Scroll",
  data() {
    return {
      scroll: {} //定义个变量scroll保存
    };
  },
  props: {
    //监听位置，0,1不侦测位置，2不包括惯性，3，全部侦测
    probeType: {
      type: Number,
      default: 1
    },
    //
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  //mounted:在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作
  mounted() {
    setTimeout(this.__initScroll, 20);
  },
  methods: {
    //滑动到指定位置
    scrollTo(x, y, time = 1000) {
      this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time)
    },
    //标识一次上拉加载动作结束
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp && this.scroll.finishPullUp()
    },
    //重置刷新
    refresh() {
      this.scroll && this.scroll.refresh && this.scroll.refresh()
    },
    //得到高度
    getScrollY(){
      return this.scroll ? this.scroll.y : 0;
    },
    __initScroll() {
      if (!this.$refs.wrapper) return
      //启用滚动，监听位置，通过$refs获取，ref明确绑定
      this.scroll = new BScroll(this.$refs.wrapper, {
        //监听位置，0,1不侦测位置，2不包括惯性，3，全部侦测
        probeType: this.probeType,
        //click设置为true才能监听到点击事件仅限制div那些,不限制button
        click: true,
        //pullUpLoad上拉加载设置为true或者obj开启
        pullUpLoad: this.pullUpLoad
      });

      //侦测位置
      this.scroll.on("scroll", position => {
        //把位置的值发给调用者
        this.$emit("scroll", position);
      });
      //上拉加载加载到最底部时发送请求
      this.scroll.on("pullingUp", () => {
        //把到底部时的方法发出去
        this.$emit("pullingUp");
      });
    }
  },
  watch: {
		  data() {
        setTimeout(this.refresh, 20)
      }
  }
  
};
</script>

<style scoped>
</style>
