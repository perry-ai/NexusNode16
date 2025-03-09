import simpleGit from 'simple-git'
import path from 'path'
import mytoolsConfig from '../../../mytools.config.js' // 根据实际路径调整
const targetDir = mytoolsConfig.tempDir

export async function simpleCreateTag(repoURL, branch) {
  const git = simpleGit()
  try {
    // yyyyMMddHHmmss形式的时间戳
    // 时间戳生成（推荐方案1）
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, 14)
    const tempProName = 'gitrepo' + timestamp
    const tempProPath = path.join(targetDir, tempProName)
    // 指定分支
    await git.clone(repoURL, tempProPath, { '--branch': branch })
    console.log('克隆完成')

    // 切换到临时目录
    const gitRepo = simpleGit(tempProPath)

    const tagName = `test-${timestamp}`
    // 创建带信息的annotated tag
    await gitRepo.tag(['-a', tagName, '-m', 'test info'])
    console.log('Tag 创建成功')

    await gitRepo.push('origin', tagName)
    console.log('Tag 推送成功')
    return tagName
  } catch (error) {
    console.error('Git操作失败:', error.message)
  } finally {
  }
}
