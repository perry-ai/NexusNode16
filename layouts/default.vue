<template>
  <div class="app-container">
    <div class="nav-container">
      <Navigation />
    </div>
    <div class="content-container">
      <nuxt />
    </div>
  </div>
</template>

<script>
import Navigation from '~/components/Navigation.vue'

export default {
  components: {
    Navigation,
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

.app-container {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.nav-container {
  width: 120px;
  flex-shrink: 0;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 100;
  background: #fff;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
}

.content-container {
  flex: 1;
  padding: 20px;
  margin-left: 120px;
  overflow: auto;
  min-height: 100vh;
  background: #f5f7fa;
}
</style>
