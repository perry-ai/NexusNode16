import { RecurrenceRule } from 'node-schedule';

// 示例任务配置
export default [
  {
    name: 'weekly_cleanup',
    rule: new RecurrenceRule({
      dayOfWeek: 3,  // 每周三
      hour: 3,       // 凌晨3点
      minute: 0
    }),
    task: () => {
      console.log('执行每周清理任务:', new Date());
      // 实际业务逻辑...
    }
  },
  {
    name: 'daily_report',
    rule: '0 9 * * *',  // 每天上午9点
    task: () => console.log('生成每日报告')
  }
];