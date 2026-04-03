#!/bin/bash

# 华南留学小程序 - 域名配置检查脚本

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 域名列表
DOMAINS=(
  "https://api.huananliuxue.com"
  "https://aichat.tencentyun.com"
)

# API端点列表
ENDPOINTS=(
  "/api/health"
  "/api/news/list"
  "/api/school/list"
  "/api/user/info"
)

# 打印标题
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  域名配置检查工具${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# 检查 curl 是否安装
if ! command -v curl &> /dev/null; then
    echo -e "${RED}错误: 未找到 curl 命令${NC}"
    echo "请先安装 curl: brew install curl (macOS) 或 apt-get install curl (Linux)"
    exit 1
fi

# 检查域名解析
check_dns() {
    local domain=$1
    echo -e "${YELLOW}检查域名解析: $domain${NC}"
    
    # 提取域名（去掉 https://）
    local hostname=$(echo $domain | sed -e 's|^[^/]*//||' -e 's|/.*$||')
    
    # DNS查询
    if nslookup $hostname &> /dev/null; then
        echo -e "${GREEN}✓ DNS解析正常${NC}"
        nslookup $hostname | grep "Address" | tail -1
    else
        echo -e "${RED}✗ DNS解析失败${NC}"
        return 1
    fi
    echo ""
}

# 检查HTTPS证书
check_ssl() {
    local domain=$1
    echo -e "${YELLOW}检查HTTPS证书: $domain${NC}"
    
    # 检查证书
    local cert_info=$(curl -vI $domain 2>&1 | grep -E "subject:|issuer:|expire date:")
    
    if [ -n "$cert_info" ]; then
        echo -e "${GREEN}✓ HTTPS证书正常${NC}"
        echo "$cert_info"
    else
        echo -e "${RED}✗ HTTPS证书检查失败${NC}"
        return 1
    fi
    echo ""
}

# 检查API连通性
check_api() {
    local domain=$1
    local endpoint=$2
    local url="${domain}${endpoint}"
    
    echo -e "${YELLOW}检查API: $url${NC}"
    
    # 发送请求
    local response=$(curl -s -o /dev/null -w "%{http_code}" $url 2>&1)
    
    if [ "$response" = "200" ] || [ "$response" = "404" ]; then
        echo -e "${GREEN}✓ API可访问 (HTTP $response)${NC}"
        curl -s -I $url | head -5
    elif [ "$response" = "000" ]; then
        echo -e "${RED}✗ 连接失败${NC}"
        return 1
    else
        echo -e "${YELLOW}⚠ API响应异常 (HTTP $response)${NC}"
    fi
    echo ""
}

# 检查CORS
check_cors() {
    local domain=$1
    echo -e "${YELLOW}检查CORS配置: $domain${NC}"
    
    local cors_header=$(curl -s -I -H "Origin: https://servicewechat.com" $domain | grep -i "access-control")
    
    if [ -n "$cors_header" ]; then
        echo -e "${GREEN}✓ CORS已配置${NC}"
        echo "$cors_header"
    else
        echo -e "${YELLOW}⚠ 未检测到CORS头（可能已配置或不需要）${NC}"
    fi
    echo ""
}

# 检查响应时间
check_response_time() {
    local domain=$1
    echo -e "${YELLOW}检查响应时间: $domain${NC}"
    
    local time=$(curl -o /dev/null -s -w "%{time_total}" $domain)
    local time_ms=$(echo "$time * 1000" | bc | cut -d'.' -f1)
    
    if [ "$time_ms" -lt 500 ]; then
        echo -e "${GREEN}✓ 响应时间: ${time_ms}ms (优秀)${NC}"
    elif [ "$time_ms" -lt 1000 ]; then
        echo -e "${YELLOW}⚠ 响应时间: ${time_ms}ms (一般)${NC}"
    else
        echo -e "${RED}✗ 响应时间: ${time_ms}ms (较慢)${NC}"
    fi
    echo ""
}

# 主检查流程
main() {
    echo -e "${GREEN}开始检查...${NC}"
    echo ""
    
    # 检查每个域名
    for domain in "${DOMAINS[@]}"; do
        echo -e "${GREEN}================================${NC}"
        echo -e "${GREEN}检查域名: $domain${NC}"
        echo -e "${GREEN}================================${NC}"
        echo ""
        
        # DNS解析
        check_dns $domain
        
        # HTTPS证书
        check_ssl $domain
        
        # CORS配置
        check_cors $domain
        
        # 响应时间
        check_response_time $domain
        
        # API连通性
        echo -e "${YELLOW}检查API端点:${NC}"
        for endpoint in "${ENDPOINTS[@]}"; do
            check_api $domain $endpoint
        done
        
        echo ""
    done
    
    # 生成检查报告
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}检查完成！${NC}"
    echo -e "${GREEN}================================${NC}"
    echo ""
    echo -e "${YELLOW}配置建议:${NC}"
    echo "1. 确保所有域名在微信公众平台配置了白名单"
    echo "2. HTTPS证书有效且未过期"
    echo "3. 域名已完成备案"
    echo "4. 响应时间建议控制在500ms以内"
    echo "5. 如果使用CDN，确保CORS配置正确"
    echo ""
    echo -e "${YELLOW}下一步:${NC}"
    echo "1. 在微信公众平台配置服务器域名白名单"
    echo "2. 在 config.js 中配置正确的API地址"
    echo "3. 在 utils/aiService.js 中配置AI服务密钥"
    echo "4. 在微信开发者工具中测试网络请求"
    echo ""
}

# 执行主函数
main
