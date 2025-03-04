module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2020, // 使用最新的 ECMAScript 特性
    sourceType: 'module', // 使用 ES 模块语法
  },
  extends: [
    'plugin:nuxt/recommended', // Nuxt.js 推荐的 ESLint 配置
    'plugin:prettier/recommended', // 使用 Prettier 的推荐规则
    'prettier', // 禁用 ESLint 中与 Prettier 冲突的规则
  ],
  plugins: ['prettier', 'import', 'node'],
  rules: {
    'prettier/prettier': 'error', // 将 Prettier 规则设置为错误级别
    'no-unused-vars': 'warn', // 可选：将未使用的变量设置为警告级别
    'no-console': 'off', // 可选：关闭 console 的警告
    'no-import-assign': 'error',
    'no-setter-return': 'error',
    'no-useless-empty-export': 'error',
    'import/no-commonjs': 'error', // 禁止使用 require
    'node/no-commonjs': 'error', // 禁止使用 require
  },
}
