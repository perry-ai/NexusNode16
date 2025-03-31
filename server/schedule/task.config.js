import schedule from 'node-schedule'
import GitBranchAnalyzer from '../customization/QAHelper.js'

// 示例任务配置
export default [
  {
    name: 'weekly_cleanup',
    rule: new schedule.RecurrenceRule(
      undefined, // year（不限制年份）
      undefined, // month（不限制月份）
      undefined, // date（不限制日期）
      4, // dayOfWeek: 4 表示周四（0=周日，1=周一，依此类推）
      0, // hour: 0 表示凌晨0点
      45, // minute: 45 表示45分
      undefined, // second（默认0秒）
      undefined // tz: 时区（可选）
    ),
    task: async () => {
      console.log('执行每周清理任务:', new Date())
      // 实际业务逻辑...
    },
  },
  {
    name: 'daily_report',
    rule: '0 9 * * *', // 每天上午9点
    task: async () => console.log('生成每日报告'),
  },
  {
    name: 'weekly_git_analysis',
    rule: new schedule.RecurrenceRule(
      undefined, // year
      undefined, // month
      undefined, // date
      2, // dayOfWeek: 2 表示周二
      2, // hour: 2 表示凌晨2点
      20, // minute: 0 表示整点
      undefined, // second
      undefined  // tz
    ),
    task: async () => {
      console.log('开始执行Git仓库分析任务:', new Date())
      const analyzer = new GitBranchAnalyzer('git@github.com:perry-ai/MyTools.git')
      const result = await analyzer.runAnalysis()
      if (result.success) {
        console.log('Git仓库分析完成，报告路径:', result.reportPath)
      } else {
        console.error('Git仓库分析失败:', result.error)
      }
    },
  },
]
