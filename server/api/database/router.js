import fs from 'fs'
import path from 'path'
// 使用一个静态对象来存储已经注册过的表接口
const registeredTableApi = {}
async function scanTablesApi(app, dir) {
  // 获取当前目录下的所有文件和子目录
  const pathDir = path.resolve(dir)
  const files = fs.readdirSync(pathDir)

  for (const file of files) {
    const filePath = path.join(pathDir, file)
    const stat = fs.statSync(filePath)

    // 检查目标目录下所有xxx-router.js文件，进行路由注册
    if (stat.isDirectory()) {
      // 如果是目录，递归遍历子目录
      await scanTablesApi(app, filePath)
    } else if (file.endsWith('.js')) {
      // 如果是 JavaScript 文件，检查是否已经注册过
      if (!registeredTableApi[filePath]) {
        // 如果未注册过，引入并注册路由
        const module = await import(new URL('file://' + filePath))
        const routes = module.routes
        // console.log('routes>', await import(new URL('file://' + filePath)))
        // console.log(routes)
        routes.forEach((route) => {
          app[route.method](route.path, async (req, res) => {
            try {
              // 入参打印
              console.log('Received request ', req.body)
              // 执行公共校验
              // validateRequestBody(req)
              // validateEnv(req, mytoolsConfig.databases)

              // // 如果需要字段校验（根据路由配置）
              // if (route.allowedFields) {
              //   validateFields(req, route.allowedFields)
              // }

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
  await scanTablesApi(app, './server/api/database/tables')

  console.log('database router init ...... OK')
}

export default registerRoutes
