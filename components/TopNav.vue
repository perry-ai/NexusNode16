// components/TopNav.vue
<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
    background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
    <el-menu-item index="1">
      <nuxt-link to="/">首页</nuxt-link>
    </el-menu-item>
    <el-menu-item index="2">
      <nuxt-link to="/about">关于</nuxt-link>
    </el-menu-item>
    <el-menu-item index="3">
      <nuxt-link to="/contact">联系我们</nuxt-link>
    </el-menu-item>
    <el-menu-item index="4">
      <nuxt-link to="/LLM">LLM</nuxt-link>
    </el-menu-item>
    <el-menu-item index="5">
      <nuxt-link to="/document">文档功能示例</nuxt-link>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '1',
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
      this.activeIndex = key
    },
  },
}
</script>

<style scoped>
.el-menu-demo a {
  text-decoration: none;
  color: #fff;
}
</style>
