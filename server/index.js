const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser')
const app = express()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(bodyParser.json())
  // 新增 POST 接口 /createTag
  // app.post('/createTag', (req, res) => {
  //   console.log('Received parameters:', req.body) // 打印请求参数
  //   res.status(200).json({ message: 'Success' }) // 返回成功响应
  // })
  // 引入并注册所有接口
  console.log('Registering API routes...')
  const apiRoutes = require('./api')
  apiRoutes(app)

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()