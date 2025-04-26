// components/TopNav.vue
<template>
  <el-menu 
    :default-active="activeIndex" 
    class="el-menu-demo" 
    @select="handleSelect"
    :style="{height: '100vh', width: '120px'}">
    <el-menu-item index="1">
      <template #title>
        <a @click.prevent="navigateTo('/')">
          <i class="el-icon-house"></i>
          <span>首页</span>
        </a>
      </template>
    </el-menu-item>
    <el-menu-item index="2">
      <template #title>
        <a @click.prevent="navigateTo('/LLM')">
          <i class="el-icon-cpu"></i>
          <span>LLM</span>
        </a>
      </template>
    </el-menu-item>
    <el-menu-item index="3">
      <template #title>
        <a @click.prevent="navigateTo('/document')">
          <i class="el-icon-document"></i>
          <span>文档功能</span>
        </a>
      </template>
    </el-menu-item>
    <el-menu-item index="4">
      <template #title>
        <a @click.prevent="navigateTo('/BizTable')">
          <i class="el-icon-s-grid"></i>
          <span>表格功能</span>
        </a>
      </template>
    </el-menu-item>
    <div style="margin-top: auto">
      <el-divider></el-divider>
      <el-menu-item index="5">
        <template #title>
          <a @click.prevent="navigateTo('/about')">
            <i class="el-icon-info"></i>
            <span>关于</span>
          </a>
        </template>
      </el-menu-item>
      <el-menu-item index="6">
        <template #title>
          <a @click.prevent="navigateTo('/contact')">
            <i class="el-icon-phone"></i>
            <span>联系我们</span>
          </a>
        </template>
      </el-menu-item>
    </div>
  </el-menu>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '1'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
      this.activeIndex = key
    },
    navigateTo(path) {
      this.$router.push(path)
    }
  },
}
</script>

<style scoped>
.el-menu-demo {
  position: fixed;
  left: 0;
  top: 0;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.el-menu-demo:not(.el-menu--collapse) {
  width: 120px;
}

.el-menu-item a {
  padding: 0 10px;
}


.el-menu-demo a {
  text-decoration: none;
  color: inherit;
}

.el-menu-item {
  padding: 0 !important;
}

.el-menu-item a {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 10px !important;
  justify-content: flex-start;
}

.el-menu-item i {
  width: 24px;
  text-align: center;
  font-size: 20px;
  margin: 0;
}

</style>
