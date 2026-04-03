const { sequelize, Service } = require('./models');

async function sync() {
  try {
    // 同步模型（仅添加新列，不删除数据）
    await sequelize.sync({ alter: true });
    console.log('✅ 数据库同步完成');
    
    // 更新分类数据
    const categories = ['留学申请', '英语培训', '竞赛规划', '科研提升'];
    for (let i = 1; i <= 4; i++) {
      await Service.update(
        { category: categories[i-1] },
        { where: { id: i } }
      );
    }
    console.log('✅ 分类数据更新完成');
    
    // 验证
    const services = await Service.findAll();
    services.forEach(s => {
      console.log(`ID ${s.id}: ${s.title} -> ${s.category}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 同步失败:', error);
    process.exit(1);
  }
}

sync();
