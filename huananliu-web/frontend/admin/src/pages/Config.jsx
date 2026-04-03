import { useState, useEffect, useCallback } from 'react';
import { 
  Card, Form, Input, Button, message, Tabs, Upload, Image, 
  Spin, Switch, InputNumber, Divider, Alert, Empty, Tag,
  Row, Col, Typography, Space, Tooltip
} from 'antd';
import { 
  SaveOutlined, ReloadOutlined, UploadOutlined, 
  GlobalOutlined, PhoneOutlined, SettingOutlined, TeamOutlined,
  InfoCircleOutlined, CheckCircleOutlined, PlusOutlined, DeleteOutlined,
  PictureOutlined
} from '@ant-design/icons';
import api from '../utils/api';

const { Title, Text } = Typography;
const { TextArea } = Input;

// 配置分组定义
const CONFIG_GROUPS = [
  { 
    key: 'general', 
    label: '基本信息', 
    icon: <SettingOutlined />, 
    desc: '网站名称、标语等基础信息',
    color: '#1890ff'
  },
  { 
    key: 'contact', 
    label: '联系方式', 
    icon: <PhoneOutlined />, 
    desc: '电话、邮箱、地址等联系信息',
    color: '#52c41a'
  },
  { 
    key: 'logo', 
    label: 'LOGO管理', 
    icon: <PictureOutlined />, 
    desc: '网站Logo、Favicon等图标管理',
    color: '#fa8c16'
  },
  { 
    key: 'seo', 
    label: 'SEO设置', 
    icon: <GlobalOutlined />, 
    desc: '搜索引擎优化相关设置',
    color: '#722ed1'
  },
  { 
    key: 'social', 
    label: '社交媒体', 
    icon: <TeamOutlined />, 
    desc: '社交媒体账号链接',
    color: '#eb2f96'
  },
];

// 默认配置数据（本地备用，防止后端未初始化）
const DEFAULT_CONFIGS = {
  general: [
    { id: 1, key: 'site_name', value: '华南留学', label: '网站名称', description: '网站显示的名称', type: 'string' },
    { id: 2, key: 'site_slogan', value: '专业留学服务，助您圆梦名校', label: '网站标语', description: '网站副标题/标语', type: 'string' },
  ],
  contact: [
    { id: 3, key: 'phone', value: '+86 400 888 8888', label: '联系电话', description: '联系页面显示的电话号码', type: 'string' },
    { id: 4, key: 'phone_time', value: '周一至周日 9:00-21:00', label: '电话服务时间', description: '电话服务时间说明', type: 'string' },
    { id: 5, key: 'email', value: 'info@huananliu.com', label: '联系邮箱', description: '官方联系邮箱', type: 'string' },
    { id: 6, key: 'email_reply', value: '24小时内回复', label: '邮箱回复说明', description: '邮箱回复时效说明', type: 'string' },
    { id: 7, key: 'address', value: '广州市天河区珠江新城', label: '公司地址（简写）', description: '用于联系卡片显示', type: 'string' },
    { id: 8, key: 'address_full', value: '广州市天河区珠江新城华夏路30号', label: '完整地址', description: '完整的公司详细地址', type: 'string' },
    { id: 9, key: 'address_note', value: '欢迎预约到访咨询', label: '地址备注', description: '地址下方的提示文字', type: 'string' },
    { id: 10, key: 'online_title', value: '7×24小时在线', label: '在线服务标题', description: '在线服务标题', type: 'string' },
    { id: 11, key: 'online_desc', value: '随时为您解答疑问', label: '在线服务描述', description: '在线服务描述', type: 'string' },
    { id: 12, key: 'wechat', value: 'huananliu', label: '微信公众号', description: '微信公众号ID', type: 'string' },
    { id: 13, key: 'business_hours', value: '周一至周日 9:00-21:00', label: '营业时间', description: '公司营业时间', type: 'string' },
    { id: 14, key: 'wechat_qr', value: '', label: '微信二维码', description: '微信公众号二维码图片URL', type: 'image' },
  ],
  seo: [
    { id: 9, key: 'seo_title', value: '华南留学 - 专业留学申请服务', label: 'SEO标题', description: '网站SEO标题', type: 'string' },
    { id: 10, key: 'seo_keywords', value: '留学,留学申请,出国留学,留学中介,留学咨询', label: 'SEO关键词', description: '网站SEO关键词，用逗号分隔', type: 'string' },
    { id: 11, key: 'seo_description', value: '华南留学提供专业的留学申请服务，涵盖美国、英国、澳大利亚、加拿大等国家，助您成功进入世界顶尖名校。', label: 'SEO描述', description: '网站SEO描述', type: 'text' },
  ],
  logo: [
    { id: 20, key: 'logo', value: '/images/logo.png', label: '主Logo', description: '网站主Logo，用于导航栏、页脚等位置', type: 'image' },
    { id: 21, key: 'logo_dark', value: '', label: '深色背景Logo', description: '深色背景使用的浅色Logo（如未设置则使用主Logo）', type: 'image' },
    { id: 22, key: 'footer_logo', value: '', label: '页脚Logo', description: '页脚区域显示的Logo（如未设置则使用主Logo）', type: 'image' },
    { id: 23, key: 'favicon', value: '/favicon.ico', label: 'Favicon图标', description: '浏览器标签页图标', type: 'image' },
    { id: 24, key: 'admin_logo', value: '/images/logo.png', label: '后台Logo', description: '后台管理系统显示的Logo', type: 'image' },
  ],
  social: [
    { id: 30, key: 'weibo', value: '', label: '微博链接', description: '官方微博链接', type: 'string' },
    { id: 31, key: 'douyin', value: '', label: '抖音链接', description: '官方抖音链接', type: 'string' },
    { id: 32, key: 'xiaohongshu', value: '', label: '小红书链接', description: '官方小红书链接', type: 'string' },
  ],
};

