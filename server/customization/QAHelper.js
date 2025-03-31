import { simpleGit } from 'simple-git'
import ExcelJS from 'exceljs'
import path from 'path'
import mytoolsConfig from '../../mytools.config.js'
import { compareCommitDiffs, compareFileDiffs } from '../api/git/git-use-simple.js'

const git = simpleGit()
const tempDir = mytoolsConfig.tempDir

/**
 * Git仓库分析工具类
 */
export class GitBranchAnalyzer {
  /**
   * 初始化分析器
   * @param {string} repoUrl Git仓库地址
   * @param {string} mainBranch 主干分支名(默认'main')
   */
  constructor(repoUrl, mainBranch = 'main', options = {}) {
    this.repoUrl = repoUrl
    this.mainBranch = mainBranch
    this.repoPath = ''
    this.options = {
      taskPattern: /^\d+[:：]\s/, // 默认匹配"数字: "或"数字："格式
      cache: true, // 启用缓存
      ...options
    }
    this.analysisResult = {
      repoInfo: {
        url: repoUrl,
        mainBranch,
        analyzedAt: new Date().toISOString()
      },
      branches: [],
      members: {}, // 成员工作统计
      tasks: {}    // 任务分析数据
    }
    this.cacheDir = path.join(tempDir, 'git_analysis_cache')
  }

  /**
   * 克隆仓库到临时目录
   */
  async cloneRepository() {
    const timestamp = Date.now()
    this.repoPath = path.join(tempDir, `repo_${timestamp}`)
    await git.clone(this.repoUrl, this.repoPath)
    this.gitRepo = simpleGit(this.repoPath)
    return this.repoPath
  }

  /**
   * 获取所有领先于主干的分支
   */
  async getAheadBranches() {
    await this.gitRepo.fetch()
    const branches = await this.gitRepo.branch(['-r'])
    
    // 过滤出领先于主干的分支
    const aheadBranches = []
    for (const branch of branches.all) {
      if (branch === `origin/${this.mainBranch}`) continue
      
      const isAhead = await this.checkBranchAhead(branch)
      if (isAhead) {
        aheadBranches.push(branch.replace('origin/', ''))
      }
    }
    
    return aheadBranches
  }

  /**
   * 检查分支是否领先于主干
   */
  async checkBranchAhead(branchName) {
    const compare = await this.gitRepo.raw([
      'rev-list',
      '--left-right',
      '--count',
      `origin/${this.mainBranch}...${branchName}`
    ])
    const [behind, ahead] = compare.trim().split('\t').map(Number)
    return ahead > 0
  }

  /**
   * 分析分支差异
   */
  async analyzeBranch(branchName) {
    const branchData = {
      branch: branchName,
      commits: [],
      files: [],
      taskIds: new Set(),
      authors: new Set()
    }

    // 获取提交差异
    const commits = await compareCommitDiffs(
      this.repoPath, 
      `origin/${this.mainBranch}`, 
      `origin/${branchName}`
    )
    
    // 分析提交信息
    for (const commit of commits) {
      // 提取任务ID (支持两种格式)
      let taskId = 'unknown'
      
      // 格式1: 数字: 描述 (如 123: 新增功能)
      const numPrefixMatch = commit.message.match(this.options.taskPattern)
      if (numPrefixMatch) {
        taskId = commit.message.split(/[:：]/)[0].trim()
      } 
      // 格式2: 原有JIRA/TAPD格式 (如 PROJ-123)
      else {
        const jiraMatch = commit.message.match(/[A-Z]+-\d+/g)
        if (jiraMatch) {
          taskId = jiraMatch[0]
        }
      }
      
      branchData.taskIds.add(taskId)
      
      // 统计作者工作
      if (!this.analysisResult.members[commit.author]) {
        this.analysisResult.members[commit.author] = {
          commitCount: 0,
          addedLines: 0,
          deletedLines: 0,
          branches: new Set()
        }
      }
      this.analysisResult.members[commit.author].commitCount++
      this.analysisResult.members[commit.author].branches.add(branchName)
    }

    branchData.commits = commits

    // 获取文件差异
    const files = await compareFileDiffs(
      this.repoPath,
      `origin/${this.mainBranch}`,
      `origin/${branchName}`
    )
    
    // 统计代码变更量
    files.forEach(file => {
      const author = commits.find(c => c.id === file.commitId)?.author
      if (author) {
        this.analysisResult.members[author].addedLines += file.changes.added
        this.analysisResult.members[author].deletedLines += file.changes.deleted
      }
    })

    branchData.files = files
    this.analysisResult.branches.push(branchData)
    
    // 关联任务数据
    branchData.taskIds.forEach(taskId => {
      const taskKey = taskId === 'unknown' ? 'unknown' : `task-${taskId}`
      if (!this.analysisResult.tasks[taskKey]) {
        this.analysisResult.tasks[taskKey] = {
          id: taskId,
          branches: new Set(),
          commitCount: 0,
          fileCount: 0,
          type: taskId === 'unknown' ? 'unknown' : 
               taskId.match(/[A-Z]+-\d+/) ? 'jira' : 'numeric'
        }
      }
      this.analysisResult.tasks[taskKey].branches.add(branchName)
      this.analysisResult.tasks[taskKey].commitCount += commits.length
      this.analysisResult.tasks[taskKey].fileCount += files.length
    })

    return branchData
  }

