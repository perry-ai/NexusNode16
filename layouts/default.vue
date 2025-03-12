<template>
  <div>
    <TopNav class="top-nav" />
    <div class="container">
      <nuxt />
    </div>
  </div>
</template>

<script>
import TopNav from '~/components/TopNav.vue'

export default {
  components: {
    TopNav,
  },
}
</script>
<style>
html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

body {
  height: 100%;
  /* 确保根元素传递高度 */
  margin: 0;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.top-nav {
  height: 60px;
  /* 固定高度 */
  background-color: #fff;
  /* 可选：背景色 */
  border-bottom: 1px solid #ebeef5;
  /* 可选：底部边框 */
}

.container {
  height: calc(100vh - 60px);
  /* height: 100vh; */
  /* 确保父容器传递高度 */
}
</style>
