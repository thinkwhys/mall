<template>
<!-- 只是文字不同，所以不用slot，谁用谁传文字就行 -->
  <div class="tab-control">
    <div class="tab-control-item" 
        v-for="( item, index ) in titles" 
        :key="index"
        :class="{active: index === currentIndex}"
        @click = "itemClick(index)">
      <span>{{item}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabControl',
  props: {
    titles:{
      type: Array,
      default(){
        return []
      }
    }
  },
  data() {
    return {
      currentIndex: 0
    };
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index;
      this.$emit('tabClick',index);
    }
  },
};
</script>

<style scoped>
.tab-control {
  display: flex;
  text-align: center;
  font-size: 16px;
  height: 40px; /* height 字体等属性可以继承 */
  line-height: 40px;
  background-color: #fff;
}
.tab-control-item span {
  padding: 6px;
}
.tab-control-item{
  flex:1;
}
.active {
  color: var(--color-high-text);
  
}
.active span {
  border-bottom: 3px solid var(--color-high-text);
}
</style>
