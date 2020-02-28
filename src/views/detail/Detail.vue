<!--  -->
<template>
  <div id="detail">
    <detail-nav-bar ref="nav" class="detail-nav"  @titleClick="titleClick" />
    <scroll class="content" ref="scroll" :probeType="3" @scroll="contentScroll">
      <detail-swiper :swiper-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @detailImageLoad="detailImageLoad" />
      <detail-param-info ref="param" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
    <detail-bottom-bar @addToCart="addToCart" />
    <back-top @click.native="backClick" v-show="topShow" />
  </div>
</template>

<script>
import DetailNavBar from "./childrenComps/DetailNavBar";
import DetailSwiper from "./childrenComps/DetailSwiper";
import DetailBaseInfo from "./childrenComps/DetailBaseInfo";
import DetailShopInfo from "./childrenComps/DetailShopInfo";
import DetailGoodsInfo from "./childrenComps/DetailGoodsInfo";
import DetailParamInfo from "./childrenComps/DetailParamInfo";
import DetailCommentInfo from "./childrenComps/DetailCommentInfo";
import GoodsList from "components/content/goods/GoodsList";
import DetailBottomBar from "./childrenComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend
} from "network/detail";
import { debounce } from "common/utils";
import { itemListenerMixin, backTop } from "common/mixin";
import { mapActions } from 'vuex'

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar
  },
  mixins: [itemListenerMixin, backTop],
  data() {
    return {
      iid: null, //把iid存起来
      topImages: [], //存轮播图的地址
      goods: {}, //存轮播图下面的商铺数据
      shop: {}, //存店铺
      detailInfo: {}, //存商品详情
      paramInfo: {}, //商品参数
      commentInfo: {}, //评论信息
      recommends: [], //推荐更多
      // itemImgListener:null//.$bus.$off推荐更多传的函数
      themeTopYs: [0, 1000, 2000, 3000], //存每个子组件的offsetTop
      getThemeTopY: null, //获取每个子组件offsetTop的函数
      currentIndex: 0 //存导航栏的标签位置
    };
  },
  created() {
    //赋值iid
    this.iid = this.$route.params.iid;
    //请求拿到id后的数据
    this.getDetail();
    //推荐更多
    this.getRecommend();
    //每个组件的offsetTop的方法通过防抖变成新的函数
  },
  // mounted() {
  //   //通过$refs获取滚动组件里的refresh方法传入防抖函数
  //   const refresh = debounce(this.$refs.scroll.refresh,50)
  //   //抽离方法给$bus.$off用
  //   this.itemImgListener = () => {
  //     refresh()
  //   }
  //   //接收列表的图片加载完成后刷新scroll计算高度
  //   this.$bus.$on('itemImageLoad', this.itemImgListener)
  //   // this.$bus.$on('itemImageLoad', () => {
  //   //   // this.$refs.scroll.refresh()
  //   //   refresh()
  //   // })
  // },
  destroyed() {
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  }, //生命周期 - 销毁完成
  methods: {
    //导入解构
    ...mapActions(['addCart']),
    //请求数据
    getDetail() {
      getDetail(this.iid).then(res => {
        const data = res.result;
        //保存轮播图的图片
        this.topImages = data.itemInfo.topImages;
        //通过new 构造函数传参整合轮播图下面的信息
        this.goods = new Goods(
          data.itemInfo,
          data.columns,
          data.shopInfo.services
        );
        //存店铺信息
        this.shop = new Shop(data.shopInfo);
        //商品详情
        this.detailInfo = data.detailInfo;
        //商品参数
        this.paramInfo = new GoodsParam(
          data.itemParams.info,
          data.itemParams.rule
        );
        
        //评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0];
        }
      });
      
    },
    getRecommend() {
      getRecommend().then(res => {
        this.recommends = res.data.list;

        // this.getThemeTop = debounce(() => {
        //   this.titleClickY();
        // }, 100);
        //themeTopYs存每个组件的offsetTop
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.param.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        //假多加一个假组件的值，最大值
        this.themeTopYs.push(Number.MAX_SAFE_INTEGER);

        //console.log(this.themeTopYs);
      }, 100)
      });
    },
    //接收DetailGoodsInfo图片加载完成后重新计算滚动的高度
    detailImageLoad() {
      //获取子组件DetailGoodsInfo里的方法
      // this.$refs.scroll.refresh() //改mixin里的防抖函数包裹的refresh
      this.newRefresh();
      //获取每个子组件的offsetTop,防抖的新函数
      this.getThemeTopY();
    },
    
    //点击滚动到组件的offsetTop位置
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200);
    },
    //监听滚动的位置，导航标签变颜色
    contentScroll(position) {
      const positionY = -position.y;
      this.listenBackTop(position);
      let length = this.themeTopYs.length;
      for (let i = 0; i < length - 1; i++) {
        if (
          this.currentIndex !== i &&
          positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1]
        ) {
          this.currentIndex = i;
          //把判断后的值赋值给子组件里的选中颜色
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }
    },
    //点击加入购物车
    addToCart() {
      //获取购物车需要展示的信息定义一个空对象，然后往里面添加
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      // this.$store.dispatch("addCart", product).then(res => {
      //   console.log(res)
      // });
      //导入解构后
      this.addCart(product).then(res => {
        this.$toast.show(res, 2000);
      })
    }
  }
};
</script>
<style  scoped>
/**  .detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 60px;
  left: 0;
  right: 0;
}

.detail-nav{
    position: relative;
    z-index: 9;
    background: #fff;
  } 
  */

   #detail {
    height: 100vh;
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    position: absolute;
    top: 44px;
    bottom: 60px;
  }
  .detail-nav{
    position: relative;
    z-index: 9;
    background: #fff;
  }

  .back-top {
    position: fixed;
    right: 10px;
    bottom: 65px;
  }
</style>

