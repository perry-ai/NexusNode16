import express from 'express'
import consola from 'consola'
import { Nuxt, Builder } from 'nuxt'
import bodyParser from 'body-parser'
import register from './api/register.js'

const app = express()

// Import and Set Nuxt.js options
import config from '../nuxt.config.js'

config.dev = process.env.NODE_ENV !== 'production'

async function start() {
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
  // 注册所有接口
  console.log('Registering API routes...')
  await register(app)

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  })
}
start()
