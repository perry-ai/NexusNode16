// tables/tableA.js
import { validateRequestBody, validateEnv, validateFields } from '../validate.js'
import { getColumnMetadata, getConnectionPool } from '../db-utils.js'

export const table = 'par.teller_info' // 表名（带schema）

// 路由定义和处理逻辑，此处定义注册参数和处理方法
export const routes = [
  {
    method: 'post',
    path: '/tableA/select',
    handler: selectQuery,
    requiresEnv: true, // 需要 env 参数
  },
  {
    method: 'post',
    path: '/tableA/updateByID',
    handler: updateByIdQuery,
    requiresEnv: true,
  },
]

// 查询操作
async function selectQuery(req, res) {
  try {
    // 可选校验
    //     validateRequestBody(req)
    //     validateEnv(req, mytoolsConfig.databases)

    const { env, ...filters } = req.body
    const columns = await getColumnMetadata(table, env)

    validateFields(req, columns)

    // 获取连接
    const pool = getConnectionPool(env)
    const whereClause = Object.keys(filters)
      .map((col, i) => `${col} = ?`)
      .join(' AND ')
    const values = Object.values(filters)

    const [rows] = await pool.execute(`SELECT * FROM ${table} WHERE ${whereClause}`, values)

    res.json(rows)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// 更新操作
async function updateByIdQuery(req, res) {
  try {
    validateRequestBody(req)
    validateEnv(req, mytoolsConfig.databases)

    const { env, ID, ...values } = req.body
    const columns = await getColumnMetadata(table, env)

    validateFields(req, columns)

    if (!ID) throw new Error('ID is required')

    const pool = getConnectionPool(env)
    const setClause = Object.keys(values)
      .map((col) => `${col} = ?`)
      .join(', ')
    const valuesArr = [...Object.values(values), ID]

    const [result] = await pool.execute(`UPDATE ${table} SET ${setClause} WHERE ID = ?`, valuesArr)

    res.json({ affectedRows: result.affectedRows })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
