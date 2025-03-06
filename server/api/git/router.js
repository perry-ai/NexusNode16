// server/api/git/create-tag.js
import { exec } from 'child_process'

// 确保目标目录存在，如果不存在则创建
import fs from 'fs'

import path from 'path'

import mytoolsConfig from '../../../mytools.config.js' // 根据实际路径调整
const targetDir = mytoolsConfig.tempDir

function executeCommand(command, cwd) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Command failed: ${error.message}\nStderr: ${stderr}`))
        //   } else if (stderr) {
        //     reject(new Error(`Command failed: ${stderr}`));
      } else {
        resolve(stdout)
      }
    })
  })
}

async function createTag(req, res) {
  try {
    if (!req.body || typeof req.body !== 'object') {
      res.status(400).json({ error: 'Invalid request body' })
      return
    }
    const { branch, repo } = req.body
    if (!branch || !repo) {
      res.status(400).json({ error: 'Branch and repo are required' })
      return
    }

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
      console.log(`Created directory: ${targetDir}`)
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const tempProName = 'gitrepo' + timestamp
    const tempProPath = path.join(targetDir, tempProName)
    // Step 1: Clone the repository
    const cloneCommand = `git clone -b ${branch} ${repo} ${tempProName}`
    const cloneResult = await executeCommand(cloneCommand, targetDir)
    console.log(`Clone Result: ${cloneResult}`)

    // Step 2: Create a tag with a timestamp

    const tagName = `test-${timestamp}`
    const tagCommand = `git tag ${tagName}`
    const tagResult = await executeCommand(tagCommand, tempProPath)
    console.log(`Tag Result: ${tagResult}`)

    // Step 3: Push the tag to the remote repository
    const pushCommand = `git push origin ${tagName}`
    const pushResult = await executeCommand(pushCommand, tempProPath)
    console.log(`Push Result: ${pushResult}`)

    // All steps successful
    res.status(200).json({ result: `Tag ${tagName} created and pushed successfully` })
  } catch (error) {
    res.status(500).json({ result: `Error: ${error.message}` })
  }
}

export default function (app) {
  console.log('git router init ...')
  app.post('/git/createTag', async (req, res) => {
    console.log('Received parameters:', req.body) // 打印请求参数
    await createTag(req, res)
  })

  console.log('git router init ...... OK')
}
