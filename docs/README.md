# 项目技术文档

## 文档概述

本目录包含评估系统的完整技术文档，面向技术团队和项目维护者。

## 文档结构

### 📊 [数据库技术架构文档](./database-architecture.md)

**目标读者**: 技术组长、数据库管理员、后端开发工程师

**内容概要**:
- 数据库技术栈选择和配置
- 完整的数据模型设计和关系图
- 业务逻辑的数据库实现
- 性能优化和扩展性考虑
- 部署和运维指南

**关键特性**:
- ✅ 完整的ERD关系图
- ✅ Prisma ORM配置详解
- ✅ 索引策略和性能优化
- ✅ 数据安全和完整性保障
- ✅ 监控和维护策略

## 技术栈概览

### 数据库层
- **主数据库**: SQLite (开发) / PostgreSQL (生产)
- **ORM框架**: Prisma
- **连接管理**: 单例模式连接池
- **迁移工具**: Prisma Migrate

### 应用层
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **认证**: JWT + bcrypt
- **API**: RESTful API

### 前端层
- **UI框架**: React 18
- **样式**: TailwindCSS
- **动画**: Framer Motion
- **状态管理**: React Context

## 快速开始

### 数据库设置

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env

# 3. 生成Prisma客户端
npx prisma generate

# 4. 运行数据库迁移
npx prisma migrate dev

# 5. 执行种子数据
npx prisma db seed
```

### 开发环境启动

```bash
# 启动开发服务器
npm run dev

# 查看数据库
npx prisma studio
```

## 数据库核心实体

### 用户管理
- **User**: 用户基本信息和权限
- **Role**: 角色枚举 (STUDENT, TEACHER, ADMIN)

### 题目系统
- **Question**: 题目内容和元数据
- **Option**: 题目选项
- **Category**: 题目分类
- **QuestionType**: 题型枚举
- **Difficulty**: 难度等级

### 学习跟踪
- **ExamResult**: 考试结果记录
- **Favorite**: 用户收藏
- **StudyLog**: 学习行为日志

### 内容管理
- **Case**: 案例库内容
- **Standard**: 操作规范
- **SystemSetting**: 系统配置

## 关键设计决策

### 1. 数据库选择
- **开发环境**: SQLite - 零配置，快速启动
- **生产环境**: PostgreSQL - 企业级稳定性和性能

### 2. ORM选择
- **Prisma**: 类型安全、自动迁移、优秀的开发体验

### 3. 主键策略
- **CUID**: 全局唯一、URL安全、时间排序

### 4. 关系设计
- **级联删除**: 保证数据完整性
- **复合唯一约束**: 防止重复数据
- **索引优化**: 提升查询性能

## 性能考虑

### 查询优化
- 合理使用 `include` 和 `select`
- 分页查询避免大数据集
- 复合索引优化常用查询

### 缓存策略
- 静态数据缓存 (分类、规范)
- 用户会话缓存
- 查询结果缓存

### 扩展性设计
- 读写分离支持
- 水平分片准备
- 微服务架构兼容

## 安全措施

### 数据安全
- 密码bcrypt加密 (12轮)
- JWT token认证
- SQL注入防护 (Prisma)
- XSS防护

### 访问控制
- 基于角色的权限控制
- API路由权限验证
- 数据行级安全

## 监控和维护

### 性能监控
- 查询响应时间跟踪
- 慢查询日志分析
- 数据库连接监控

### 数据维护
- 自动备份策略
- 数据归档机制
- 定期索引优化

## 部署指南

### 生产环境配置
```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
NODE_ENV="production"
JWT_SECRET="your-production-secret"
```

### 部署流程
1. 数据库迁移: `npx prisma migrate deploy`
2. 客户端生成: `npx prisma generate`
3. 种子数据: `npx prisma db seed`
4. 应用启动: `npm run build && npm start`

## 故障排除

### 常见问题
- **连接超时**: 检查数据库连接配置
- **迁移失败**: 检查Schema语法和约束冲突
- **性能问题**: 分析慢查询日志和索引使用

### 调试工具
- `npx prisma studio`: 数据库可视化管理
- `npx prisma db push`: 快速Schema同步
- `npx prisma migrate status`: 迁移状态检查

## 贡献指南

### 数据库变更流程
1. 修改 `schema.prisma`
2. 生成迁移: `npx prisma migrate dev --name description`
3. 更新种子数据 (如需要)
4. 更新相关文档
5. 测试验证

### 文档维护
- 重大架构变更需更新文档
- 新增表或字段需更新ERD图
- 性能优化需更新相关章节

---

## 联系信息

**技术负责人**: 技术团队  
**文档维护**: 开发团队  
**最后更新**: 2024年

---

*本文档持续更新，如有疑问请联系技术团队*
