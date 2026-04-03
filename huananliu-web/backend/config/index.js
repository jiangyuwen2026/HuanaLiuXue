// 华南留学后端配置
module.exports = {
  // 数据库配置
  database: {
    host: 'localhost',
    port: 3306,
    database: 'huananliu',
    username: 'root',
    password: 'simonjyw123',
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  
  // 服务器配置
  server: {
    port: 3001,
    corsOrigin: '*'
  },
  
  // JWT配置
  jwt: {
    secret: 'huananliu-secret-key-2026',
    expiresIn: '24h'
  }
};
