# server目录

## 主要内容和作用

运行在nodejs中，采用express.js作为服务器框架，使用ES module语法风格。可以实现数据库操作、文件操作、系统命令操作等浏览器无法进行的操作；同时支持npm 依赖引入，拥有超高的功能拓展性。

## 目录结构和说明

```
server/
├── index.js                    # 主入口文件
├── README.md                   # 说明文档
└── api                         # api目录：存储所有的api
    ├── register.js              # 接口注册器：自动扫描注册接口
    ├── database                 # 数据库模块
    │   ├── db-utils.js           # 数据库初始化、公共操作等
    │   ├── router.js             # 数据库接口注册器
    │   ├── validate.js           # 数据库校验工具类
    │   └── tables                # 数据库表接口存放位置
    │       └── tableA.js          # 单表维度的具体实现示例
    ├── file                     # 文件处理模块
    │   └── router.js             # 文件处理接口注册器
    └── git                      # git辅助功能模块
        ├── git-use-child-process.js # git辅助功能childprocess模式
        ├── git-use-simple.js        # git辅助功能simplegit模式
        └── router.js                # git辅助功能接口注册器
```
