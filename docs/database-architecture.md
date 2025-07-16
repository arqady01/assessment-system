# 数据库技术架构文档

## 文档概述

本文档详细描述了评估系统的数据库技术架构、设计原理和实现细节，面向技术组长进行技术评审和架构决策参考。

## 目录

1. [数据库技术栈](#数据库技术栈)
2. [数据库架构设计](#数据库架构设计)
3. [业务逻辑实现](#业务逻辑实现)
4. [技术实现细节](#技术实现细节)
5. [性能和扩展性](#性能和扩展性)
6. [数据库关系图](#数据库关系图)

---

## 数据库技术栈

### 数据库选择

**主数据库**: SQLite (开发环境) / PostgreSQL (生产环境推荐)

**选择原因**:
- **SQLite**: 
  - 零配置，适合快速开发和原型验证
  - 文件型数据库，便于开发环境部署
  - 支持完整的SQL语法和事务
  - 适合中小型应用的初期阶段

- **PostgreSQL** (生产环境):
  - 企业级关系型数据库，稳定可靠
  - 优秀的并发处理能力
  - 丰富的数据类型和索引支持
  - 强大的扩展性和性能优化能力

### ORM框架

**Prisma ORM**

**选择原因**:
- **类型安全**: 自动生成TypeScript类型定义
- **开发体验**: 直观的Schema定义和强大的查询API
- **迁移管理**: 自动化数据库迁移和版本控制
- **性能优化**: 查询优化和连接池管理
- **多数据库支持**: 支持SQLite、PostgreSQL、MySQL等

**配置特点**:
- 使用 `prisma-client-js` 生成器自动生成TypeScript客户端
- 支持SQLite和PostgreSQL数据源切换
- 通过环境变量管理数据库连接字符串

### 数据库连接管理

**连接池策略**:
采用单例模式管理Prisma客户端实例，确保整个应用共享同一个数据库连接池。在开发环境中，利用全局变量缓存客户端实例，避免热重载时重复创建连接。生产环境下，Prisma自动管理连接池，包括连接复用、超时处理和故障恢复。

**核心特点**:
- 单例模式避免多实例连接导致的资源浪费
- 开发环境热重载优化，提升开发体验
- 自动连接池管理，无需手动配置连接参数
- 支持连接超时和重试机制

---

## 数据库架构设计

### 核心数据模型

#### 1. 用户管理模块

**User表设计**:
用户表采用CUID作为主键，确保全局唯一性和URL安全性。邮箱字段设置唯一约束，作为用户登录凭证。密码字段存储bcrypt加密后的哈希值，安全等级为12轮加密。角色字段使用枚举类型，支持学员(STUDENT)、教师(TEACHER)、管理员(ADMIN)三级权限体系。

**核心字段说明**:
- **id**: CUID主键，时间排序友好，避免自增ID的安全隐患
- **email**: 唯一邮箱，用于登录认证和用户识别
- **password**: bcrypt加密存储，12轮哈希确保安全性
- **role**: 角色枚举，支持基于角色的访问控制(RBAC)
- **profession**: 专业方向标识，支持电视播控、广播播控、技术运维三个专业
- **avatar**: 头像URL，支持用户个性化展示

**设计原理**:
采用经典的用户-角色模型，通过角色枚举实现权限分级。专业方向字段支持多专业体系的内容隔离，确保不同专业用户看到相关的题目和内容。时间戳字段自动管理创建和更新时间，便于审计和数据分析。

#### 2. 题目管理模块

**Question表设计**:
题目表是系统的核心实体，存储题目的基本信息和元数据。采用题目与选项分离的设计模式，支持单选、多选、判断、填空四种题型。难度等级分为简单、中等、困难三个层次，便于系统进行智能推荐和难度梯度训练。

**Option表设计**:
选项表与题目表建立一对多关系，每个题目可以有多个选项。通过isCorrect字段标识正确答案，支持多选题的多个正确答案。选项内容支持富文本格式，可以包含图片、公式等多媒体内容。

**核心字段说明**:
- **title**: 题目标题，简洁明了的问题描述
- **content**: 题目详细内容，支持富文本和多媒体
- **type**: 题型枚举，支持单选、多选、判断、填空四种类型
- **difficulty**: 难度等级，用于智能推荐和学习路径规划
- **explanation**: 答案解析，帮助用户理解知识点
- **categoryId**: 分类外键，建立题目与分类的关联关系

**设计特点**:
题目与选项分离设计提高了数据结构的灵活性，支持不同题型的统一管理。难度等级枚举便于系统进行个性化推荐和学习进度控制。级联删除策略确保数据一致性，删除题目时自动清理相关选项。

#### 3. 分类管理模块

**Category表设计**:
分类表用于组织和管理题目内容，支持多专业体系的分类隔离。通过复合唯一约束(name + profession)，允许不同专业使用相同的分类名称，确保内容的专业性和准确性。颜色和图标字段支持前端UI的个性化展示，提升用户体验。

**核心字段说明**:
- **name**: 分类名称，如"基础知识"、"岗位职能"等
- **description**: 分类描述，详细说明该分类的学习目标和内容范围
- **profession**: 专业方向标识，实现多专业内容隔离
- **color**: 主题颜色，用于前端UI的视觉区分
- **icon**: 图标标识，增强分类的可识别性

**设计亮点**:
复合唯一约束设计巧妙地解决了多专业同名分类的问题，既保证了数据的唯一性，又支持了业务的灵活性。颜色和图标字段的引入，使得系统具备了良好的可视化展示能力，便于用户快速识别和选择学习内容。专业方向隔离确保了不同专业用户只能看到相关的分类内容。

### 索引策略

**主要索引设计**:
系统采用了精心设计的索引策略来优化查询性能。用户邮箱字段创建唯一索引，支持快速的登录验证。题目分类字段建立普通索引，优化按分类查询题目的性能。考试结果表建立用户ID和题目ID的复合索引，支持高效的成绩查询和统计分析。收藏表使用唯一复合索引，既防止重复收藏，又优化查询性能。

**索引类型说明**:
- **唯一索引**: 用户邮箱、收藏记录等需要保证唯一性的字段
- **普通索引**: 外键字段、查询频繁的单一字段
- **复合索引**: 多字段组合查询的场景，如用户-题目关联查询
- **自动索引**: Prisma自动为外键和唯一约束创建的索引

**性能考虑**:
索引设计遵循"查询优先"原则，重点优化高频查询场景。外键字段自动创建索引，确保关联查询的高效性。对于多字段组合查询，创建复合索引以避免全表扫描。唯一约束自动创建唯一索引，既保证数据完整性又提升查询速度。

---

## 业务逻辑实现

### 用户认证和权限管理

**密码安全机制**:
系统采用bcrypt算法进行密码加密，使用12轮哈希确保高安全性。用户注册时，明文密码经过bcrypt加密后存储到数据库，登录时通过bcrypt.compare方法验证密码正确性。这种单向加密机制确保即使数据库泄露，攻击者也无法直接获取用户的明文密码。

**权限控制体系**:
实现基于角色的访问控制(RBAC)模型，定义了学员、教师、管理员三级权限层次。权限验证通过角色层级比较实现，高级别角色自动拥有低级别角色的所有权限。系统在API层面进行权限拦截，确保用户只能访问其权限范围内的资源和功能。

**安全特性**:
- **密码强度**: 12轮bcrypt加密，抵御彩虹表攻击
- **会话管理**: JWT token机制，支持无状态认证
- **权限隔离**: 基于角色的多级权限控制
- **数据隔离**: 专业方向字段实现内容访问隔离

### 题目管理和分类系统

**分层查询机制**:
题目查询系统支持多维度筛选，包括专业方向、分类、难度等级等条件。通过Prisma的关联查询功能，一次查询即可获取题目的完整信息，包括分类信息、选项列表、统计数据等。系统还支持分页查询，避免大数据集对性能的影响。

**查询优化策略**:
- **关联查询**: 使用include语法一次性获取关联数据，减少数据库往返
- **条件筛选**: 支持专业、分类、难度等多维度组合筛选
- **统计聚合**: 通过_count功能获取题目的答题次数、收藏数等统计信息
- **分页处理**: 使用skip和take参数实现高效的分页查询

### 考试结果记录和统计

**结果记录机制**:
考试结果表详细记录用户的答题情况，包括用户ID、题目ID、用户答案、正确性判断、答题用时等关键信息。用户答案以JSON格式存储，支持单选、多选等不同题型的答案记录。系统自动记录答题时间戳，便于后续的学习行为分析。

**统计分析功能**:
基于考试结果数据，系统提供丰富的统计分析功能。通过Prisma的groupBy功能，可以按用户、分类、时间等维度进行数据聚合。支持计算用户的正确率、平均答题时间、学习进度等关键指标，为个性化学习推荐提供数据支撑。

**数据分析维度**:
- **用户维度**: 个人正确率、答题速度、学习进度统计
- **题目维度**: 题目难度分析、错误率统计、热门题目排行
- **分类维度**: 各分类掌握情况、薄弱环节识别
- **时间维度**: 学习时长统计、学习习惯分析

### 学习进度跟踪

**学习日志系统**:
学习日志表记录用户的所有学习行为，包括练习、考试、复习等不同类型的学习活动。通过action字段区分学习行为类型，details字段以JSON格式存储详细的学习数据，如题目ID、分类ID、答题结果、学习时长等。这种设计既保证了数据的完整性，又提供了足够的灵活性来适应不同的学习场景。

**进度跟踪机制**:
系统通过学习日志数据构建用户的学习画像，包括学习频率、学习时长、知识点掌握情况等。结合考试结果数据，可以准确评估用户在各个知识领域的掌握程度，识别学习薄弱环节，为个性化学习路径规划提供数据支撑。

**数据应用场景**:
- **学习报告**: 生成个人学习报告，展示学习成果和进步轨迹
- **智能推荐**: 基于学习历史推荐合适的题目和学习内容
- **行为分析**: 分析用户学习习惯，优化学习体验
- **效果评估**: 评估学习效果，调整学习策略

---

## 技术实现细节

### Prisma Schema设计思路

**数据类型选择原则**:
Schema设计中优先选择类型安全和性能优化的数据类型。String类型配合CUID生成器确保主键的全局唯一性和时间排序特性。DateTime类型支持自动时间戳管理，简化了创建时间和更新时间的维护。Json类型用于存储复杂的非结构化数据，如学习日志详情、题目标签等。Enum类型提供类型安全的枚举值，避免了字符串常量的维护问题。

**关系设计策略**:
数据库关系设计遵循规范化原则，同时考虑查询性能。用户与考试结果建立一对多关系，支持用户的多次答题记录。用户与题目通过收藏表建立多对多关系，实现灵活的收藏功能。所有外键关系都配置了级联删除策略，确保数据的完整性和一致性。

**约束设计考虑**:
通过复合唯一约束防止业务逻辑错误，如用户重复收藏同一题目。自定义表名映射提高了数据库的可读性和维护性。外键约束确保了引用完整性，防止孤立数据的产生。这些约束设计既保证了数据质量，又提供了良好的开发体验。

### 数据迁移策略

**迁移文件管理**:
```bash
# 生成迁移
npx prisma migrate dev --name init

# 应用迁移
npx prisma migrate deploy

# 重置数据库
npx prisma migrate reset
```

**种子数据策略**:
```typescript
// prisma/seed.ts
async function main() {
  // 创建管理员
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { /* admin data */ }
  })
  
  // 创建基础分类
  const categories = await Promise.all([
    prisma.category.create({ data: /* category data */ })
  ])
}
```

### API层交互模式

**标准CRUD模式**:
```typescript
// GET /api/questions
export async function GET(request: NextRequest) {
  const questions = await prisma.question.findMany({
    include: { category: true, options: true }
  })
  return NextResponse.json(questions)
}

// POST /api/questions
export async function POST(request: NextRequest) {
  const data = await request.json()
  const question = await prisma.question.create({ data })
  return NextResponse.json(question)
}
```

**错误处理机制**:
```typescript
try {
  const result = await prisma.question.create(data)
  return NextResponse.json(result)
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: '数据已存在' }, 
        { status: 409 }
      )
    }
  }
  return NextResponse.json(
    { error: '服务器错误' }, 
    { status: 500 }
  )
}
```

---

## 性能和扩展性

### 当前架构性能特点

**优势**:
- Prisma查询优化和连接池管理
- 自动生成的类型安全查询
- 内置的查询缓存机制
- 高效的关联查询

**性能监控**:
```typescript
// 查询性能监控
const startTime = Date.now()
const result = await prisma.question.findMany()
console.log(`Query took ${Date.now() - startTime}ms`)
```

### 扩展性考虑

**水平扩展**:
- 读写分离: 主从数据库配置
- 分库分表: 按专业或地区分片
- 缓存层: Redis缓存热点数据

**垂直扩展**:
- 索引优化: 根据查询模式调整索引
- 查询优化: 使用Prisma的查询分析工具
- 连接池调优: 根据并发量调整连接数

### 数据备份和恢复策略

**备份策略**:
```bash
# SQLite备份
cp dev.db backup/dev_$(date +%Y%m%d_%H%M%S).db

# PostgreSQL备份
pg_dump database_name > backup_$(date +%Y%m%d_%H%M%S).sql
```

**恢复策略**:
```bash
# 数据库重置
npx prisma migrate reset

# 恢复备份
sqlite3 dev.db < backup.sql
```

---

## 数据库关系图

以下是完整的数据库实体关系图，展示所有表之间的关系、主键、外键和重要字段：

### 核心业务表关系

```mermaid
erDiagram
    User {
        string id PK
        string email UK
        string name
        string password
        enum role
        string profession
        string avatar
        datetime createdAt
        datetime updatedAt
    }

    Category {
        string id PK
        string name
        string description
        string profession
        string color
        string icon
        datetime createdAt
        datetime updatedAt
    }

    Question {
        string id PK
        string title
        string content
        enum type
        enum difficulty
        string explanation
        string categoryId FK
        datetime createdAt
        datetime updatedAt
    }

    Option {
        string id PK
        string content
        boolean isCorrect
        string questionId FK
    }

    ExamResult {
        string id PK
        string userId FK
        string questionId FK
        string userAnswer
        boolean isCorrect
        int timeSpent
        datetime createdAt
    }

    Favorite {
        string id PK
        string userId FK
        string questionId FK
        datetime createdAt
    }

    StudyLog {
        string id PK
        string userId FK
        string action
        string details
        datetime createdAt
    }

    Case {
        string id PK
        string title
        string description
        string content
        string profession
        string tags
        string imageUrl
        datetime createdAt
        datetime updatedAt
    }

    Standard {
        string id PK
        string title
        string description
        string content
        string profession
        string category
        string version
        datetime createdAt
        datetime updatedAt
    }

    SystemSetting {
        string id PK
        string key UK
        string value
        datetime createdAt
        datetime updatedAt
    }

    %% 关系定义
    User ||--o{ ExamResult : "参与考试"
    User ||--o{ Favorite : "收藏题目"
    User ||--o{ StudyLog : "学习记录"

    Category ||--o{ Question : "包含题目"

    Question ||--o{ Option : "包含选项"
    Question ||--o{ ExamResult : "考试结果"
    Question ||--o{ Favorite : "被收藏"
```

### 数据流向图

```mermaid
flowchart TD
    A[用户注册/登录] --> B[身份验证]
    B --> C[获取用户信息]
    C --> D[选择专业方向]
    D --> E[加载题目分类]
    E --> F[开始练习/考试]
    F --> G[提交答案]
    G --> H[记录考试结果]
    H --> I[更新学习日志]
    I --> J[统计分析]
    J --> K[生成学习报告]

    F --> L[收藏题目]
    L --> M[个人收藏列表]

    E --> N[浏览案例库]
    E --> O[查看操作规范]
```

---

## 数据安全和完整性

### 数据验证机制

**输入验证**:
```typescript
import { z } from 'zod'

const questionSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  type: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_BLANK']),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  categoryId: z.string().cuid()
})
```

**数据库约束**:
- 主键约束: 确保记录唯一性
- 外键约束: 维护引用完整性
- 唯一约束: 防止重复数据
- 非空约束: 确保必要字段完整

### 事务处理

**复杂业务事务**:
```typescript
const submitExam = await prisma.$transaction(async (tx) => {
  // 1. 记录考试结果
  const examResult = await tx.examResult.create({
    data: { userId, questionId, userAnswer, isCorrect, timeSpent }
  })

  // 2. 更新学习日志
  await tx.studyLog.create({
    data: { userId, action: 'exam', details: JSON.stringify(examResult) }
  })

  // 3. 更新用户统计
  await tx.user.update({
    where: { id: userId },
    data: { updatedAt: new Date() }
  })

  return examResult
})
```

---

## 监控和维护

### 性能监控指标

**关键指标**:
- 查询响应时间
- 数据库连接数
- 慢查询日志
- 索引使用率
- 存储空间使用

**监控实现**:
```typescript
// Prisma中间件监控
prisma.$use(async (params, next) => {
  const before = Date.now()
  const result = await next(params)
  const after = Date.now()

  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)
  return result
})
```

### 维护策略

**定期维护任务**:
- 数据库备份 (每日)
- 索引重建 (每周)
- 统计信息更新 (每日)
- 日志清理 (每月)

**容量规划**:
```sql
-- 数据增长预估
SELECT
  table_name,
  row_count,
  data_size,
  index_size
FROM database_stats
ORDER BY data_size DESC;
```

---

## 部署和运维

### 环境配置

**开发环境**:
```env
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
```

**生产环境**:
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
NODE_ENV="production"
PRISMA_QUERY_ENGINE_LIBRARY="./node_modules/.prisma/client/libquery_engine-linux-musl.so.node"
```

### 部署流程

**数据库迁移**:
```bash
# 1. 生成Prisma客户端
npx prisma generate

# 2. 应用数据库迁移
npx prisma migrate deploy

# 3. 执行种子数据
npx prisma db seed
```

**健康检查**:
```typescript
// API健康检查端点
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'healthy', database: 'connected' })
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', database: 'disconnected' },
      { status: 503 }
    )
  }
}
```

---

## 总结和建议

### 架构优势

1. **类型安全**: Prisma提供完整的TypeScript支持
2. **开发效率**: 自动化迁移和代码生成
3. **数据完整性**: 完善的约束和关系设计
4. **扩展性**: 支持多数据库和水平扩展
5. **维护性**: 清晰的Schema定义和版本控制

### 改进建议

**短期优化**:
- 添加查询缓存层 (Redis)
- 实现读写分离
- 优化慢查询

**长期规划**:
- 考虑分库分表策略
- 实现数据归档机制
- 建立完善的监控体系

### 风险评估

**技术风险**:
- SQLite在高并发下的性能限制
- 单点故障风险
- 数据备份和恢复策略

**缓解措施**:
- 生产环境使用PostgreSQL
- 实现主从复制
- 建立完善的备份机制

---

## 附录

### 常用查询示例

**用户统计查询**:
```typescript
const userStats = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    _count: {
      select: {
        examResults: true,
        favorites: true,
        studyLogs: true
      }
    },
    examResults: {
      select: { isCorrect: true },
      orderBy: { createdAt: 'desc' },
      take: 100
    }
  }
})
```

**题目难度分布**:
```typescript
const difficultyStats = await prisma.question.groupBy({
  by: ['difficulty'],
  _count: { id: true },
  where: {
    category: { profession: userProfession }
  }
})
```

### 数据库配置参考

**PostgreSQL优化配置**:
```sql
-- 连接池配置
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB

-- 查询优化
random_page_cost = 1.1
effective_io_concurrency = 200
```

---

*文档版本: v1.0*
*最后更新: 2024年*
*维护者: 技术团队*
