<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="paramInfo" ref="param"/>
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <goods-list :goods="goodsItem" ref="recommend"/>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <detail-bottom-bar @addCart = "addToCart"/>
  </div>
</template>

<script>
import DetailNavBar from './chilidComps/DetailNavBar'
import DetailSwiper from './chilidComps/DetailSwiper'
import DetailBaseInfo from './chilidComps/DetailBaseInfo'
import DetailShopInfo from './chilidComps/DetailShopInfo'
import DetailGoodsInfo from './chilidComps/DetailGoodsInfo'
import DetailParamInfo from './chilidComps/DetailParamInfo'
import DetailCommentInfo from './chilidComps/DetailCommentInfo'
import DetailBottomBar from './chilidComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'

import {getDetail, getRecommend, Goods, Shop, GoodsParam} from 'network/detail'
import {debounce} from "common/utils"
import {itemListenerMixin, backTopMixin} from "common/mixin"

export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    GoodsList,
    Scroll
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      goodsItem: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
    }
  },
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh()
      this.getThemeTopY()
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index] +44, 50) 
    },
    contentScroll(position) {
      //1.获取Y值
      const positionY = -position.y
      //2.positionY与主题中的值进行对比 
      /* 第一次和最后一次会越界
      for (let i in this.themeTopYs) {
        1. i = i*1  2. parseInt(i) 
        if (positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) {
          i =this.currentIndex
          this.$refs.nav.currentIndex = this.currentIndex
        } 
      } */

      // 方法二：
      // let length = this.themeTopYs.length
      // this.themeTopYs.forEach((currentThemeTopY, index) => {
      //   if (this.currentIndex !== index && ((index < length - 1 && positionY >= this.themeTopYs[index] && 
      //   positionY < this.themeTopYs[index+1]) || (index === length - 1 && positionY >=this.themeTopYs[index]))) {
      //     this.currentIndex = index;
      //     this.$refs.nav.currentIndex = this.currentIndex;
      //   }
      // })

      // 方法二优化：
      // [0, 2613, 3969, 4164, Number.MAX_VALUE]
      // positoinY 在 0 和 2613之间，index = 0
      // positoinY 在 =2613 和 3969之间，index = 1
      // positoinY 在 =3969 和 4164之间，index = 2
      // positoinY 在 4164 和 非常大的值之间，index = 3
      let length = this.themeTopYs.length
      for (let i = 0; i < length-1; i++) {
        if (this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }

      this.listenShowBackTop(position)
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
    addToCart() {
      const product = {}
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.newPrice;
      product.realPrice = this.goods.realPrice;
      product.iid = this.iid;

      this.$store.dispatch('addCart', product).then(res => {
        /* this.show = true;
        this.message = res;
        setTimeout(() => {
          this.show = false;
          this.message = '';
        }, 2000) */
        /* this.$toast.show(res) */
        this.$toast.show()
      })
    }
  },
  created() {
    this.iid = this.$route.params.iid

    //请求详情数据
    getDetail(this.iid).then(res =>{
      /*  console.log(res); */
      // 1.获取数据
      const data = res.result;
      // 2.取出顶部轮播图的数据
      this.topImages = res.result.itemInfo.topImages
      // 3.创建商品的对象
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      // 4.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)
      // 5.取出商品详细信息
      this.detailInfo = data.detailInfo
      // 6.取出参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      // 7.取出评论的信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
      
    })

    //请求推荐数据
    getRecommend().then(res => {
      this.goodsItem = res.data.list
    })

    //给getThemeTopY赋值
    this.getThemeTopY = debounce(() => {
      //图片还没加载
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.param.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      this.themeTopYs.push(Number.MAX_VALUE)
      /* console.log(this.themeTopYs); */
    })
  },
  mounted() {},
  deactivated() {
    //取消全局事件监听
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  },
}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 11;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px - 49px);
  }

</style>