  /**
   * 生成Excel报告
   */
  async generateExcelReport() {
    const workbook = new ExcelJS.Workbook()
    
    // 1. 分支概览工作表
    const branchSheet = workbook.addWorksheet('分支概览')
    branchSheet.columns = [
      { header: '分支名称', key: 'branch', width: 30 },
      { header: '提交数量', key: 'commitCount', width: 15 },
      { header: '变更文件数', key: 'fileCount', width: 15 },
      { header: '新增行数', key: 'addedLines', width: 15 },
      { header: '删除行数', key: 'deletedLines', width: 15 },
      { header: '关联任务数', key: 'taskCount', width: 15 }
    ]

    for (const branch of this.analysisResult.branches) {
      const addedLines = branch.files.reduce((sum, file) => sum + file.changes.added, 0)
      const deletedLines = branch.files.reduce((sum, file) => sum + file.changes.deleted, 0)

      branchSheet.addRow({
        branch: branch.branch,
        commitCount: branch.commits.length,
        fileCount: branch.files.length,
        addedLines,
        deletedLines,
        taskCount: branch.taskIds.size
      })
    }

    // 2. 成员工作统计
    const memberSheet = workbook.addWorksheet('成员工作')
    memberSheet.columns = [
      { header: '成员', key: 'member', width: 20 },
      { header: '提交次数', key: 'commits', width: 15 },
      { header: '新增代码', key: 'added', width: 15 },
      { header: '删除代码', key: 'deleted', width: 15 },
      { header: '参与分支', key: 'branches', width: 30 }
    ]

    Object.entries(this.analysisResult.members).forEach(([member, data]) => {
      memberSheet.addRow({
        member,
        commits: data.commitCount,
        added: data.addedLines,
        deleted: data.deletedLines,
        branches: Array.from(data.branches).join(', ')
      })
    })

    // 3. 任务分析
    const taskSheet = workbook.addWorksheet('任务分析')
    taskSheet.columns = [
      { header: '任务ID', key: 'taskId', width: 20 },
      { header: '任务类型', key: 'taskType', width: 15 },
      { header: '分支名称', key: 'branch', width: 30 },
      { header: '提交数量', key: 'commits', width: 15 },
      { header: '变更文件', key: 'files', width: 15 }
    ]

    Object.entries(this.analysisResult.tasks).forEach(([taskId, data]) => {
      // 每个分支单独一行
      Array.from(data.branches).forEach(branchName => {
        // 查找该分支的提交和文件数
        const branchData = this.analysisResult.branches.find(b => b.branch === branchName)
        const branchCommits = branchData?.commits.length || 0
        const branchFiles = branchData?.files.length || 0

        taskSheet.addRow({
          taskId: data.id,
          taskType: data.type === 'jira' ? 'JIRA' : 
                   data.type === 'numeric' ? '数字ID' : '未知',
          branch: branchName,
          commits: branchCommits,
          files: branchFiles
        })
      })
    })

    // 4. 详细变更
    await this.addDetailSheet(workbook)

    // 保存文件
    const reportPath = path.join(tempDir, `code_quality_report_${Date.now()}.xlsx`)
    await workbook.xlsx.writeFile(reportPath)
    return reportPath
  }

