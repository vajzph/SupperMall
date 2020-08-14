import {ADD_COUNTER, ADD_TO_CART} from './mutations-types'

export default {
  addCart(context, payload) {
    /*数组常用的方法 
       push/pop/shift/unshift/sort/reverse/map/filter/reduce/join/splice
    
    let oldProduct = null
    for (let item of context.state.cartList) {
      if (item.iid === payload.iid) {
        oldProduct = item
      }
    }
    if (oldProduct) {
      oldProduct.count += 1
    } else {
      payload.count = 1
      context.state.cartList.push(payload)
    }
    */
    return new Promise((resolve, reject) => {
      // 1.查找之前cartList数组中是否有该商品
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid);
      // 2.判断oldProduct
      if (oldProduct) { //已存在购物车的该商品数量+1
        //oldProduct++
        context.commit(ADD_COUNTER,oldProduct)
        resolve('当前商品数量+1')
      } else { //添加新的商品到购物车
        payload.count = 1;
        //context.state.cartList.push(payload);
        context.commit(ADD_TO_CART,payload)
        resolve('已添加新商品')
      } 
    })
  }
}