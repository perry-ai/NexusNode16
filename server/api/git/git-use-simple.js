import simpleGit from 'simple-git'
import path from 'path'
import mytoolsConfig from '../../../mytools.config.js' // 根据实际路径调整


// 克隆远端仓库到指定目录
export async function cloneRepo(repoURL, branchName, targetDir) {
  const git = simpleGit()
  await git.clone(repoURL, targetDir, { '--branch': branchName })
  return targetDir
}

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
  return git.push('origin', 'HEAD', { '--force': true })
}

// 比较两个版本间的提交差异
export async function compareCommitDiffs(repoPath, fromRef, toRef, limit = 50) {
  const git = simpleGit(repoPath)
  try {
    const log = await git.log({
      from: fromRef,
      to: toRef,
      maxCount: limit,
      symmetric: false
    })
    return log.all.map(commit => ({
      id: commit.hash,
      author: commit.author_name,
      email: commit.author_email,
      date: new Date(commit.date),
      message: commit.message,
      parent: commit.parents
    }))
  } catch (error) {
    console.error('提交历史比较失败:', error.message)
    return []
  }
}

// 比较两个版本间的文件差异（带行数统计）
export async function compareFileDiffs(repoPath, fromRef, toRef) {
  const git = simpleGit(repoPath)
  try {
    // 同时获取变更状态和行数统计
    const [statusDiff, numstatDiff] = await Promise.all([
      git.diff([`${fromRef}..${toRef}`, '--name-status']),
      git.diff([`${fromRef}..${toRef}`, '--numstat'])
    ])

    // 构建复合结果
    const statusMap = parseStatusDiff(statusDiff)
    return parseNumstatDiff(numstatDiff).map(item => ({
      ...item,
      status: statusMap.get(item.file) || '修改' // 默认状态为修改
    }))
  } catch (error) {
    console.error('文件差异比较失败:', error.message)
    return []
  }

  // 解析 --name-status 输出
  function parseStatusDiff(raw) {
    return new Map(
      raw.split('\n')
        .filter(Boolean)
        .map(line => {
          const [code, file] = line.split('\t')
          return [file, getStatusText(code)]
        })
    )
  }

  // 解析 --numstat 输出
  function parseNumstatDiff(raw) {
    return raw.split('\n')
      .filter(Boolean)
      .map(line => {
        const [add, del, ...fileParts] = line.split('\t')
        return {
          file: fileParts.join('\t'), // 处理含空格的文件名
          changes: {
            added: add === '-' ? 0 : parseInt(add) || 0,
            deleted: del === '-' ? 0 : parseInt(del) || 0
          }
        }
      })
  }

  function getStatusText(code) {
    const statusMap = { A: '新增', D: '删除', M: '修改', R: '重命名', C: '复制' }
    return statusMap[code[0]] || '未知变更'
  }
}
/**
 * 示例：采用simple-git库进行git操作
 * 注意：运行环境需要提前完备git、ssh等配置
 * @param {*} repoURL 目标仓库路径
 * @param {*} branch 分支名
 * @returns
 */
export async function simpleCreateTag(repoURL, branch) {
  const targetDir = mytoolsConfig.tempDir
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


async function test() {
  const targetDir = mytoolsConfig.tempDir
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, 14)
  const tempProName = 'gitrepo' + timestamp
  const tempProPath = path.join(targetDir, tempProName)
  await cloneRepo('git@github.com:perry-ai/MyTools.git', 'main', tempProPath)
  await compareCommitDiffs(tempProPath, )


}

if (require.main === module) {
  await test()
}