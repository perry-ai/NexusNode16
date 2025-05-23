// utils.js
import mysql from 'mysql2/promise'
import NexusConfig from '../../../NexusNode16.config.js'

// 初始化
const connectionPools = {}
let isInitialized = false
const DBConfigs = NexusConfig.databases

// 创建连接池
async function createConnectionPools() {
  for (const DBConfig of DBConfigs) {
    const pool = await mysql.createPool(DBConfig.config)
    connectionPools[DBConfig.name] = pool
    console.log(`Connection pool created for database: ${DBConfig.name}`)
  }
}

// 初始化连接池
;(async () => {
  if (!isInitialized) {
    await createConnectionPools()
    isInitialized = true
  }
})()

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
