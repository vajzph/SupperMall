import BackTop from 'components/content/backTop/BackTop'
import {debounce} from "common/utils"

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0)
    },
    listenShowBackTop(position) {
      this.isShowBackTop = (-position.y) > 1000
    }
  }
}

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    }
  },
  mounted() {
    //监听img加载完成
    const newRefresh = debounce(this.$refs.scroll.refresh, 50)

    this.itemImgListener = () => {
      newRefresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  },
}