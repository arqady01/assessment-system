const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('检查数据库...')
    
    // 检查分类
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            questions: true
          }
        }
      }
    })
    console.log('分类数量:', categories.length)
    categories.forEach(cat => {
      console.log(`- ${cat.name} (${cat.profession}): ${cat._count.questions} 题`)
    })
    
    // 检查题目
    const questions = await prisma.question.findMany({
      include: {
        category: true,
        options: true
      }
    })
    console.log('\n题目数量:', questions.length)
    questions.slice(0, 5).forEach(q => {
      console.log(`- ID: ${q.id}, 标题: ${q.title}, 分类: ${q.category.name}`)
    })
    
    // 检查选项
    const options = await prisma.option.findMany()
    console.log('\n选项数量:', options.length)
    
  } catch (error) {
    console.error('检查数据库失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
