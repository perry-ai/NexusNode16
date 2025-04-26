<template>
  <div class="contact-page">
    <el-card class="contact-card">
      <!-- 标题部分 -->
      <div class="header">
        <h1>📞 联系我们</h1>
        <h2 class="english-text">📞 Contact Us</h2>
      </div>

      <!-- 联系方式 -->
      <el-divider content-position="left">📱 联系方式 / Contact Information</el-divider>
      <div class="section">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card shadow="hover" class="info-card">
              <h3>👨‍💻 项目维护者</h3>
              <p>perry-ai</p>
              <h3>📧 电子邮件</h3>
              <p>perry-ai@outlook.com</p>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover" class="info-card">
              <h3>🌐 项目地址</h3>
              <p>https://github.com/perry-ai/NexusNode16</p>
              <h3>📄 许可证</h3>
              <p>MIT License</p>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 项目信息 -->
      <el-divider content-position="left">ℹ️ 项目信息 / Project Information</el-divider>
      <div class="section">
        <el-row :gutter="20" class="highlight-box">
          <el-col :span="24">
            <h3>NexusNode16 是一个基于 Node.js 16+ 的全栈开发工具包</h3>
            <p class="english-text">NexusNode16 is a comprehensive full-stack development toolkit built on Node.js 16+</p>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 可以添加表单数据等
    }
  }
}
</script>

<style scoped>
.contact-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.contact-card {
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1, .header h2 {
  margin: 10px 0;
}

.section {
  margin: 20px 0;
}

.info-card {
  margin-bottom: 20px;
  padding: 20px;
}

.highlight-box {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.english-text {
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
}
</style>
