// server/api/index.js
const fs = require('fs')
const path = require('path')

// 使用一个静态对象来存储已经注册过的接口路径
const registeredRoutes = {}
// 初始化时将自身文件路径添加到已注册的路由中
registeredRoutes[path.resolve(__filename)] = true
function registerRoutes(app, dir) {
  // 获取当前目录下的所有文件和子目录
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      // 如果是目录，递归遍历子目录
      registerRoutes(app, filePath)
    } else if (file.endsWith('.js')) {
      // 如果是 JavaScript 文件，检查是否已经注册过
      if (!registeredRoutes[filePath]) {
        // 如果未注册过，引入并注册路由
        const route = require(filePath)
        route(app)
        // 标记为已注册
        registeredRoutes[filePath] = true
      } else {
        console.log(`Route already registered: ${filePath}`)
      }
    }
  })
}

module.exports = function (app) {
  const apiDir = path.join(__dirname)
  registerRoutes(app, apiDir)
  // 打印已注册的接口列表
  console.log('Registered Routes:\n', Object.keys(registeredRoutes).join('\n'));
}