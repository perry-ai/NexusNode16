import schedule from 'node-schedule'
import tasks from './task.config.js'

export async function initScheduler() {
  // 初始化所有任务
  console.log('Scheduler initializing ...')
  tasks.forEach(({ name, rule, task }) => {
    console.log('Scheduler task registered，name:' + name)
    try {
      schedule.scheduleJob(name, rule, async () => {
        try {
          console.log(`[${name}] 任务开始执行`)
          await task()
        } catch (err) {
          console.error(`[${name}] 任务执行失败:`, err)
        }
      })
    } catch (e) {
      console.error(`[${name}] 任务初始化失败:`, e)
    }
  })
  console.log('Scheduler initializing ...... OK')

  // 返回当前活跃任务列表（调试用）
  //   return () => Object.keys(schedule.scheduledJobs)
}
