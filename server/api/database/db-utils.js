// utils.js
import mysql from 'mysql2/promise'
import mytoolsConfig from '../../../mytools.config.js'

// 初始化
const connectionPools = {}
let isInitialized = false
const DBConfigs = mytoolsConfig.databases

async function createConnectionPools() {
  for (const DBConfig of DBConfigs) {
    const pool = await mysql.createPool(DBConfig.config)
    connectionPools[DBConfig.name] = pool
    console.log(`Connection pool created for database: ${DBConfig.name}`)
  }
}

;(async () => {
  if (!isInitialized) {
    await createConnectionPools()
    isInitialized = true
  }
})()

export async function initializeConnectionPools() {
  if (isInitialized) return
  await createConnectionPools()
  isInitialized = true
}

// 动态获取列名元数据
export async function getColumnMetadata(tableName, env) {
  const pool = connectionPools[env]
  const [rows] = await pool.query(`DESCRIBE ${tableName}`)
  return rows.map((col) => col.Field)
}

// 获取连接池
export function getConnectionPool(env) {
  const pool = connectionPools[env]
  if (!pool) throw new Error('Invalid environment')
  return pool
}
