# NexusNode16 🛠️ 
[English](README.md)|中文版  
[![Nuxt.js](https://img.shields.io/badge/Nuxt.js-00C58E?style=flat-square&logo=nuxt.js&logoColor=white)](https://nuxtjs.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

## 🏗️ 项目概述

> NexusNode16 是基于Node.js 16+构建的全栈开发工具集，采用模块化架构和丰富功能设计，旨在提升开发效率。✨

核心亮点：
- 💻 **全栈解决方案**：整合Nuxt.js前端与Express后端
- 🧩 **模块化设计**：轻松扩展新功能
- 🔌 **API就绪**：内置RESTful API接口
- 📊 **数据处理**：支持文件、数据库和Git仓库操作
- ⏱️ **任务自动化**：使用cron表达式调度任务
- 🤖 **AI集成**：自然语言处理能力

适用场景：
- 开发者需要的本地生产力工具包
- 团队需要的内部网部署方案
- 需要文件处理和数据管理的项目

基于Nuxt.js和Express构建

## ✨ 功能特性

- **前端**: 
  - 基于Nuxt.js(SPA模式)和Vue 2
  - 集成Element UI组件库
  - 支持响应式布局
  - 客户端路由和状态管理
  
- **后端**: 
  - Express.js RESTful API接口
  - 使用body-parser中间件处理JSON请求
  - 自定义错误处理中间件
  
- **数据库**: 
  - MySQL连接池管理
  - 原生SQL查询
  
- **文件处理**: 
  - DOCX模板生成和解析
  - Excel文件导入/导出功能
  - 文件上传/下载接口
  
- **Git操作**: 
  - Git仓库克隆和分析
  - 分支对比和统计
  - 提交历史可视化
  
- **定时任务**: 
  - 基于node-schedule的任务调度
  - 支持cron表达式和RecurrenceRule
  - 每周Git仓库分析
  - 每日报告生成
  
- **AI助手**: 
  - 自然语言问答能力
  - 上下文感知响应
  - 集成大语言模型API

## 🚀 快速开始

### 环境要求
- Node.js (推荐v16+)
- MySQL (用于数据库功能)
- Git (用于Git操作)

### 安装步骤
```bash
# 克隆仓库
git clone https://github.com/perry-ai/NexusNode16.git

# 安装依赖
npm install

```

### 运行项目
```bash
# 开发模式
npm run dev

# 生产环境构建
npm run build
npm start
```

## ⚙️ 配置说明

### 临时目录配置
在`NexusNode16.config.js`中配置:
```javascript
tempDir: 'D://temp' // 临时文件存储目录
```

### 数据库连接配置
在`NexusNode16.config.js`中配置:
```javascript
databases: [
  {
    name: 'dev',
    config: {
      host: 'localhost',
      user: '用户名',
      password: '密码',
      database: '数据库名',
      connectionLimit: 10
    }
  }
]
```

### API密钥配置
在`private.config.js`中配置(不纳入git版本控制):
```javascript
export default {
  apiKey: '你的API密钥'
}
```

### 后端配置
- 修改`server/index.js`中的服务器设置
- API路由注册在`server/api/register.js`中

### 定时任务配置
在`server/schedule/task.config.js`中配置任务:
```javascript
{
  name: '任务名称',
  rule: '0 9 * * *', // Cron表达式
  task: async () => {
    // 任务实现
  }
}
```

## 📂 项目结构

```
├── assets/            # 静态资源
├── components/        # Vue组件
├── layouts/           # 布局组件
├── middleware/        # Nuxt中间件
├── pages/             # 应用页面
├── plugins/           # Nuxt插件
├── server/            # Express服务器
│   ├── api/           # API路由
│   ├── customization/ # 自定义模块
│   └── schedule/      # 定时任务
├── static/            # 静态文件
├── store/             # Vuex状态管理
└── test/              # 单元测试
```

## 📜 许可证

MIT © [perry-ai](LICENSE)
