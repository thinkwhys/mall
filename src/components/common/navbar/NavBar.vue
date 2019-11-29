<template>
  <div class="nav-bar">   <!-- slot一般用div包裹来设置样式 -->
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="center">
      <slot name="center"></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.nav-bar {
  height: 44px;
  display: flex;
  line-height: 44px;
  text-align: center; 
  box-shadow: 0 1px 1px rgba(100, 100, 100, 0.1);
}
.left,
.right {
  width: 60px;
}
.center {
  flex: 1;
}
</style>
