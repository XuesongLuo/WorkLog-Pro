WorkLog
项目简介
WorkLog 是一套面向工程项目管理的任务记录与进度追踪系统，适用于装修、室内外工程、后院施工、除霉处理等场景。系统提供了项目任务的录入、编辑、日历视图、列表视图、进度表编辑、富文本描述、权限管理、国际化等功能，支持多人协作与移动端适配。

主要功能
用户登录/鉴权：基于 JWT 实现，支持自动 token 注入与过期处理。
任务列表视图：工程项目一览，支持分页与动态加载。
日历视图：可视化展示项目进度，颜色区分重叠项目。
任务详情与编辑：支持嵌入式与独立页面富文本描述编辑，任务的增删改查。
项目进度表格：支持 Excel 风格的批量编辑、进度更新、自动保存。
国际化支持：多语言 UI（如中英文切换）。
响应式设计：桌面端和移动端良好适配。
全局消息与加载动画：友好的用户操作反馈。
权限与安全：支持后台审核、角色控制。

技术栈
前端：React + MUI + react-big-calendar + TipTap + react-i18next
后端：Node.js + Express + MongoDB
鉴权：JWT（Token 有效期默认365天，可自定义）
样式：MUI（Material UI）+ CSS Module
其他：notistack（全局消息）、moment.js、lodash

目录结构

src/
├── api/                   # API 封装
│   └── authApi.js
├── components/            # 通用组件
│   ├── TopAppBar.jsx
│   ├── TaskDetail.jsx
│   ├── ProjectTableEditor.jsx
│   └── ...
├── contexts/              # React Context 业务数据
│   └── TaskStore.js
├── hooks/                 # 自定义 hooks
│   ├── useDebounce.js
│   └── useTaskDetailState.js
├── pages/                 # 页面
│   ├── Home.jsx
│   ├── CreateOrEditTask.jsx
│   └── ...
├── utils/                 # 工具方法
│   ├── fetcher.js
│   └── authUtils.js
└── ...

快速启动
环境准备
Node.js >= 22.x

MongoDB 5.x

推荐使用 pnpm / npm / yarn

安装依赖
npm install
或
pnpm install

启动开发服务器
npm run dev

生产部署
npm run build
npm run start

后端配置
在 .env 配置 JWT_SECRET 等环境变量

数据库连接配置请参见 /server/.env

核心功能说明
1. 登录与鉴权
登录接口 /api/login，返回带 365 天有效期的 JWT token
前端自动在请求 header 中附带 token，后端校验 token
token 过期时前端自动清理登录状态并跳转登录页

2. 任务管理
支持新建、编辑、删除工程任务
必填项：地址、城市、州、邮编、年份、保险公司、类型等
支持项目推荐人、负责人、公司等字段
任务描述支持富文本（TipTap）

3. 列表与日历视图
列表视图支持按字段展示与分页
日历视图支持拖拽切换月份、周视图，项目颜色区分重叠
可切换视图

4. 进度表格
支持 Excel 风格批量编辑工程进度
支持单元格数据校验、自动保存
支持滚动加载更多数据

5. 权限与国际化
支持后台用户审核
支持多语言（i18n，默认中英文）
所有操作有全局消息反馈

常见问题
token 多久过期？如何处理失效？
默认365天，失效时前端自动退出到登录页
如何扩展任务类型/自定义字段？
在顶部导航栏的菜单中的设置进行定义即可
