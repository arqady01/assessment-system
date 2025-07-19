# 播控人员培训系统

一个专业的播控人员技能培训平台，支持电视播控、广播播控、技术运维三个专业方向的在线学习和考试。

## ✨ 功能特色

### 🎯 核心功能
- **多专业支持**: 电视播控、广播播控、技术运维
- **题目练习**: 分类练习、难度分级、实时反馈
- **在线考试**: 模拟考试、成绩统计、错题回顾
- **学习管理**: 学习进度、收藏题目、历史记录
- **用户管理**: 角色权限、个人资料、学习统计

### 🛠️ 管理功能
- **题目管理**: CRUD操作、批量导入、分类管理
- **用户管理**: 用户列表、权限控制、数据统计
- **系统设置**: 基本配置、安全设置、系统监控
- **数据备份**: 自动备份、手动备份、恢复功能

### 🎨 技术特色
- **现代化UI**: TailwindCSS + Framer Motion
- **响应式设计**: 支持桌面和移动设备
- **类型安全**: TypeScript + Prisma
- **安全认证**: JWT + 密码加密
- **数据库**: SQLite (可扩展到PostgreSQL)

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn 或 pnpm

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd broadcasting-training-system
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. **环境配置**
```bash
# 复制环境配置文件
cp .env.example .env.local

# 编辑环境变量（可选，默认配置即可运行）
nano .env.local
```

4. **数据库初始化**
```bash
# 初始化数据库和种子数据
npm run setup

# 或分步执行
npm run db:push    # 创建数据库表
npm run db:seed    # 插入初始数据
```

5. **启动开发服务器**
```bash
npm run dev
```

6. **访问应用**
- 前端地址: http://localhost:3000
- 管理后台: http://localhost:3000/admin

### 默认账号
- **管理员**: admin@example.com / admin123456
- **测试用户**: user@example.com / 123456

## 📝 可用脚本

### 开发相关
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
```

### 数据库相关
```bash
npm run db:push      # 推送数据库模式更改
npm run db:seed      # 运行数据库种子
npm run db:studio    # 打开Prisma Studio
npm run db:generate  # 生成Prisma客户端
npm run db:reset     # 重置数据库
npm run setup        # 完整设置（推送+种子）
```

### 题目管理
```bash
npm run add-questions    # 添加示例题目
npm run check-questions  # 检查题目统计
```

## 📁 项目结构

```
├── app/                    # Next.js App Router
│   ├── admin/             # 管理后台页面
│   ├── api/               # API路由
│   ├── login/             # 登录页面
│   └── page.tsx           # 主页
├── components/            # React组件
│   ├── admin/             # 管理后台组件
│   ├── ui/                # 基础UI组件
│   └── ...                # 其他组件
├── contexts/              # React Context
├── lib/                   # 工具库
├── prisma/                # 数据库相关
│   ├── schema.prisma      # 数据库模式
│   └── seed.ts            # 种子数据
├── scripts/               # 脚本文件
└── public/                # 静态资源
```

## 🗄️ 数据库模式

### 核心表结构
- **users**: 用户信息
- **categories**: 题目分类
- **questions**: 题目内容
- **options**: 题目选项
- **exam_results**: 考试结果
- **favorites**: 收藏题目
- **system_settings**: 系统设置

## 🔧 配置说明

### 环境变量
```env
# 数据库连接
DATABASE_URL="file:./dev.db"

# 认证配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
JWT_SECRET="your-jwt-secret"

# 管理员账号
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123456"
```

### 生产部署
1. 设置生产环境变量
2. 使用PostgreSQL数据库
3. 配置HTTPS
4. 设置强密码和密钥

## 📊 题目数据

系统包含46道真实题目，覆盖：

### 电视播控 (24题)
- 基础知识、设备操作、应急处理
- 安全规范、岗位职能、消防知识
- 模拟测试

### 广播播控 (11题)
- 基础知识、设备操作
- 应急处理、安全规范

### 技术运维 (11题)
- 系统维护、故障排除
- 网络安全、技术标准

## 🛡️ 安全特性

- JWT身份认证
- 密码加密存储
- 角色权限控制
- API访问控制
- 输入数据验证

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 📄 许可证

MIT License

## 🔧 启动问题排查

### 常见问题及解决方案

在实际启动过程中，可能会遇到以下问题：

#### 1. 依赖安装冲突

**问题现象**：
```bash
npm error Could not resolve dependency:
npm error peerOptional react@"^18.0.0" from framer-motion@11.11.17
npm error Conflicting peer dependency: react@18.3.1
```

**解决方案**：
使用 `--legacy-peer-deps` 选项安装依赖：
```bash
npm install --legacy-peer-deps
```

#### 2. 环境变量未配置

**问题现象**：
```bash
Error: Environment variable not found: DATABASE_URL.
```

**解决方案**：
创建 `.env.local` 文件并配置必要的环境变量：
```bash
# 创建环境配置文件
touch .env.local
```

在 `.env.local` 中添加以下内容：
```env
# 数据库连接
DATABASE_URL="file:./dev.db"

# 认证配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-for-development"
JWT_SECRET="your-jwt-secret-for-development"

# 管理员账号
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123456"
```

#### 3. Prisma 无法读取环境变量

**问题现象**：
即使创建了 `.env.local` 文件，Prisma 仍然报告找不到 `DATABASE_URL`。

**解决方案**：
在命令行中直接设置环境变量：
```bash
# 推送数据库模式
DATABASE_URL="file:./dev.db" npm run db:push

# 运行种子数据
DATABASE_URL="file:./dev.db" npm run db:seed
```

### 完整启动流程

基于实际测试，推荐的完整启动流程：

1. **安装依赖**（处理冲突）
```bash
npm install --legacy-peer-deps
```

2. **创建环境配置**
```bash
# 创建 .env.local 文件
cat > .env.local << EOF
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-for-development"
JWT_SECRET="your-jwt-secret-for-development"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123456"
EOF
```

3. **初始化数据库**（使用环境变量前缀）
```bash
# 推送数据库模式
DATABASE_URL="file:./dev.db" npm run db:push

# 运行种子数据
DATABASE_URL="file:./dev.db" npm run db:seed
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **验证启动**
- 访问 http://localhost:3000 查看前端
- 访问 http://localhost:3000/admin 查看管理后台
- 使用默认账号登录测试

### 启动成功标志

当看到以下输出时，表示启动成功：
```bash
▲ Next.js 15.2.4
- Local:        http://localhost:3000
- Network:      http://192.168.124.42:3000
- Environments: .env.local

✓ Starting...
✓ Ready in 2.6s
```

### 数据库管理

启动成功后，可以使用以下工具管理数据库：
```bash
# 打开 Prisma Studio（数据库可视化管理）
npm run db:studio

# 检查题目统计
npm run check-questions

# 添加更多示例题目
npm run add-questions
```

## 📞 支持

如有问题，请提交Issue或联系开发团队。
