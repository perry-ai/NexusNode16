import simpleGit from 'simple-git'
import path from 'path'
import mytoolsConfig from '../../../mytools.config.js' // 根据实际路径调整
const targetDir = mytoolsConfig.tempDir

// 提交更改
export async function commitChanges(repoPath, message, files = ['.']) {
  const git = simpleGit(repoPath)
  await git.add(files)
  return git.commit(message)
}

// 创建并切换新分支
export async function createBranch(repoPath, branchName) {
  const git = simpleGit(repoPath)
  await git.checkoutLocalBranch(branchName)
  await git.push('origin', branchName)
  return branchName
}

// 切换分支（支持远程分支）
export async function checkoutBranch(repoPath, branchName, isRemote = false) {
  const git = simpleGit(repoPath)
  return isRemote ? 
    git.checkout(`remotes/origin/${branchName}`) : 
    git.checkout(branchName)
}

// 合并分支（带冲突处理标记）
export async function mergeBranch(repoPath, sourceBranch, options = { '--no-ff': true }) {
  const git = simpleGit(repoPath)
  return git.mergeFromTo(sourceBranch, git.revparse(['--abbrev-ref', 'HEAD']), options)
}

// 拉取更新（带变基选项）
export async function pullUpdates(repoPath, branchName, rebase = true) {
  const git = simpleGit(repoPath)
  return rebase ? 
    git.pull('origin', branchName, { '--rebase': 'true' }) :
    git.pull('origin', branchName)
}

// 获取当前分支状态
export async function getCurrentBranch(repoPath) {
  const git = simpleGit(repoPath)
  return {
    branch: await git.revparse(['--abbrev-ref', 'HEAD']),
    status: await git.status()
  }
}

// 获取提交历史（简化版）
export async function getCommitHistory(repoPath, limit = 10) {
  const git = simpleGit(repoPath)
  return git.log({ maxCount: limit })
}

// 回滚到指定提交
export async function revertToCommit(repoPath, commitHash) {
  const git = simpleGit(repoPath)
  await git.reset(['--hard', commitHash])
  return git.push('origin', 'HEAD', {'--force': true})
}

/**
 * 示例：采用simple-git库进行git操作
 * 注意：运行环境需要提前完备git、ssh等配置
 * @param {*} repoURL 目标仓库路径
 * @param {*} branch 分支名
 * @returns
 */
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
