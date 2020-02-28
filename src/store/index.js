import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  state:{
  //定义一个变量存储添加来的商品，一个个push进来，都是对象
  //别的地方渲染数据为{{$store.state.cartList}}   
   cartList:[]
  },
  mutations,
  actions,
  getters
  // mutations: {
  //   addCart(state, payload) {
  //     //定义一个变量保存 添加来的商品是不是已经添加过了
  //     let oldProduct = state.cartList.find(item => item.iid === payload.iid)
  //     //如:点了一次addCart添加衣服对象，cartList为空，衣服对象的iid不等于cartList里的iid，oldProduct的值为空，下面的判断进入到else
  //     //else里面在衣服对象里添加一个count属性，值为1
  //     //把带有count的新衣服对象添加到cartList数组里

  //     //点第二次addCart添加衣服对象，cartList里有刚加的衣服了，带了count，上面的判断等于，oldProduct的值为刚加的衣服对象, 进入到if(oldProduct) 
  //     //衣服对象里的count += 1
  //     if(oldProduct) {
  //       oldProduct.count += 1 
  //     } else {
  //       payload.count = 1 //第一次为null，在商品对象里面添加count属性，值为1
  //       state.cartList.push(payload)
  //     }

  //   }
  // }
})

export default store