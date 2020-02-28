<template>
  <div class="bottom-menu">
    <check-button class="select-all"  @click.native="checkBtnClick" :isChecked="isSelectAll"></check-button>
    <span>全选</span>
    <span class="total-price">合计:{{totalPrice}}</span>
    <span class="buy-product" @click="calcClick">去计算({{checkLength}})</span>
  </div>
</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton';
import { mapGetters } from 'vuex';

export default {
  name: 'CartBottomBar',
  components:{
      CheckButton
  },
  methods:{
      checkBtnClick() {
        //如果原来都是选中，点击一次，全部不选中
        //如果原来都是不选中（某些不选中），全部选中
        if(this.isSelectAll){
          this.cartList.forEach(item => item.checked = false)
        } else {
          this.cartList.forEach(item => item.checked = true)
        }
      },
      calcClick() {
        if(!this.isSelectAll) {
          this.$toast.show('捡钱')
        }
      } 
  },
  computed:{
      ...mapGetters(['cartList']),
      totalPrice(){
        //购物车里filter取出选中的item，再reduce汇总
        //reduce(初始值或计算结束后的返回值，当前值),0是可选。传递给函数的初始值
        //toFixed() 方法可把 Number 四舍五入为指定小数位数的数字。
        return '￥' + this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.count * item.price
        }, 0).toFixed(2)
      },
      //去计算里选中的长度filter过滤
      checkLength(){ 
          return this.cartList.filter(item => item.checked).length;
      },
      //全选是否选中
      isSelectAll () {
          //如果没有添加商品时为false
          if (this.cartList.length === 0) return false 
          // return this.cartList.find(item => item.checked === false ) === undefined
          //find没选中的，如果有就为ture，再取反，返回false，如果没有没选中的就为fasle，再去反，返回true
          return !this.cartList.find(item => !item.checked)
      }

  }
 }
</script>

<style scoped>


  .bottom-menu {
    width: 100%;
    height: 44px;
    background-color: #eee;
    position: fixed;
    bottom: 49px;
    left: 0;
    box-shadow: 0 -2px 3px rgba(0, 0, 0, .2);
    font-size: 14px;
    color: #888;
    line-height: 44px;
    padding-left: 35px;
    box-sizing: border-box;
  }

  .bottom-menu .select-all {
    position: absolute;
    line-height: 0;
    left: 12px;
    top: 13px;
  }

  .bottom-menu .total-price {
    margin-left: 15px;
    font-size: 16px;
    color: #666;
  }

  .bottom-menu .buy-product {
    background-color: orangered;
    color: #fff;
    width: 100px;
    height: 44px;
    text-align: center;
    line-height: 44px;
    float: right;
  } 

</style>