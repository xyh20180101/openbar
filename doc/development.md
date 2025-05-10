# openbar 开发文档

## 环境
- 基于[bolt-cep](https://github.com/hyperbrew/bolt-cep)框架开发
- CEP 11 (Node.js >= 15.9.0)

## 目录结构
```js
openbar
├── doc //文档
├── src
│   ├── js
│   │   ├── lib
│   │   │   ├── menuCommands
│   │   │   │   ├── data.json //预生成的菜单数据(用于menuCommand)
│   │   │   │   └── menuCommandParser.js //预生成脚本
│   │   │   ├── openBarHelper.ts //公共代码(数据更新和通知)
│   │   │   └── public.css //公共样式
│   │   ├── main //主界面vue代码
│   │   ├── public //build时复制到根目录的文件
│   │   └── settings //设置界面vue代码
│   ├── jsx
│   │   └── aeft //与ae交互的js代码
│   └── locales //本地化相关
├── cep.config.ts //cep配置文件
└── README.md
... //除此以外的代码均为框架代码
```

### 菜单(menuCommand)数据
- 提取脚本`menuCommandParser.js`改自[after-effects-command-ids](https://github.com/hyperbrew/after-effects-command-ids)的`parser/parse-dat.js`

- `data.json`是通过`menuCommandParser.js`提取自Ae 2024

## 写在后头
我以前从没写过ts，请自备降压药