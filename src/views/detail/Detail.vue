<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"/>
    <scroll class="content" ref="scroll">
      <detail-swiper :topImages="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="paramInfo"/>
      <detail-comment-info :comment-info="commentInfo"/>
      <goods-list :goods="recommends"/>
    </scroll>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo"
import DetailParamInfo from "./childComps/DetailParamInfo"
import DetailCommentInfo from "./childComps/DetailCommentInfo"

import Scroll from "components/common/scroll/Scroll";
import GoodsList from "components/content/goods/GoodsList";
import { getDetail, Goods, Shop,GoodsParam, getRecommend } from "network/detail";
import {debounce} from "common/utils"
import {itemListenerMixin} from "common/mixin"
export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    Scroll
  },
  mixins: [itemListenerMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      // itemListener: null    //mixin
    };
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid;

    // 2. 根据iid请求详情数据
    getDetail(this.iid).then(res => {
      // 1. 获取顶部轮番数据
      console.log(res);
      const data = res.result;
      this.topImages = data.itemInfo.topImages;

      // 2.获取商品详细信息  整合数据
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      // 3.获取店铺信息
      this.shop = new Shop(data.shopInfo);

      // 4.保存商品详情数据
      this.detailInfo = data.detailInfo;

      //5. 获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
    
      // 6. 取出评论信息
      if( data.rate.cRate !== 0 ){
        this.commentInfo = data.rate.list[0];
      }

    });

    // 3. 请求详情数据
    getRecommend().then( res => {
      this.recommends = res.data.list;
    })
  },
  mounted() {
    //  提取到 common/mixin.js中， 减少冗余代码
  },
  deactivated() {  /* 有缓存的Keep-alive 才会调用，因为 detail没有缓存，所以不会回调 */
    console.log("deactivated");
  },
  destroyed() {  /* 一定会回调destory() */
    console.log("destory");
    this.$bus.$off('itemImgLoad', this.itemListener)
  },
  methods: {
    imageLoad(){
      this.$refs.scroll.refresh();
    }
  }
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.content{
  height: calc(100% - 44px);
}
</style>
