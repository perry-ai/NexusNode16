// server/api/createTag.js
const { exec } = require('child_process')
const mytoolsConfig = require('../../../mytools.config.js') // 根据实际路径调整
const targetDir = mytoolsConfig.tempDir

function createTag(req, res) {
    if (!req.body || typeof req.body !== 'object') {
        res.status(400).json({ error: 'Invalid request body' })
        return
    }
    const { branch, repo } = req.body
    if (!branch || !repo) {
        res.status(400).json({ error: 'Branch and repo are required' })
        return
    }
    // 确保目标目录存在，如果不存在则创建
    const fs = require('fs')
    const path = require('path')
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
        console.log(`Created directory: ${targetDir}`)
    }
    const command = `git clone -b ${branch} ${repo}`
    exec(command, { cwd: targetDir }, (error, stdout, stderr) => {
        // console.log(`Command executed: ${command}`);
        // console.log(`Stdout: ${stdout}`);
        // console.log(`Stderr: ${stderr}`);
        // console.log(`Error: ${error}`);
        if (error) {
            res.status(500).json({ result: `Error: ${error.message}` })
            return
        }
        // if (stderr) {
        //     res.status(500).json({ result: `Stderr: ${stderr}` })
        //     return
        // }
        res.json({ result: `Stdout: ${stdout}` })
    })
}


module.exports = function (app) {
    app.post('/git/createTag', (req, res) => {
        console.log('Received parameters:', req.body); // 打印请求参数
        createTag(req, res)
        // res.status(200).json({ message: 'Success' }); // 返回成功响应
    });
};