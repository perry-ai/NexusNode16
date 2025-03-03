module.exports = {
    tempDir: "D://temp", // 临时文件存放目录
    databases: [
        {
          host: 'localhost',
          user: 'root',
          password: 'password',
          database: 'db1',
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0
        },
        {
          host: 'localhost',
          user: 'root',
          password: 'password',
          database: 'db2',
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0
        },
      ] // 数据库配置
}
