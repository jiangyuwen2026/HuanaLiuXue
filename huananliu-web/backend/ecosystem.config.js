/**
 * PM2 配置文件
 * 用于生产环境进程管理
 */

module.exports = {
  apps: [{
    name: 'huananliu-api',
    script: './index.js',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    
    // 环境变量
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    
    // 日志配置
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    
    // 重启策略
    min_uptime: '10s',
    max_restarts: 5,
    
    // 监控
    monitoring: true
  }]
};
