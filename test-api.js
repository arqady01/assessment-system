const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testAPI() {
  try {
    // 获取第一个题目的ID
    const question = await prisma.question.findFirst({
      include: {
        category: true,
        options: true
      }
    })
    
    if (question) {
      console.log('找到题目:')
      console.log('ID:', question.id)
      console.log('标题:', question.title)
      console.log('分类:', question.category.name)
      console.log('选项数量:', question.options.length)
      
      // 测试API路由逻辑
      const sanitizedQuestion = {
        ...question,
        options: question.options.map(opt => ({
          ...opt,
          isCorrect: undefined
        }))
      }
      
      console.log('\n处理后的题目数据:')
      console.log(JSON.stringify(sanitizedQuestion, null, 2))
    } else {
      console.log('没有找到题目')
    }
    
  } catch (error) {
    console.error('测试失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAPI()
