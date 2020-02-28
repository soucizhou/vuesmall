import { ADD_COUNTER, ADD_TO_CART } from './mutations-types'

export default {
  //常量使用[]，好处是定义常量的地方改了，其他地方就都改了
  [ADD_COUNTER](state, payload) {
    //如果已经有衣服数量加1
    payload.count += 1
  },
  [ADD_TO_CART](state, payload) {
    //要写在push的前面，等于加了属性在加入到cartList，写在下面就等于没加上
    payload.checked = false
    //如果没有衣服就添加到cartList存起来
    state.cartList.push(payload)
  }
}