function Config() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [configs, setConfigs] = useState(DEFAULT_CONFIGS);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState({});
  const [saveStatus, setSaveStatus] = useState(''); // 'success' | 'error' | ''

  // 获取配置
  const fetchConfigs = useCallback(async (showMessage = false) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/config/admin');
      
      if (res.success && res.data && Object.keys(res.data).length > 0) {
        setConfigs(res.data);
        setInitialized(true);
        
        // 设置表单值
        const values = {};
        Object.values(res.data).flat().forEach(item => {
          values[item.key] = item.value;
        });
        form.setFieldsValue(values);
        
        if (showMessage) {
          message.success('配置已刷新');
        }
      } else {
        // 使用默认配置
        setConfigs(DEFAULT_CONFIGS);
        const values = {};
        Object.values(DEFAULT_CONFIGS).flat().forEach(item => {
          values[item.key] = item.value;
        });
        form.setFieldsValue(values);
        setError('后端配置未初始化，正在使用默认配置');
      }
    } catch (err) {
      console.error('获取配置失败:', err);
      // 使用默认配置作为备用
      setConfigs(DEFAULT_CONFIGS);
      const values = {};
      Object.values(DEFAULT_CONFIGS).flat().forEach(item => {
        values[item.key] = item.value;
      });
      form.setFieldsValue(values);
      setError('无法连接后端服务，正在使用默认配置');
    } finally {
      setLoading(false);
    }
  }, [form]);

  // 初始化
  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  // 保存配置
  const handleSave = async () => {
    const values = form.getFieldsValue();
    setSaving(true);
    setSaveStatus('');
    
    try {
      // 批量更新每个配置项
      const currentConfigs = Object.values(configs).flat();
      
      for (const config of currentConfigs) {
        if (values[config.key] !== undefined) {
          await api.put(`/config/admin/${config.id}`, { 
            value: values[config.key] 
          });
        }
      }
      
      setSaveStatus('success');
      message.success('配置保存成功');
      
      // 3秒后清除状态
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (err) {
      console.error('保存失败:', err);
      setSaveStatus('error');
      message.error('保存失败: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // 初始化默认配置
  const handleInit = async () => {
    try {
      const res = await api.post('/config/admin/init');
      if (res.success) {
        message.success('默认配置初始化成功');
        fetchConfigs(true);
      } else {
        message.error(res.message || '初始化失败');
      }
    } catch (err) {
      console.error('初始化失败:', err);
      
      // 如果后端初始化失败，手动创建配置
      try {
        for (const group of Object.values(DEFAULT_CONFIGS)) {
          for (const config of group) {
            await api.post('/config/admin', config);
          }
        }
        message.success('配置创建成功');
        fetchConfigs(true);
      } catch (createErr) {
        message.error('初始化失败: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // 图片上传 - 通用
  const handleUpload = async (key, { file, onSuccess, onError }) => {
    setUploading(prev => ({ ...prev, [key]: true }));
    try {
      const formData = new FormData();
      formData.append('banner', file);
      const res = await api.post('/upload/banner', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.success) {
        form.setFieldsValue({ [key]: res.data.url });
        message.success('上传成功');
        onSuccess?.(res.data);
      } else {
        message.error(res.message || '上传失败');
        onError?.(new Error(res.message));
      }
    } catch (err) {
      message.error('上传失败');
      onError?.(err);
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }));
    }
  };

  // Logo上传 - 使用专门的logo接口
  const handleLogoUpload = async (key, { file, onSuccess, onError }) => {
    setUploading(prev => ({ ...prev, [key]: true }));
    try {
      const formData = new FormData();
      formData.append('logo', file);
      const res = await api.post('/upload/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.success) {
        form.setFieldsValue({ [key]: res.data.url });
        message.success('Logo上传成功');
        onSuccess?.(res.data);
      } else {
        message.error(res.message || '上传失败');
        onError?.(new Error(res.message));
      }
    } catch (err) {
      message.error('上传失败');
      onError?.(err);
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }));
    }
  };

  // 渲染配置输入项
  const renderConfigInput = (config) => {
    const commonProps = {
      placeholder: config.description || `请输入${config.label}`,
      style: { width: '100%' }
    };

    switch (config.type) {
      case 'image':
        // 判断是否是Logo配置项
        const isLogo = config.key.includes('logo');
        const currentValue = form.getFieldValue(config.key);
        
        return (
          <div className="flex items-start gap-4">
            <Form.Item name={config.key} noStyle>
              <div className="relative">
                {currentValue ? (
                  <Image
                    src={currentValue}
                    alt={config.label}
                    width={isLogo ? 160 : 120}
                    height={isLogo ? 160 : 120}
                    className="rounded-lg border object-contain bg-gray-50"
                    fallback="https://via.placeholder.com/120?text=Error"
                    style={{ 
                      padding: isLogo ? '12px' : '8px',
                      backgroundColor: config.key === 'logo_dark' ? '#1f2937' : '#f9fafb'
                    }}
                  />
                ) : (
                  <div 
                    className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50"
                    style={{ width: isLogo ? 160 : 120, height: isLogo ? 160 : 120 }}
                  >
                    <div className="text-center p-4">
                      <PictureOutlined className="text-3xl text-gray-300 mb-2" />
                      <div className="text-xs text-gray-400">暂无图片</div>
                    </div>
                  </div>
                )}
                
                {/* 删除按钮 */}
                {currentValue && (
                  <Button
                    type="text"
                    danger
                    size="small"
                    className="absolute -top-2 -right-2"
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      form.setFieldsValue({ [config.key]: '' });
                      message.success('已清除，保存后生效');
                    }}
                  />
                )}
              </div>
            </Form.Item>
            <div className="flex-1">
              <Upload
                customRequest={(props) => isLogo ? handleLogoUpload(config.key, props) : handleUpload(config.key, props)}
                accept="image/*"
                showUploadList={false}
              >
                <Button 
                  type={isLogo ? 'primary' : 'default'}
                  icon={<UploadOutlined />} 
                  loading={uploading[config.key]}
                >
                  {uploading[config.key] ? '上传中...' : (currentValue ? '更换图片' : '上传图片')}
                </Button>
              </Upload>
              
              <div className="text-xs text-gray-400 mt-2 space-y-1">
                {isLogo ? (
                  <>
                    <div>• 建议尺寸: 200 x 200 像素 (正方形)</div>
                    <div>• 支持格式: PNG、JPG、SVG</div>
                    <div>• 建议透明背景，文件小于 5MB</div>
                  </>
                ) : (
                  <>
                    <div>建议尺寸: 400 x 400 像素</div>
                    <div>支持 JPG、PNG 格式</div>
                  </>
                )}
              </div>
              
              {/* 输入框显示当前路径 */}
              <Form.Item name={config.key} noStyle>
                <Input 
                  placeholder="图片URL"
                  className="mt-2"
                  size="small"
                  disabled
                  addonBefore={
                    <Tooltip title="可直接输入图片URL">
                      <InfoCircleOutlined />
                    </Tooltip>
                  }
                />
              </Form.Item>
            </div>
          </div>
        );
      
      case 'text':
        return (
          <TextArea 
            {...commonProps} 
            rows={4} 
            showCount 
            maxLength={500}
          />
        );
      
      case 'number':
        return <InputNumber {...commonProps} style={{ width: '100%' }} />;
      
      case 'boolean':
        return <Switch />;
      
      default:
        return (
          <Input 
            {...commonProps}
            prefix={
              config.key.includes('phone') ? <PhoneOutlined /> :
              config.key.includes('email') ? '✉️' :
              config.key.includes('address') ? '📍' :
              null
            }
          />
        );
    }
  };

  // 渲染配置组
  const renderConfigGroup = (groupKey) => {
    const groupConfigs = configs[groupKey] || [];
    const groupInfo = CONFIG_GROUPS.find(g => g.key === groupKey);
    
    if (groupConfigs.length === 0) {
      return (
        <Empty 
          description="暂无配置项" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: groupInfo.color }}
          >
            {groupInfo.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{groupInfo.label}</h3>
            <p className="text-sm text-gray-500">{groupInfo.desc}</p>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          {groupConfigs.map(config => (
            <Col xs={24} md={config.type === 'text' || config.type === 'image' ? 24 : 12} key={config.key}>
              <Form.Item
                name={config.key}
                label={
                  <Space>
                    <span className="font-medium">{config.label}</span>
                    {config.description && (
                      <Tooltip title={config.description}>
                        <InfoCircleOutlined className="text-gray-400" />
                      </Tooltip>
                    )}
                  </Space>
                }
              >
                {renderConfigInput(config)}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  // 快速预览值
  const getPreviewValue = (key) => {
    return form.getFieldValue(key) || '-';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Spin size="large" />
        <p className="mt-4 text-gray-500">加载配置中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Title level={4} className="!mb-1">网站配置</Title>
          <Text type="secondary">管理网站基础信息、联系方式和SEO设置</Text>
        </div>
        
        <Space>
          {error && (
            <Button onClick={handleInit} type="dashed" icon={<PlusOutlined />}>
              初始化配置
            </Button>
          )}
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => fetchConfigs(true)}
          >
            刷新
          </Button>
          <Button
            type="primary"
            icon={saveStatus === 'success' ? <CheckCircleOutlined /> : <SaveOutlined />}
            loading={saving}
            onClick={handleSave}
            size="large"
            style={{
              backgroundColor: saveStatus === 'success' ? '#52c41a' : undefined,
            }}
          >
            {saveStatus === 'success' ? '已保存' : '保存更改'}
          </Button>
        </Space>
      </div>

      {/* 错误提示 */}
      {error && (
        <Alert
          message={error}
          type="warning"
          showIcon
          closable
          onClose={() => setError(null)}
          action={
            <Button size="small" onClick={handleInit}>
              立即初始化
            </Button>
          }
        />
      )}

      {/* 配置表单 */}
      <Card className="shadow-sm">
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            type="card"
            items={CONFIG_GROUPS.map(group => ({
              key: group.key,
              label: (
                <span className="flex items-center gap-2">
                  {group.icon}
                  {group.label}
                </span>
              ),
              children: renderConfigGroup(group.key)
            }))}
          />
        </Form>
      </Card>

      {/* 实时预览 */}
      <Card 
        title="配置预览" 
        className="shadow-sm"
        extra={<Tag color="blue">实时更新</Tag>}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" className="bg-gray-50">
              <div className="text-sm text-gray-500 mb-1">网站名称</div>
              <div className="font-semibold text-lg truncate">
                {getPreviewValue('site_name')}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" className="bg-gray-50">
              <div className="text-sm text-gray-500 mb-1">联系电话</div>
              <div className="font-semibold text-lg truncate">
                {getPreviewValue('phone')}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" className="bg-gray-50">
              <div className="text-sm text-gray-500 mb-1">联系邮箱</div>
              <div className="font-semibold text-lg truncate">
                {getPreviewValue('email')}
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" className="bg-gray-50">
              <div className="text-sm text-gray-500 mb-1">营业时间</div>
              <div className="font-semibold text-lg truncate">
                {getPreviewValue('business_hours')}
              </div>
            </Card>
          </Col>
        </Row>
        
        <Divider className="my-4" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">公司地址</div>
            <div className="font-medium">{getPreviewValue('address')}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">SEO标题</div>
            <div className="font-medium">{getPreviewValue('seo_title')}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Config;
