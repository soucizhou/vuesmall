<!--  -->
<template>
  <div class>
    <nav-bar>
      <div slot="left" class="back" @click="backClick">
        <img src="~assets/img/common/back.svg" alt />
      </div>
      <div slot="center" class="titles">
        <div 
        class="titles-item" 
        v-for="(item, index) in titles" :key="item.id" 
        :class="{active : index === currentIndex}"
        @click="titleClick(index)"
        >
        {{item}}</div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";

export default {

  name: "DetailNavBar",
  components: {
    NavBar
  },
  data() {
    //这里存放数据
    return {
      titles: ["商品", "参数", "评论", "推荐"],
      currentIndex:0
    };
  },
  methods: {
    //把点击的index传给保存的变量
    titleClick(index) {
      this.currentIndex = index
    //把点击的标题传出去，搞联动
      this.$emit('titleClick', index)
    },
    //返回页面
    backClick() {
      // this.$router.go(-1)
      this.$router.back()
    }
  }
};
</script>
<style  scoped>
/*@import url(); 引入公共css类*/
.titles {
  display: flex;
}

.titles-item {
  flex: 1;
}

.active {
  color: red;
}

.back img{
  margin-top: 12px;
}
</style>