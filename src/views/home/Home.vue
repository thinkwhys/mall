<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
      class="tab-control1"
      :titles="['流行','新款','精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      v-show="isTabFixed"
    />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      :pull-up-load="true"
      @pullingUp="loadMore"
      @scroll="contentScroll"
    >
      <!--  probeType=3 只要滚动就监听 -->
      <home-swiper :banners="banners" @swiperImageLoad.once="swiperImageLoad" />
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control
        class="tab-control"
        :titles="['流行','新款','精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      />
      <goods-list :goods="showGoods" />
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
    <!-- 监听组件点击必须要加native -->
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "./childComps/TabControl";

import { getHomeMultidata, getHomeGoods } from "network/home";
import { debounce } from "common/utils";

export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        // 用于保存商品的数据结构
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: "pop",
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY:0  /* 记录离开首页的位置 */
    };
  },

  created() {
    // 1.请求首页多条数据
    // 具体逻辑写在methods
    this.getHomeMultidata();

    // 2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },

  mounted() {
    // 1. 监听 GoodsListitem 中图片加载完成   /* 防抖 */
    const refresh = debounce(this.$refs.scroll.refresh, 200);
    this.$bus.$on("itemImageLoad", () => {
      refresh(); /* 重新刷新，解决卡顿bug */
    });

    // 2.获取tabControl的offsetTop
    // 所有的组件都有一个属性$el：用于获取组件中的元素
    console.log();
  },

  computed: {
    /* 复杂的表达式尽量转换成计算属性 */
    showGoods() {
      return this.goods[this.currentType].list;
    }
  },
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    this.$refs.scroll.refresh(); /* 强制刷新排除不能滚动、莫名突然回到顶部情况 */
  },
  deactivated() {
    this.saveY = this.$refs.scroll.scroll.y;
  },
  methods: {
    /**
     *     事件监听相关
     */

    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },

    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 300);
    },
    contentScroll(position) {
      // 1. 判断BackTop是否显示
      this.isShowBackTop = (-position.y) > 1000;
      //2. 决定tabContro是否吸顶
      this.isTabFixed = (-position.y) > this.tabOffsetTop;
    },
    loadMore() {
      /* 上拉加载更多 */
      this.getHomeGoods(this.currentType);
    },
    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },

    /**
     *       网络请求相关
     */
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },

    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
        /* 完成上拉加载更多 */
        this.$refs.scroll.finishPullUp(); /* Scroll默认加载一次，调用finishPullUp */
      });
    }
  }
};
</script>

<style scoped>
#home {
  /* padding-top: 44px; */
  height: 100vh; /* 100% view height */
  /* position: relative; */
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
  /* 在使用浏览器原生滚动时，为了使浏览器不随一起滚动 */
 /*  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}
.content {
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 9;
}
.tab-control {
  position: relative;
  z-index: 9;
}

/* .content {
  height: calc( 100% - 93px );
  overflow: hidden;
  margin-top: 44px;
} */
</style>
