import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkQuestions() {
  console.log('📊 题目数据统计报告')
  console.log('=' * 50)

  // 获取所有分类和题目统计
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          questions: true
        }
      }
    },
    orderBy: [
      { profession: 'asc' },
      { name: 'asc' }
    ]
  })

  // 按专业分组统计
  const professionStats = {
    tv: { categories: 0, questions: 0 },
    radio: { categories: 0, questions: 0 },
    tech: { categories: 0, questions: 0 }
  }

  console.log('\n📋 分类详情:')
  categories.forEach(category => {
    const profession = category.profession as keyof typeof professionStats
    if (professionStats[profession]) {
      professionStats[profession].categories++
      professionStats[profession].questions += category._count.questions
    }
    
    console.log(`  ${category.name} (${category.profession}): ${category._count.questions} 题`)
  })

  console.log('\n📈 专业统计:')
  Object.entries(professionStats).forEach(([profession, stats]) => {
    const professionName = profession === 'tv' ? '电视播控' : 
                          profession === 'radio' ? '广播播控' : '技术运维'
    console.log(`  ${professionName}: ${stats.categories} 个分类, ${stats.questions} 道题目`)
  })

  // 总计
  const totalCategories = categories.length
  const totalQuestions = categories.reduce((sum, cat) => sum + cat._count.questions, 0)
  
  console.log('\n🎯 总计:')
  console.log(`  总分类数: ${totalCategories}`)
  console.log(`  总题目数: ${totalQuestions}`)

  // 获取一些示例题目
  console.log('\n📝 题目示例:')
  const sampleQuestions = await prisma.question.findMany({
    take: 5,
    include: {
      category: true,
      options: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  sampleQuestions.forEach((question, index) => {
    console.log(`\n${index + 1}. ${question.title}`)
    console.log(`   分类: ${question.category.name} (${question.category.profession})`)
    console.log(`   类型: ${question.type} | 难度: ${question.difficulty}`)
    console.log(`   选项数: ${question.options.length}`)
  })

  console.log('\n✅ 数据检查完成!')
}

checkQuestions()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
