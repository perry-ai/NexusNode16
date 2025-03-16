import axios from 'axios'
import mytoolsConfig from '../../../mytools.config.js'

const headersParams = {
  'Content-Type': 'application/json',
}
// 如果this.form.apikey非空，则不送Authorization
if (mytoolsConfig?.apiKey) {
  headersParams.Authorization = `Bearer ${mytoolsConfig?.apiKey}`
}

// 示例：非自动扫描注册，采用具体引入进行路由注册
export default function (app) {
  console.log('transfer router init ...')

  // deepseek请求转发
  app.post('/transfer/deepseek', async (req, res) => {
    try {
      console.log('Received parameters:', req?.body)
      if (!req?.body?.content) {
        res.status(200).json({ result: `Error: content is empty` })
      }
      // 开始转发
      console.log('transfer begin, content:', req?.body?.content)
      const requestBody = {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: req?.body?.content,
          },
        ],
        stream: false,
      }
      const response = await axios.post('https://api.deepseek.com/chat/completions', requestBody, {
        headers: headersParams,
      })
      const responseData = response.data.choices ? response.data.choices[0].message.content : response.data
      console.log('transfer end, responseData:', responseData)
      res.status(200).json({ result: responseData })
    } catch (error) {
      res.status(500).json({ result: `Error: ${error.message}` })
    }
  })

  console.log('transfer router init ...... OK')
}
