<template>
  <div class="about-page">
    <el-card class="about-card">
      <!-- 标题部分 -->
      <div class="header">
        <h1>🌟 NexusNode16 项目介绍</h1>
        <h2 class="english-text">🌟 NexusNode16 Project Introduction</h2>
      </div>

      <!-- 项目概述 -->
      <el-divider content-position="left">📖 项目概述 / Project Overview</el-divider>
      <div class="section">
        <p>NexusNode16 是一个基于 Node.js 16+ 的全栈开发工具包，旨在通过其模块化架构和丰富的功能集提高您的生产力。🚀</p>
        <p class="english-text">NexusNode16 is a comprehensive full-stack development toolkit built on Node.js 16+, designed to boost your productivity with its modular architecture and rich feature set. 🚀</p>
        
        <el-row :gutter="20" class="highlight-box">
          <el-col :span="12">
            <h3>✨ 主要特点 / Key Highlights:</h3>
            <ul>
              <li>💻 <strong>全栈解决方案</strong> - Nuxt.js 前端 + Express 后端</li>
              <li>🧩 <strong>模块化设计</strong> - 易于扩展新功能</li>
              <li>🔌 <strong>API 就绪</strong> - 内置 RESTful API 端点</li>
              <li>📊 <strong>数据处理</strong> - 处理文件、数据库和 Git 仓库</li>
              <li>⏱️ <strong>任务自动化</strong> - 使用 cron 语法调度任务</li>
              <li>🤖 <strong>AI 集成</strong> - 自然语言处理能力</li>
            </ul>
          </el-col>
          <el-col :span="12">
            <h3>🎯 适用场景 / Perfect for:</h3>
            <ul>
              <li>需要本地生产力工具包的开发者</li>
              <li>需要内网部署解决方案的团队</li>
              <li>需要文件处理和数据分析的项目</li>
            </ul>
          </el-col>
        </el-row>
      </div>

      <!-- 技术栈 -->
      <el-divider content-position="left">🛠️ 技术栈 / Tech Stack</el-divider>
      <div class="section">
        <el-row :gutter="20">
          <el-col :span="8" v-for="tech in techStack" :key="tech.name">
            <el-card shadow="hover" class="tech-card">
              <div class="tech-icon">{{ tech.emoji }}</div>
              <h3>{{ tech.name }}</h3>
              <p><span class="chinese-text">{{ tech.desc.split(' / ')[0] }}</span><br>
              <span class="english-text">{{ tech.desc.split(' / ')[1] }}</span></p>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 快速开始 -->
        <el-divider content-position="left"><span class="chinese-text">🚀 快速开始</span> <span class="english-text">/ Quick Start</span></el-divider>
      <div class="section">
        <el-steps :active="4" align-center>
          <el-step title="克隆仓库" description="git clone https://github.com/perry-ai/NexusNode16.git"></el-step>
          <el-step title="安装依赖" description="npm install"></el-step>
          <el-step title="开发模式" description="npm run dev"></el-step>
          <el-step title="生产构建" description="npm run build & npm start"></el-step>
        </el-steps>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      techStack: [
        { emoji: '🟢', name: 'Nuxt.js', desc: '服务端渲染框架 / SSR Framework' },
        { emoji: '🟩', name: 'Vue.js', desc: '前端框架 / Frontend Framework' },
        { emoji: '⚫', name: 'Express', desc: '后端框架 / Backend Framework' },
        { emoji: '🔵', name: 'MySQL', desc: '关系型数据库 / Relational Database' },
        { emoji: '🟣', name: 'Element UI', desc: 'UI组件库 / UI Component Library' },
        { emoji: '🟠', name: 'Node.js', desc: 'JavaScript运行时 / JavaScript Runtime' }
      ]
    }
  }
}
</script>

<style scoped>
.about-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.about-card {
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

.english-text {
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
}

.section {
  margin: 20px 0;
}

.highlight-box {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.tech-card {
  margin-bottom: 20px;
  text-align: center;
  height: 100%;
}

.tech-icon {
  font-size: 2.5rem;
  margin: 10px 0;
}

ul {
  padding-left: 20px;
}

li {
  margin-bottom: 8px;
}
</style>
