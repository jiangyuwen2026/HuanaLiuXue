// 测试学校详情页数据流
console.log('=== 测试学校详情页数据流 ===\n');

const dataManager = require('./utils/dataManager');

// 测试获取香港大学数据
const school = dataManager.getUniversityById('hku_001');
console.log('1. 获取香港大学数据:');
console.log('   - 学校名称:', school ? school.name : '未找到');
console.log('   - 是否有 undergradudate:', school ? !!school.undergraduate : false);

if (school && school.undergraduate) {
  console.log('   - 院系数量:', school.undergraduate.faculties.length);
  console.log('   - 第一个院系:', school.undergraduate.faculties[0].name);
  console.log('   - 第一个院系的第一个专业:', school.undergraduate.faculties[0].majors[0].name);
}

// 测试组织院系数据
const schoolDetailPage = require('./pages/school/detail/school-detail.js');
// 由于是 Page 对象，我们直接测试 organizeFaculties 方法
const testPage = {
  organizeFaculties: function(school) {
    const faculties = [];
    if (school.undergraduate && school.undergraduate.faculties) {
      school.undergraduate.faculties.forEach(faculty => {
        const majorNames = faculty.majors.map(major => major.name);
        faculties.push({
          name: faculty.name,
          majors: majorNames,
          expanded: false
        });
      });
    }
    return faculties;
  }
};

if (school) {
  const faculties = testPage.organizeFaculties(school);
  console.log('\n2. 组织院系数据:');
  console.log('   - 处理后的院系数量:', faculties.length);
  console.log('   - 第一个院系名称:', faculties[0].name);
  console.log('   - 第一个院系的第一个专业:', faculties[0].majors[0]);
  console.log('   - 数据结构:', JSON.stringify(faculties[0], null, 2));
}

// 测试硕士数据
if (school && school.master) {
  console.log('\n3. 硕士数据:');
  console.log('   - 是否有 master:', !!school.master);
  console.log('   - 分类数量:', school.master.categories.length);
  console.log('   - 第一个分类:', school.master.categories[0].name);
}

console.log('\n=== 测试完成 ===');