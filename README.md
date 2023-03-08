# runtime-envs
规范化差异化环境变量，拒绝硬编码和if黑魔法。根据当前环境，按规则将一些列的dotenv注入到环境变量中。   

以跨端（H5/小程序）开发为例，一般都会包含 mock/开发联调/beta测试/生产等阶段，runtime-envs则为解决阶段的差异化配置而生。

## 安装

```bash
npm install runtime-envs -D
```
或者

```bash
yarn add runtime-envs -D
```


## 使用

### 1. 按环境新建环境变量文件

在根目录下创建一个envs（可自定义）文件夹，其中包含各个环境对应的环境变量文件。以下为跨端环境配置示例

```
.
└── envs  
    ├── .env
    ├── .env.h5
    ├── .env.h5.beta
    ├── .env.h5.development
    ├── .env.h5.mock
    ├── .env.h5.production
    ├── .env.weapp
    ├── .env.weapp.beta
    ├── .env.weapp.development
    ├── .env.weapp.mock
    └── .env.weapp.production
```

### 2. 设置当前环境
在启动前设置`RUNTIME_ENV`即可。

      
例如`cross-env RUNTIME_ENV=weapp.production npm run build:weapp`，这会按照`.env.weapp.production` > `.env.weapp` > `.env`优先级(重复则覆盖)，加入相关的环境配置





### 3. 配合 webpack 常量
通过 `getStringifyEnvsByPrefix` 得到的是一个符合`webpack.DefinePlugin`参数的对象，方便客户端使用;  
例如 `cross-env RUNTIME_ENV=h5.mock npm run dev:h5`


```sh
# 在 envs/.env.h5.mock 文件中
APP_RUNTIME_API_SERVER=https://localhost:8899/mock
```


```javascript
import { setupRuntimeEnvs, getStringifyEnvsByPrefix } from 'runtime-envs' // node 14+ es6 module
// const { setupRuntimeEnvs, getStringifyEnvsByPrefix } = require('runtime-envs')  // lagecy

setupRuntimeEnvs();

const processEnvs = getStringifyEnvsByPrefix('process.env')
// ...
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
   ...processEnvs
});
```

```javascript


// 前端代码
import axios from 'axios'

// ...

// 请求会自动切换至本地
axios.get(process.env.APP_RUNTIME_API_SERVER)

```



## 参数说明


### setupRuntimeEnvs 方法
- envdir: 环境变量所在的文件夹，默认./envs
- envSpliter: .env文件名称中的分割符，默认 .


### getStringifyEnvsByPrefix 方法
- objectKeyPrefix: 返回对象中，key的前缀，默认为空字符串('')
- prefix: 目标环境变量的前缀，默认 "APP_RUNTIME_"




