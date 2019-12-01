

import { debounce } from "common/utils";

// 变量 components data 生命周期函数 methods 等都可以混入
export const itemListenerMixin = {
  data() {
    return {
      itemListener: null
    };
  },
  mounted() {
     const refresh = debounce(this.$refs.scroll.refresh, 200);
     this.itemListener = () => {
       refresh();
     };
     this.$bus.$on("itemImgLoad", this.itemListener);
     console.log("我是mixin内容");
  },
}