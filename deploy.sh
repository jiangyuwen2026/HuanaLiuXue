#!/bin/bash

# ============================================================================
# 华南留学 v2.1.0 部署脚本
# ============================================================================

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印信息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 版本信息
VERSION="v2.1.0"
DEPLOY_DATE=$(date '+%Y-%m-%d %H:%M:%S')

print_info "=========================================="
print_info "华南留学 ${VERSION} 部署脚本"
print_info "部署时间: ${DEPLOY_DATE}"
print_info "=========================================="

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 未安装，请先安装"
        exit 1
    fi
}

# 部署后端
deploy_backend() {
    print_info "=========================================="
    print_info "开始部署后端服务..."
    print_info "=========================================="
    
    cd huananliu-web/backend
    
    # 检查环境
    check_command node
    check_command npm
    
    # 安装依赖
    print_info "安装后端依赖..."
    npm install
    
    # 创建日志目录
    mkdir -p logs
    
    # 检查环境变量
    if [ ! -f .env ]; then
        print_warn "未找到 .env 文件，将使用 config/index.js 中的默认配置"
        print_warn "建议创建 .env 文件以配置生产环境参数"
    fi
    
    # 检查 PM2
    if command -v pm2 &> /dev/null; then
        print_info "使用 PM2 启动服务..."
        
        # 检查是否已有进程在运行
        if pm2 list | grep -q "huananliu-api"; then
            print_info "重启现有服务..."
            pm2 restart ecosystem.config.js --env production
        else
            print_info "启动新服务..."
            pm2 start ecosystem.config.js --env production
        fi
        
        # 保存 PM2 配置
        pm2 save
    else
        print_warn "PM2 未安装，使用 node 直接启动..."
        print_warn "建议安装 PM2: npm install -g pm2"
        NODE_ENV=production nohup node index.js > logs/app.log 2>&1 &
    fi
    
    # 等待服务启动
    sleep 3
    
    # 健康检查
    print_info "进行健康检查..."
    if curl -s http://localhost:3001/api/health > /dev/null; then
        print_info "✅ 后端服务启动成功"
    else
        print_error "❌ 后端服务启动失败，请检查日志"
        exit 1
    fi
    
    cd ../..
}

# 部署管理后台
deploy_admin() {
    print_info "=========================================="
    print_info "开始部署管理后台..."
    print_info "=========================================="
    
    cd huananliu-web/frontend/admin
    
    # 检查环境
    check_command node
    check_command npm
    
    # 安装依赖
    print_info "安装前端依赖..."
    npm install
    
    # 构建
    print_info "构建生产包..."
    npm run build
    
    # 检查构建结果
    if [ ! -d "dist" ]; then
        print_error "构建失败，未找到 dist 目录"
        exit 1
    fi
    
    # 检查 Nginx 配置（仅检查，不自动部署）
    if command -v nginx &> /dev/null; then
        print_info "检测到 Nginx 已安装"
        print_info "请将 dist 目录部署到 Nginx 配置的 root 路径"
        print_info "建议配置: root /var/www/huananliu/admin;"
    else
        print_warn "未检测到 Nginx，请手动部署 dist 目录"
    fi
    
    print_info "✅ 管理后台构建完成"
    print_info "构建输出目录: $(pwd)/dist"
    
    cd ../../..
}

# 打包小程序
build_miniprogram() {
    print_info "=========================================="
    print_info "小程序打包..."
    print_info "=========================================="
    
    # 检查小程序目录
    if [ ! -d "miniprogram" ]; then
        print_warn "未找到 miniprogram 目录"
        return
    fi
    
    # 创建部署包
    DEPLOY_DIR="deploy/miniprogram-${VERSION}"
    mkdir -p ${DEPLOY_DIR}
    
    # 复制小程序文件
    cp -r miniprogram/* ${DEPLOY_DIR}/
    
    # 移除开发配置文件
    rm -f ${DEPLOY_DIR}/project.private.config.json
    
    print_info "✅ 小程序打包完成"
    print_info "打包目录: $(pwd)/${DEPLOY_DIR}"
    print_info "请使用微信开发者工具导入该目录并上传"
}

# 创建部署包
create_deploy_package() {
    print_info "=========================================="
    print_info "创建部署包..."
    print_info "=========================================="
    
    DEPLOY_NAME="huananliu-${VERSION}-$(date +%Y%m%d)"
    DEPLOY_DIR="deploy/${DEPLOY_NAME}"
    
    mkdir -p ${DEPLOY_DIR}
    
    # 复制后端
    mkdir -p ${DEPLOY_DIR}/backend
    cp -r huananliu-web/backend/* ${DEPLOY_DIR}/backend/
    rm -rf ${DEPLOY_DIR}/backend/node_modules
    rm -rf ${DEPLOY_DIR}/backend/logs
    rm -rf ${DEPLOY_DIR}/backend/.env
    
    # 复制管理后台构建文件
    mkdir -p ${DEPLOY_DIR}/admin
    cp -r huananliu-web/frontend/admin/dist/* ${DEPLOY_DIR}/admin/
    
    # 复制小程序
    mkdir -p ${DEPLOY_DIR}/miniprogram
    cp -r miniprogram/* ${DEPLOY_DIR}/miniprogram/
    rm -f ${DEPLOY_DIR}/miniprogram/project.private.config.json
    
    # 复制文档
    cp DEPLOY_v2.1.0.md ${DEPLOY_DIR}/
    cp PROJECT_STRUCTURE.md ${DEPLOY_DIR}/
    cp VERSION.md ${DEPLOY_DIR}/
    
    # 创建版本信息
    cat > ${DEPLOY_DIR}/VERSION.txt << EOF
华南留学 ${VERSION}
部署日期: ${DEPLOY_DATE}
EOF
    
    # 打包
    cd deploy
    tar -czf ${DEPLOY_NAME}.tar.gz ${DEPLOY_NAME}
    cd ..
    
    print_info "✅ 部署包创建完成"
    print_info "部署包路径: $(pwd)/deploy/${DEPLOY_NAME}.tar.gz"
    print_info "部署包大小: $(du -h deploy/${DEPLOY_NAME}.tar.gz | cut -f1)"
}

# 显示帮助
show_help() {
    cat << EOF
使用方法: ./deploy.sh [选项]

选项:
    all         执行完整部署流程（后端 + 前端 + 打包）
    backend     仅部署后端
    admin       仅构建管理后台
    miniprogram 仅打包小程序
    package     仅创建部署包
    help        显示帮助信息

示例:
    ./deploy.sh all         # 完整部署
    ./deploy.sh backend     # 仅部署后端
    ./deploy.sh package     # 仅创建部署包
EOF
}

# 主函数
main() {
    case "${1:-all}" in
        all)
            deploy_backend
            deploy_admin
            build_miniprogram
            create_deploy_package
            print_info "=========================================="
            print_info "✅ 部署完成！"
            print_info "=========================================="
            print_info "请检查以下内容："
            print_info "1. 后端服务: http://localhost:3001/api/health"
            print_info "2. 管理后台: 部署 dist 目录到 Nginx"
            print_info "3. 小程序: 使用微信开发者工具上传"
            print_info "=========================================="
            ;;
        backend)
            deploy_backend
            ;;
        admin)
            deploy_admin
            ;;
        miniprogram)
            build_miniprogram
            ;;
        package)
            create_deploy_package
            ;;
        help|*)
            show_help
            ;;
    esac
}

# 执行主函数
main "$@"
