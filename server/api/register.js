import fs from 'fs'
import path from 'path'

// 使用一个静态对象来存储已经注册过的接口路径
const registeredRoutes = {}
async function registerRoutes(app, dir) {
  // 获取当前目录下的所有文件和子目录
  const pathDir = path.resolve(dir)
  const files = fs.readdirSync(pathDir)

  for (const file of files) {
    const filePath = path.join(pathDir, file)
    const stat = fs.statSync(filePath)

    // 检查目标目录下所有xxx-router.js文件，进行路由注册
    if (stat.isDirectory()) {
      // 如果是目录，递归遍历子目录
      await registerRoutes(app, filePath)
    } else if (file.endsWith('router.js')) {
      // 如果是 JavaScript 文件，检查是否已经注册过
      if (!registeredRoutes[filePath]) {
        // 如果未注册过，引入并注册路由
        const route = await import(new URL('file://' + filePath))
        route.default(app)
        // 标记为已注册
        registeredRoutes[filePath] = true
      } else {
        console.log(`Route already registered: ${filePath}`)
      }
    }
  }
}

export default async function (app) {
  await registerRoutes(app, './server/api')
  // 打印已注册的接口列表
  console.log('Registered Routes:\n' + Object.keys(registeredRoutes).join('\n'))
}
