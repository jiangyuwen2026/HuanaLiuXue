/**
 * 数据管理工具
 * 用于管理大学和专业数据的查询、过滤、分类上架
 */

const universityData = require('./universityData');

/**
 * 获取大学的优势专业列表（用于列表展示）
 */
function getTopMajorsForUniversity(university) {
  const majors = [];
  
  // 获取本科专业
  if (university.undergraduate && university.undergraduate.faculties) {
    university.undergraduate.faculties.forEach(faculty => {
      if (faculty.majors && faculty.majors.length > 0) {
        // 取前3个专业作为代表
        const topMajors = faculty.majors.slice(0, 3).map(major => major.name);
        majors.push(...topMajors);
      }
    });
  }
  
  // 获取硕士专业
  if (university.master && university.master.categories) {
    university.master.categories.forEach(category => {
      if (category.programs && category.programs.length > 0) {
        // 取前2个专业作为代表
        const topPrograms = category.programs.slice(0, 2).map(program => program.name);
        majors.push(...topPrograms);
      }
    });
  }
  
  // 去重并限制数量
  const uniqueMajors = [...new Set(majors)];
  return uniqueMajors.slice(0, 5); // 最多显示5个专业
}

/**
 * 获取所有大学列表
 */
function getAllUniversities() {
  const hkUnis = universityData.hongkong_universities.map(u => ({
    id: u.id,
    name: u.name,
    nameEn: u.nameEn,
    shortName: u.shortName,
    country: u.country,
    city: u.city,
    logo: u.logo,
    ranking: `QS世界排名#${u.ranking.qs.rank}`,
    tags: u.tags,
    website: u.website,
    stats: u.stats,
    type: u.type,
    founded: u.founded,
    location: u.city,
    // 获取前几个优势专业，用于列表展示
    majors: getTopMajorsForUniversity(u)
  }));

  const sgUnis = universityData.singapore_universities.map(u => ({
    id: u.id,
    name: u.name,
    nameEn: u.nameEn,
    shortName: u.shortName,
    country: u.country,
    city: u.city,
    logo: u.logo,
    ranking: `QS世界排名#${u.ranking.qs.rank}`,
    tags: u.tags,
    website: u.website,
    stats: u.stats,
    type: u.type,
    founded: u.founded,
    location: u.city,
    // 获取前几个优势专业，用于列表展示
    majors: getTopMajorsForUniversity(u)
  }));

  return [...hkUnis, ...sgUnis];
}

/**
 * 按国家获取大学列表
 */
function getUniversitiesByCountry(country) {
  if (country === '香港' || country === 'Hong Kong') {
    return universityData.hongkong_universities;
  } else if (country === '新加坡' || country === 'Singapore') {
    return universityData.singapore_universities;
  }
  return [];
}

/**
 * 根据ID获取大学详情
 */
function getUniversityById(id) {
  const allUnis = [...universityData.hongkong_universities, ...universityData.singapore_universities];
  return allUnis.find(u => u.id === id);
}

/**
 * 搜索大学（根据名称或关键词）
 */
function searchUniversities(keyword) {
  const allUnis = getAllUniversities();
  const lowerKeyword = keyword.toLowerCase();
  
  return allUnis.filter(uni => {
    return uni.name.toLowerCase().includes(lowerKeyword) ||
           uni.nameEn.toLowerCase().includes(lowerKeyword) ||
           uni.shortName.toLowerCase().includes(lowerKeyword);
  });
}

/**
 * 搜索专业（本科和硕士）
 */
function searchMajors(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  const undergraduateResults = [];
  const masterResults = [];
  
  // 搜索所有大学的本科专业
  universityData.hongkong_universities.forEach(uni => {
    if (uni.undergraduate && uni.undergraduate.faculties) {
      uni.undergraduate.faculties.forEach(faculty => {
        if (faculty.majors) {
          faculty.majors.forEach(major => {
            if (major.name.toLowerCase().includes(lowerKeyword) ||
                (major.nameEn && major.nameEn.toLowerCase().includes(lowerKeyword))) {
              undergraduateResults.push({
                ...major,
                universityId: uni.id,
                universityName: uni.name,
                universityCountry: uni.country,
                universityRanking: uni.ranking.qs.rank,
                faculty: faculty.name,
                logo: uni.logo
              });
            }
          });
        }
      });
    }
  });
  
  universityData.singapore_universities.forEach(uni => {
    if (uni.undergraduate && uni.undergraduate.faculties) {
      uni.undergraduate.faculties.forEach(faculty => {
        if (faculty.majors) {
          faculty.majors.forEach(major => {
            if (major.name.toLowerCase().includes(lowerKeyword) ||
                (major.nameEn && major.nameEn.toLowerCase().includes(lowerKeyword))) {
              undergraduateResults.push({
                ...major,
                universityId: uni.id,
                universityName: uni.name,
                universityCountry: uni.country,
                universityRanking: uni.ranking.qs.rank,
                faculty: faculty.name,
                logo: uni.logo
              });
            }
          });
        }
      });
    }
  });
  
  // 搜索所有大学的硕士专业
  universityData.hongkong_universities.forEach(uni => {
    if (uni.master && uni.master.categories) {
      uni.master.categories.forEach(category => {
        if (category.programs) {
          category.programs.forEach(program => {
            if (program.name.toLowerCase().includes(lowerKeyword) ||
                (program.nameEn && program.nameEn.toLowerCase().includes(lowerKeyword))) {
              masterResults.push({
                ...program,
                universityId: uni.id,
                universityName: uni.name,
                universityCountry: uni.country,
                universityRanking: uni.ranking.qs.rank,
                category: category.name,
                logo: uni.logo
              });
            }
          });
        }
      });
    }
  });
  
  universityData.singapore_universities.forEach(uni => {
    if (uni.master && uni.master.categories) {
      uni.master.categories.forEach(category => {
        if (category.programs) {
          category.programs.forEach(program => {
            if (program.name.toLowerCase().includes(lowerKeyword) ||
                (program.nameEn && program.nameEn.toLowerCase().includes(lowerKeyword))) {
              masterResults.push({
                ...program,
                universityId: uni.id,
                universityName: uni.name,
                universityCountry: uni.country,
                universityRanking: uni.ranking.qs.rank,
                category: category.name,
                logo: uni.logo
              });
            }
          });
        }
      });
    }
  });
  
  return {
    undergraduate: undergraduateResults,
    master: masterResults
  };
}

module.exports = {
  getAllUniversities,
  getUniversitiesByCountry,
  getUniversityById,
  searchUniversities,
  searchMajors,
  getTopMajorsForUniversity
};
