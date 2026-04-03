import { useState, useEffect } from 'react';
import { getSiteConfig } from '../utils/api';

// 默认配置
const defaultConfig = {
  site_name: '华南留学',
  site_slogan: '专业留学服务，助您圆梦名校',
  phone: '400-888-8888',
  email: 'contact@huananliu.com',
  address: '广州市天河区珠江新城华夏路30号',
  wechat: 'huananliu',
  business_hours: '周一至周日 9:00-18:00',
  seo_title: '华南留学 - 专业留学申请服务',
  seo_keywords: '留学,留学申请,出国留学,留学中介,留学咨询',
  seo_description: '华南留学提供专业的留学申请服务，涵盖美国、英国、澳大利亚、加拿大等国家，助您成功进入世界顶尖名校。',
};

export function useSiteConfig() {
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await getSiteConfig();
        if (res.success && res.data) {
          setConfig(prev => ({ ...prev, ...res.data }));
        }
      } catch (error) {
        console.error('获取网站配置失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading };
}

export default useSiteConfig;
