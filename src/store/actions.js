import { ADD_COUNTER, ADD_TO_CART } from './mutations-types'

export default {
  addCart(context, payload) {
      return new Promise((resolove, reject) => {
        //定义一个变量保存 添加来的商品是不是已经添加过了
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      //如:点了一次addCart添加衣服对象，cartList为空，衣服对象的iid不等于cartList里的iid，oldProduct的值为空，下面的判断进入到else
      //else里面在衣服对象里添加一个count属性，值为1
      //把带有count的新衣服对象添加到cartList数组里

      //点第二次addCart添加衣服对象，cartList里有刚加的衣服了，带了count，上面的判断等于，oldProduct的值为刚加的衣服对象, 进入到if(oldProduct) 
      //衣服对象里的count += 1
      if (oldProduct) {
        // oldProduct.count += 1
        context.commit(ADD_COUNTER, oldProduct)
        resolove('商品数量+1')
      } else {
        payload.count = 1 //第一次为null，在商品对象里面添加count属性，值为1
        // context.state.cartList.push(payload)
        context.commit(ADD_TO_CART, payload)
        resolove('添加商品成功')
      }
      })
      
  }
}