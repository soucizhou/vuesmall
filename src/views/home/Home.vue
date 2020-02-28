<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control" v-show="isTabFixed"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
    <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
    <recommend-view :recommends="recommends"/>
    <feature-view/>
    <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
    <good-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backClick" v-show="topShow"></back-top>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import Scroll from "components/common/scroll/Scroll";

import HomeSwiper from "./childrencomps/HomeSwiper";
import RecommendView from "./childrencomps/RecommendView";
import FeatureView from "./childrencomps/FeatureView";

import TabControl from "components/content/tabControl/TabControl";
import GoodList from "components/content/goods/GoodsList";
import BackTop from 'components/content/backTop/BackTop';

import { getHomeMultidata, getHomeGoods } from "network/home";
import { debounce } from "common/utils"
import { itemListenerMixin,backTop } from "common/mixin"

export default {
  name: "Home",
  data() {
    return {
      result: null,
      banners: [],//轮播图
      recommends: [],//轮播图下面那行
      goods: {//30个格子展示数据
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: "pop",//默认显示pop的数据
      // topShow:false,//不显示top图标
      isTabFixed:false,//不显示顶部的tabcontrol
      tabOffsetTop:0,//tabcontrol2的距离顶部的高度
      saveY:0,//记录离开时的位置
      // itemImgListener: null//.$bus.$off推荐更多传的函数
    };
  },
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodList,
    Scroll,
    BackTop
  },
  mixins:[itemListenerMixin, backTop],
  created() {
    //获取轮播图和轮播图下面一排的数据
    this.getHomeMultidata()
    //获取商品列表的数据
    this.getHomeGoods("pop")
    this.getHomeGoods("new")
    this.getHomeGoods("sell")
  },
  mounted() {
    // //通过$refs获取滚动组件里的refresh方法传入防抖函数
    // const refresh = debounce(this.$refs.scroll.refresh,50)
    // //抽离方法给$bus.$off用
    // this.itemImgListener = () => {
    //   refresh()
    // }
    // //接收列表的图片加载完成后刷新scroll计算高度
    // this.$bus.$on('itemImageLoad', this.itemImgListener)
    // // this.$bus.$on('itemImageLoad', () => {
    // //   // this.$refs.scroll.refresh() 
    // //   refresh()
    // // })
  },
  //钩子的触发顺序created-> mounted-> activated，退出时触发deactivated。
  //使用了keep-alive组件后才会有的，否则则不存在
  activated() {
    //滚动到记录的位置
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    // //重新计算位置
    this.$refs.scroll.refresh()
  },
  deactivated() {
    //记录位置
    this.saveY = this.$refs.scroll.getScrollY();
    //取消全局事件监听GoodslistItem
    this.$bus.$off('itemImageLoad',this.itemImgListener)
  },
  computed: {
    //动态传参给GoodsList组件
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  methods: {
    /**请求数据 */
    getHomeMultidata() {
      //存轮播图和下面的数据
      getHomeMultidata().then(res => {
        this.result = res;
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    
    getHomeGoods(type) {
      //先定义好默认第一页
      const page = this.goods[type].page + 1;
      //拿到页和type请求数据
      getHomeGoods(type, page).then(res => {
        //存数据,数组解析，一个一个传进去，不是直接全部复制
        this.goods[type].list.push(...res.data.list)
        //页码增加
        this.goods[type].page += 1
        //上拉加载更多的继续加载
        this.$refs.scroll.finishPullUp()
      }) 
    },

    /**事件监听 */
    //点击切换currentType的值
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";   
      }

      //改变子元素的data的值
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    //点击弹到顶部
    // backClick() {
    //   this.$refs.scroll.scrollTo(0,0,300)
    // },
    //接收滚动位置信息
    contentScroll(position) {
      this.listenBackTop(position)
      
      this.isTabFixed = (-position.y)> this.tabOffsetTop
    },
    //上拉加载
    loadMore() {
      this.getHomeGoods(this.currentType)
      this.$refs.scroll.refresh();
    },
    // 防抖函数,移到common/utils.js
    // debounce(func, delay) {
    //   let timer = null
    //   return function (...args) {
    //     if(timer) clearTimeout(timer)
    //     timer = setTimeout(() => {
    //       func.apply(this, args)
    //     }, delay)
    //   } 
    // },
    //轮播图的图片加载完成后记录组件距离顶部的高度
    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    }
  }
};
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 999;
}
.tab-control {
  position: relative;
 z-index: 9;
}
.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
</style>
