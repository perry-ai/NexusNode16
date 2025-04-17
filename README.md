# NexusNode16 🛠️ 
English|[中文版](README_CN.md)

[![Nuxt.js](https://img.shields.io/badge/Nuxt.js-00C58E?style=flat-square&logo=nuxt.js&logoColor=white)](https://nuxtjs.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

## 🏗️ Project Overview

> NexusNode16 is a comprehensive full-stack development toolkit built on Node.js 16+, designed to boost your productivity with its modular architecture and rich feature set. 🚀

Key highlights:
- 💻 **Full-stack Solution**: Combines Nuxt.js frontend with Express backend
- 🧩 **Modular Design**: Easy to extend with new features
- 🔌 **API Ready**: Built-in RESTful API endpoints
- 📊 **Data Processing**: Handle files, databases and Git repositories
- ⏱️ **Task Automation**: Schedule recurring jobs with cron syntax
- 🤖 **AI Integration**: Natural language processing capabilities

Perfect for:
- Developers needing a local productivity toolkit
- Teams requiring intranet deployment solutions
- Projects demanding file processing and data analysis

Built with Nuxt.js and Express

## ✨ Features

- **Frontend**: 
  - Nuxt.js (SPA mode) with Vue 2
  - Element UI component library integration
  - Responsive layout support
  - Client-side routing and state management
  
- **Backend**: 
  - Express.js RESTful APIs
  - Body-parser middleware for JSON requests
  - Custom error handling middleware
  
- **Database**: 
  - MySQL connection pooling
  - Raw SQL queries
  
- **File Processing**: 
  - DOCX template generation and parsing
  - Excel file import/export functionality
  - File upload/download endpoints
  
- **Git Operations**: 
  - Git repository cloning and analysis
  - Branch comparison and statistics
  - Commit history visualization
  
- **Scheduled Tasks**: 
  - Node-schedule based task runner
  - Support for both cron syntax and RecurrenceRule
  - Weekly Git repository analysis
  - Daily report generation
  
- **AI Assistant**: 
  - Natural language QA capabilities
  - Context-aware responses
  - Integration with LLM APIs

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+ recommended)
- MySQL (for database features)
- Git (for Git operations)

### Installation
```bash
# Clone the repository
git clone https://github.com/perry-ai/NexusNode16.git

# Install dependencies
npm install

```

### Running
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## ⚙️ Configuration

### Temporary Directory
Configure in `NexusNode16.config.js`:
```javascript
tempDir: 'D://temp' // Temporary file storage directory
```

### Database Connection
Configure in `NexusNode16.config.js`:
```javascript
databases: [
  {
    name: 'dev',
    config: {
      host: 'localhost',
      user: 'username',
      password: 'password',
      database: 'dbname',
      connectionLimit: 10
    }
  }
]
```

### API Key Configuration
Configure in `private.config.js` (not tracked by git):
```javascript
export default {
  apiKey: 'your-api-key-here'
}
```

### Backend Configuration
- Edit `server/index.js` for server settings
- API routes are registered in `server/api/register.js`

### Scheduled Tasks
Configure tasks in `server/schedule/task.config.js`:
```javascript
{
  name: 'task_name',
  rule: '0 9 * * *', // Cron syntax
  task: async () => {
    // Task implementation
  }
}
```

## 📂 Project Structure

```
├── assets/            # Static assets
├── components/        # Vue components
├── layouts/           # Layout components
├── middleware/        # Nuxt middleware
├── pages/             # Application views
├── plugins/           # Nuxt plugins
├── server/            # Express server
│   ├── api/           # API routes
│   ├── customization/ # Custom modules
│   └── schedule/      # Scheduled tasks
├── static/            # Static files
├── store/             # Vuex store
└── test/              # Unit tests
```

## 📜 License

MIT © [perry-ai](LICENSE)
