module.exports = {
    testEnvironment: 'node', // 适配Node环境
    roots: ['<rootDir>/test/unit'], // 测试文件目录
    testMatch: ['**/*.(spec|test).js'],
    transform: {
      '^.+\\.js$': 'babel-jest', // 若使用ESM需配置
    },
    setupFilesAfterEnv: ['<rootDir>/test/setupTests.js'], // 全局mock配置
  };