  /**
   * 添加详细变更工作表
   */
  async addDetailSheet(workbook) {
    const sheet = workbook.addWorksheet('详细变更')

    sheet.columns = [
      { header: '分支', key: 'branch', width: 20 },
      { header: '提交ID', key: 'commitId', width: 15 },
      { header: '作者', key: 'author', width: 20 },
      { header: '日期', key: 'date', width: 20 },
      { header: '消息', key: 'message', width: 40 },
      { header: '文件', key: 'file', width: 40 },
      { header: '变更类型', key: 'changeType', width: 15 },
      { header: '新增行', key: 'added', width: 10 },
      { header: '删除行', key: 'deleted', width: 10 },
      { header: '整体差异', key: 'totalDiff', width: 50 }
    ]

    for (const branch of this.analysisResult.branches) {
      // 获取分支与主干的整体差异
      const totalDiffs = await compareFileDiffs(
        this.repoPath,
        `origin/${this.mainBranch}`,
        `origin/${branch.branch}`
      )
      
      const totalAdded = totalDiffs.reduce((sum, file) => sum + file.changes.added, 0)
      const totalDeleted = totalDiffs.reduce((sum, file) => sum + file.changes.deleted, 0)
      
      // 生成文件差异列表
      const fileDiffs = totalDiffs.map(file => 
        `${file.file} (${file.status}): +${file.changes.added}/-${file.changes.deleted}`
      ).join('\n')
      
      const totalDiffText = `总计: +${totalAdded}/-${totalDeleted}\n文件差异:\n${fileDiffs}`

      let firstRowIndex = null
      
      // 遍历每个提交的所有文件变更
      for (const commit of branch.commits) {
        if (!commit.files || commit.files.length === 0) continue
        
        for (const file of commit.files) {
          const row = sheet.addRow({
            branch: branch.branch,
            commitId: commit.id.slice(0, 7),
            author: commit.author,
            date: commit.date.toISOString(),
            message: commit.message.split('\n')[0],
            file: file.file,
            changeType: file.status,
            added: file.changes?.added || 0,
            deleted: file.changes?.deleted || 0,
            totalDiff: totalDiffText
          })
          
          if (firstRowIndex === null) {
            firstRowIndex = row.number
          }
        }
      }

      // 合并整体差异单元格
      if (firstRowIndex !== null) {
        const lastRowIndex = sheet.rowCount
        sheet.mergeCells(`J${firstRowIndex}:J${lastRowIndex}`)
        
        // 设置自动换行
        sheet.getCell(`J${firstRowIndex}`).alignment = { 
          wrapText: true,
          vertical: 'top'
        }
      }
    }
  }

  /**
   * 执行完整分析流程
   */
  async runAnalysis() {
    try {
      // 1. 克隆仓库
      await this.cloneRepository()

      // 2. 获取领先分支
      const branches = await this.getAheadBranches()

      // 3. 分析每个分支
      for (const branch of branches) {
        await this.analyzeBranch(branch)
      }

      // 4. 生成报告
      const reportPath = await this.generateExcelReport()

      return {
        success: true,
        reportPath,
        analysisResult: this.analysisResult
      }
    } catch (error) {
      console.error('分析失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

/**
 * 使用示例
 */
async function exampleUsage() {
  const analyzer = new GitBranchAnalyzer('git@github.com:perry-ai/MyTools.git')
  const result = await analyzer.runAnalysis()
  
  if (result.success) {
    console.log('分析完成，报告路径:', result.reportPath)
    console.log('分析结果:', JSON.stringify(result.analysisResult, null, 2))
  } else {
    console.error('分析失败:', result.error)
  }
}

exampleUsage()

// 导出默认实例
export default GitBranchAnalyzer
