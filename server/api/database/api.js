// server/api/database/api.js
const mysql = require('mysql2/promise');
const dbConfig = require('../../../mytools.config').databases;

const connectionPools = {};
let isInitialized = false;

async function createConnectionPools() {
  for (const config of dbConfig) {
    const pool = await mysql.createPool(config);
    connectionPools[config.database] = pool;
    console.log(`Connection pool created for database: ${config.database}`);
  }
}

(async () => {
  if (!isInitialized) {
    await createConnectionPools();
    isInitialized = true;
  }
})();

function registerRoutes(app) {
  // 示例 POST 接口，使用 db1 连接池执行 SELECT * FROM tableA
  app.post('/selectTableA', async (req, res) => {
    console.log('Received request ', req.body);
    const db1 = connectionPools['par']; // 获取 db1 的连接池

    try {
      const [rows] = await db1.execute('SELECT * from par.teller_info');
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
}

module.exports = registerRoutes;