import schedule from 'node-schedule'

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
]
