import { debounce } from "common/utils"
import BackTop from 'components/content/backTop/BackTop';
import {POP, NEW, SELL, BACKTOP_DISTANCE} from "./const";

//搞一个对象存GoodsListItem的全局事件监听
export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,//.$bus.$off推荐更多传的函数
      // refresh: null//详情页不能滚动的bug处理把刷新计算高度放这里
      newRefresh: null,
    };
  },
  mounted() {
    //通过$refs获取滚动组件里的refresh方法传入防抖函数
    // this.refresh = debounce(this.$refs.scroll.refresh, 50)
    this.newRefresh = debounce(this.$refs.scroll.refresh, 100)
    //抽离方法给$bus.$off用
    this.itemImgListener = () => {
      // this.refresh()
      this.newRefresh()
    }
    //接收列表的图片加载完成后刷新scroll计算高度
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  },
}

//回到顶部
export const backTop = {
  components: {
    BackTop
  },  
  data() {
    return {
      topShow:false
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, BACKTOP_DISTANCE00)
    },
    //methods中的方法中的方法不能合并，只能提取出来
    listenBackTop(position) {
      this.topShow = -position.y > 1000
    }
  },
}

export const tabControlMixin = {
  data: function () {
    return {
      currentType: POP
    }
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
    }
  }
}
