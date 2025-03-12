import { simpleCreateTag } from './git-use-simple.js'
import { createTag } from './git-use-child-process.js'

// 示例：非自动扫描注册，采用具体引入进行路由注册
export default function (app) {
  console.log('git router init ...')
  // 采用child_process进行git操作的示例
  // 请求和响应在具体方法createTag中自行处理的示例
  app.post('/git/createTag', async (req, res) => {
    console.log('Received parameters:', req.body) // 打印请求参数
    await createTag(req, res)
  })

  // 采用simple-git进行git操作的示例
  // 请求和响应在外部处理的示例
  app.post('/git/simpleCreateTag', async (req, res) => {
    try {
      console.log('Received parameters:', req.body)
      const tagName = await simpleCreateTag(req.body.repo, req.body.branch)
      res.status(200).json({ result: `Tag ${tagName} created and pushed successfully` })
    } catch (error) {
      res.status(500).json({ result: `Error: ${error.message}` })
    }
  })

  console.log('git router init ...... OK')
}
