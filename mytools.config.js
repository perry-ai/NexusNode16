export default {
  tempDir: 'D://temp', // 临时文件存放目录
  databases: [
    {
      name: 'dev',
      config: {
        host: 'localhost',
        user: 'cxwh',
        password: 'cxwh@2025',
        database: 'par',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      },
    },
    {
      name: 'sit',
      config: {
        host: 'localhost',
        user: 'dvlp',
        password: 'dvlp@2025',
        database: 'flo',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      },
    },
  ], // 数据库配置
}
