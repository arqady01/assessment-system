# 部署指南

## 🚀 本地开发部署

### 快速启动
```bash
# 1. 安装依赖
npm install

# 2. 环境配置
cp .env.example .env.local

# 3. 数据库初始化
npm run setup

# 4. 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 默认账号
- **管理员**: admin@example.com / admin123456
- **测试用户**: user@example.com / 123456

## 🌐 生产环境部署

### Vercel 部署

1. **准备工作**
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login
```

2. **配置环境变量**
在 Vercel 项目设置中添加：
```env
DATABASE_URL="postgresql://username:password@host:port/database"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret"
JWT_SECRET="your-production-jwt-secret"
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_PASSWORD="your-secure-password"
```

3. **部署**
```bash
vercel --prod
```

### Docker 部署

1. **创建 Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. **构建和运行**
```bash
# 构建镜像
docker build -t broadcasting-training .

# 运行容器
docker run -p 3000:3000 -e DATABASE_URL="your-db-url" broadcasting-training
```

### 传统服务器部署

1. **服务器准备**
```bash
# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
npm install -g pm2
```

2. **项目部署**
```bash
# 克隆项目
git clone <repository-url>
cd broadcasting-training-system

# 安装依赖
npm ci --only=production

# 构建项目
npm run build

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 设置生产环境变量

# 初始化数据库
npm run setup

# 启动应用
pm2 start npm --name "broadcasting-training" -- start
```

## 🗄️ 数据库配置

### SQLite (开发环境)
```env
DATABASE_URL="file:./dev.db"
```

### PostgreSQL (生产环境)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/broadcasting_training"
```

### MySQL (可选)
```env
DATABASE_URL="mysql://username:password@localhost:3306/broadcasting_training"
```

## 🔒 安全配置

### 生产环境必须修改
1. **NEXTAUTH_SECRET**: 使用强随机字符串
2. **JWT_SECRET**: 使用强随机字符串
3. **ADMIN_PASSWORD**: 使用强密码
4. **数据库密码**: 使用强密码

### 生成安全密钥
```bash
# 生成随机密钥
openssl rand -base64 32
```

### HTTPS 配置
生产环境必须使用 HTTPS，可以通过：
- Vercel 自动提供
- Nginx 反向代理 + Let's Encrypt
- Cloudflare

## 📊 性能优化

### 数据库优化
```sql
-- 添加索引
CREATE INDEX idx_questions_category ON questions(categoryId);
CREATE INDEX idx_exam_results_user ON exam_results(userId);
CREATE INDEX idx_favorites_user ON favorites(userId);
```

### 缓存配置
```javascript
// next.config.js
module.exports = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  compress: true,
  poweredByHeader: false
}
```

## 🔧 维护操作

### 数据备份
```bash
# 手动备份
npm run db:backup

# 定时备份 (crontab)
0 2 * * * cd /path/to/app && npm run db:backup
```

### 日志管理
```bash
# PM2 日志
pm2 logs broadcasting-training

# 清理日志
pm2 flush
```

### 更新部署
```bash
# 拉取最新代码
git pull origin main

# 安装新依赖
npm ci --only=production

# 更新数据库
npm run db:push

# 重新构建
npm run build

# 重启应用
pm2 restart broadcasting-training
```

## 🚨 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 DATABASE_URL 配置
   - 确认数据库服务运行状态
   - 检查网络连接

2. **认证问题**
   - 检查 JWT_SECRET 配置
   - 清除浏览器 Cookie
   - 检查 NEXTAUTH_URL 配置

3. **构建失败**
   - 清除 node_modules 重新安装
   - 检查 Node.js 版本
   - 查看构建日志

### 监控和告警
建议配置：
- 应用性能监控 (APM)
- 错误日志收集
- 数据库监控
- 服务器资源监控

## 📞 技术支持

如遇到部署问题，请：
1. 查看应用日志
2. 检查环境配置
3. 参考故障排除指南
4. 提交 Issue 寻求帮助
