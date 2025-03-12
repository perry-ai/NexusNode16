import fs from 'fs'
import path from 'path'
// 使用一个静态对象来存储已经注册过的表接口
const registeredTableApi = {}

/**
 * 扫描目标目录下的所有js文件，并注册路由
 * js文件需导出出一个routes数组用于注册，形如：
 * const routes = [
    {
      method: 'post',
      path: '/tableA/select',
      handler: selectQuery,
      requiresEnv: true, // 需要 env 参数
    },
    {
      method: 'post',
      path: '/tableA/updateByID',
      handler: updateByIdQuery,
      requiresEnv: true,
    },
  ]
 * 示例可参考tables/tableA.js
 * @param {*} app express实例
 * @param {*} dir 目标目录
 */
async function scanTablesApi(app, dir) {
  // 获取当前目录下的所有文件和子目录
  const pathDir = path.resolve(dir)
  const files = fs.readdirSync(pathDir)

  for (const file of files) {
    const filePath = path.join(pathDir, file)
    const stat = fs.statSync(filePath)

    // 检查目标目录下js文件，进行数据库接口路由注册
    if (stat.isDirectory()) {
      // 如果是目录，递归遍历子目录
      await scanTablesApi(app, filePath)
    } else if (file.endsWith('.js')) {
      // 如果是 JavaScript 文件，检查是否已经注册过
      if (!registeredTableApi[filePath]) {
        // 如果未注册过，引入并注册路由
        const module = await import(new URL('file://' + filePath))
        const routes = module.routes
        // 采用表自定义配置，扫描器统一注册的方式
        routes.forEach((route) => {
          app[route.method](route.path, async (req, res) => {
            try {
              // 入参打印
              console.log('Received request ', req.body)

              // 执行路由处理函数
              await route.handler(req, res)
            } catch (error) {
              res.status(400).json({ error: error.message })
            }
          })
          console.log(`Registered Database APIs: ${route.method.toUpperCase()} ${route.path}`)
        })

        // 标记为已注册
        registeredTableApi[filePath] = true
      } else {
        console.log(`Route already registered: ${filePath}`)
      }
    }
  }
}
async function registerRoutes(app) {
  console.log('database router init ...')
  // 扫描database/tables目录下所有js文件进行接口注册
  await scanTablesApi(app, './server/api/database/tables')

  console.log('database router init ...... OK')
}

export default registerRoutes
