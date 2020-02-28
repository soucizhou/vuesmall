<!--  -->
<template>
  <div class="check-button">
      <div class="icon-selector" :class="{check:isChecked}"> 
        <img src="~/assets/img/cart/tick.svg" alt="">
      </div>
    </div>
</template>

<script>

export default {
  name: 'CheckButton',
  components: {},
  // data() {
  //   return {
  //     checked: this.isChecked
  //   }
  // },
  props:{
      isChecked:{
        type:Boolean,
        default:false
    }
  },
  // watch: {
	// 	isChecked: function (newValue) {
  //       console.log(newValue)
  //       this.checked = newValue;
  //     }
  //   }
};
</script>
<style  scoped>
/*@import url(); 引入公共css类*/
.icon-selector {
    border-radius: 50%;
    border: 2px solid #ccc;
}
.check {
    background-color: #ff8198;
    border-color: #ff8198;
  }
</style>