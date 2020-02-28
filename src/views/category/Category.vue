<template>
  <div id="category">
    <nav-bar class="nav-bar">
      <div slot="center">商品分类</div>
    </nav-bar>
    <div class="content">
      <tab-menu :categories="categories" @selectItem="selectItem" />
      <scroll class="tab-content">
        <div>
          <tab-content :categoriesProduct="categoriesProduct"></tab-content>
          <tab-control :titles="['综合', '新品', '销量']"
                     @tabClick="tabClick" />
          <tab-content-detail :categoryDetail="showCategoryDetail"></tab-content-detail>            
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import Scroll from "components/common/scroll/Scroll";
import TabControl from "components/content/tabControl/TabControl";

import TabMenu from "./childComps/TabMenu";
import TabContent from "./childComps/TabContent";
import TabContentDetail from './childComps/TabContentDetail';

import { POP, SELL, NEW } from "common/const";
import { tabControlMixin } from "common/mixin";
import {
  getCategory,
  getSubcategory,
  getCategoryDetail
} from "network/category";

export default {
  name: "Category",
  components: {
    NavBar,
    TabMenu,
    TabContent,
    Scroll,
    TabControl,
    TabContentDetail
  },
  data() {
    return {
      categories: [], //分类list存名字
      categoriesProduct: [], //子分类的list
      categoryData: {//商品详情
      },
      currentIndex: -1
    };
  },
  mixins:[tabControlMixin],
  created() {
    this._getCategory();
  },
  computed:{
    //把左边点击和tabcontrol点击后的数据传给子组件      
    showCategoryDetail() {
        if (this.currentIndex === -1) return []
		    return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
      }
  },
  methods: {
    _getCategory() {
      getCategory().then(res => {
        //获取分类的list
        // console.log(res)
        this.categories = res.data.category.list;
        //初始化分类商品详情
        for (let i = 0; i < this.categories.length; i++) {

          this.categoryData[i] = {
            subcategories: {},//存储点击左边分类后的数据
            categoryDetail: {//存储点击tabcontrol后的数据
              'pop': [],
              'new': [],
              'sell': []
            }
          }
        }
        // 请求第一个分类的数据
        this._getSubcategory(0);
      });
    },
    //tabmenu点击传过来的index
    _getSubcategory(index) {
      //把选中的index存起来
      this.currentIndex = index;
      //根据选中的index拿到每个子分类的maitKey
      const maitKey = this.categories[index].maitKey;
      //通过maitKey拿到res数据
      getSubcategory(maitKey).then(res => {
        // console.log(res) 
        this.categoriesProduct = res.data.list;
        //商品详情项对应左边分类对应的数据初始化
        this.categoryData[index].subcategories = res.data
        this.categoryData = {...this.categoryData}

        this._getCategoryDetail(POP)
        this._getCategoryDetail(SELL)
        this._getCategoryDetail(NEW)
      });
    },
    //tabcontentdetail数据
    _getCategoryDetail(type) {
      // 获取请求的miniWallkey ，categories分类list有miniWallkey
      const miniWallkey = this.categories[this.currentIndex].miniWallkey;
      //发送请求,传入miniWallkey和type
      getCategoryDetail(miniWallkey, type).then(res => {
        // 将获取的数据保存下来
        // console.log(this.categoryData)
        //把根据categories分类list里的miniWallkey拿到的数据传给商品详情里的点击项的type分类里
        this.categoryData[this.currentIndex].categoryDetail[type] = res
        this.categoryData = {...this.categoryData}
      })
    },

    //根据tabmenu点击传过来的index改变右上请求的数据
    selectItem(index) {
      this._getSubcategory(index);
    }
  }
};
</script>

<style scoped>
#category {
  height: 100vh;
}

.nav-bar {
  background-color: var(--color-tint);
  font-weight: 700;
  color: #fff;
}
.message-pass{
  white-space: nowrap;
  width: 375px;
}

.content {
  /* 超出部分隐藏 */
  overflow: hidden;
  position: absolute;
  left: 0;
  right: 0;
  top: 44px;
  bottom: 49px;

  display: flex;
}

.tab-content {
  height: 100%;
  flex: 1;
}
</style>
