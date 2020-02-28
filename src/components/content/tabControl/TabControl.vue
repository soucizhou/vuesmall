<template>
  <div class="tabcontrol">
      <div v-for="(item, index) in titles" :key="index" 
      class="tab-control-item"
      :class="{active:index === currentIndex}"
      @click="itemClick(index)"
      >
          <span>{{item}}</span>
      </div>
  </div>
</template>

<script>
  export default {
    name: "TabControl",
    data() {
        return {
            currentIndex:0
        }
    },
    props:{
        titles:{
            type:Array,
            default() {
                return []
            }
        }
    },
    methods:{
        //点击时记录当前选择，把当前选择的发出去
        itemClick(index) {
            this.currentIndex = index
            //切换数据要用
            this.$emit('tabClick',index)
        }
    }
  }
</script>

<style scoped>
  .tabcontrol{
      display: flex;
      text-align: center;
      height: 44px;
      line-height: 44px;
      background-color: #fff;
  }

  .tab-control-item{
      flex: 1;
  }
  
  .tab-control-item span {
    padding: 5px;
  }

  .active{
      color: var(--color-high-text);
  }
  .active span{
      border-bottom: 1px solid var(--color-high-text);
  }
</style>
