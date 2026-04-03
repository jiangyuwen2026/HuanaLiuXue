/**
 * 小程序V2.0测试数据初始化脚本
 * 运行此脚本快速生成测试数据
 * 
 * 使用方法:
 * cd huananliu-web/backend
 * node scripts/seed-miniprogram-data.js
 */

const { sequelize } = require('../models');
const { School, Case, Consultant, News, Banner, Service } = require('../models');

async function seedData() {
  console.log('🚀 开始初始化小程序V2.0测试数据...\n');

  try {
    // 1. 创建Banner
    console.log('📌 创建Banner数据...');
    await Banner.bulkCreate([
      {
        image: 'https://picsum.photos/750/400?random=1',
        link: '/pages/school/list/school-list',
        sort: 1,
        status: 1
      },
      {
        image: 'https://picsum.photos/750/400?random=2',
        link: '/pages/case/list/case-list',
        sort: 2,
        status: 1
      },
      {
        image: 'https://picsum.photos/750/400?random=3',
        link: '/pages/appointment/appointment',
        sort: 3,
        status: 1
      }
    ], { ignoreDuplicates: true });
    console.log('✅ Banner创建完成\n');

    // 2. 创建学校
    console.log('📌 创建学校数据...');
    await School.bulkCreate([
      {
        name: '香港大学',
        name_en: 'The University of Hong Kong',
        country: '香港',
        city: '香港',
        rank: 22,
        description: '香港历史最悠久的高等教育机构',
        logo: 'https://via.placeholder.com/200/003366/FFFFFF?text=HKU',
        is_hot: 1,
        status: 1
      },
      {
        name: '新加坡国立大学',
        name_en: 'National University of Singapore',
        country: '新加坡',
        city: '新加坡',
        rank: 11,
        description: '亚洲顶尖学府',
        logo: 'https://via.placeholder.com/200/003D7C/FFFFFF?text=NUS',
        is_hot: 1,
        status: 1
      },
      {
        name: '香港中文大学',
        name_en: 'The Chinese University of Hong Kong',
        country: '香港',
        city: '香港',
        rank: 39,
        description: '香港第二所大学',
        logo: 'https://via.placeholder.com/200/6B2C91/FFFFFF?text=CUHK',
        is_hot: 1,
        status: 1
      }
    ], { ignoreDuplicates: true });
    console.log('✅ 学校创建完成\n');

    // 3. 创建案例
    console.log('📌 创建案例数据...');
    await Case.bulkCreate([
      {
        student_name: '张同学',
        school_id: 1,
        major: '计算机科学',
        degree: '硕士',
        background: '985本科，GPA 3.5',
        result: '已录取',
        content: '成功案例详情',
        is_featured: 1,
        feature_sort: 1,
        feature_highlight: '逆袭港大',
        feature_bg: 'from-blue-500 to-cyan-500',
        status: 1
      },
      {
        student_name: '李同学',
        school_id: 2,
        major: '金融工程',
        degree: '硕士',
        background: '211本科，GPA 3.8',
        result: '已录取',
        content: '成功案例详情',
        is_featured: 1,
        feature_sort: 2,
        feature_highlight: '双非逆袭',
        feature_bg: 'from-violet-500 to-purple-600',
        status: 1
      }
    ], { ignoreDuplicates: true });
    console.log('✅ 案例创建完成\n');

    // 4. 创建顾问
    console.log('📌 创建顾问数据...');
    await Consultant.bulkCreate([
      {
        name: '陈顾问',
        title: '资深留学顾问',
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=chen',
        specialties: '香港留学',
        experience: 8,
        success_cases: 50,
        rating: 4.9,
        status: 1
      }
    ], { ignoreDuplicates: true });
    console.log('✅ 顾问创建完成\n');

    // 5. 创建资讯
    console.log('📌 创建资讯数据...');
    await News.bulkCreate([
      {
        title: '香港2024硕士申请时间表',
        summary: '香港各大高校申请已陆续开放',
        content: '详细内容',
        cover_image: 'https://picsum.photos/400/300?random=1',
        category: '香港留学',
        is_recommended: 1,
        recommend_sort: 1,
        published_at: new Date(),
        status: 1
      }
    ], { ignoreDuplicates: true });
    console.log('✅ 资讯创建完成\n');

    console.log('🎉 测试数据初始化完成！');
    console.log('后台: http://localhost:3002');
    console.log('API: http://localhost:3001/api');

  } catch (error) {
    console.error('❌ 失败:', error);
  } finally {
    await sequelize.close();
  }
}

seedData();
