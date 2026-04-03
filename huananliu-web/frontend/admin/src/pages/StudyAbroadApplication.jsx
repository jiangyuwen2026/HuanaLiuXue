import { useState, useEffect } from 'react';
import { 
  Card, Form, Input, Button, Switch, Tag, Space, 
  message, Row, Col, Upload, Divider, List, Select, 
  Collapse, Tooltip, Badge, Radio, Tabs, Descriptions
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, SaveOutlined, 
  ReloadOutlined, InfoCircleOutlined, PictureOutlined,
  DragOutlined, CheckCircleOutlined, EditOutlined,
  QuestionCircleOutlined, PhoneOutlined, MailOutlined
} from '@ant-design/icons';
import { getAdminConfigs, batchUpdateConfigs } from '../utils/api';

const { Panel } = Collapse;
const { TabPane } = Tabs;
const { TextArea } = Input;

// 默认配置
const defaultConfig = {
  // 基础信息
  title: '留学申请',
  subtitle: '本科/硕士/博士全阶段',
  description: '从选校定位到offer获取，全程专业指导，助您圆梦世界名校',
  badge: '热门',
  
  // 卡片展示
  card_icon: 'graduation',
  card_color: 'from-blue-500 to-blue-600',
  features: ['选校定位', '文书指导', '面试辅导', '签证办理'],
  
  // 详情页 Banner
  banner_title: '专业留学申请服务',
  banner_subtitle: '15年经验，98%录取成功率，助力数千学子圆梦名校',
  banner_image: '',
  
  // 服务流程
  process_steps: [
    { title: '初步咨询', desc: '了解背景，评估条件', icon: 'chat' },
    { title: '选校定位', desc: '精准匹配目标院校', icon: 'target' },
    { title: '材料准备', desc: '文书撰写，材料整理', icon: 'file' },
    { title: '申请递交', desc: '网申填写，材料提交', icon: 'send' },
    { title: '面试辅导', desc: '模拟面试，技巧培训', icon: 'user' },
    { title: '签证办理', desc: '签证指导，行前准备', icon: 'plane' },
  ],
  
  // 服务优势
  advantages: [
    { title: '专业团队', desc: '资深顾问，平均10年以上行业经验', icon: 'team' },
    { title: '定制方案', desc: '一对一定制，精准匹配个人背景', icon: 'solution' },
    { title: '全程跟踪', desc: '从申请到入学，全程贴心服务', icon: 'heart' },
    { title: '高成功率', desc: '98%录取率，远超行业平均水平', icon: 'trophy' },
  ],
  
  // 价格方案
  pricing_plans: [
    { name: '基础版', price: '¥15,000', period: '起', features: ['选校方案', '文书修改3次', '申请递交', '签证指导'], recommended: false },
    { name: '标准版', price: '¥25,000', period: '起', features: ['选校方案', '文书精修', '面试辅导', '申请递交', '签证办理', '行前指导'], recommended: true },
    { name: '尊享版', price: '¥50,000', period: '起', features: ['VIP顾问', '无限文书修改', '保录取承诺', '背景提升', '全套服务', '终身咨询'], recommended: false },
  ],
  
  // 申请国家/地区
  countries: ['美国', '英国', '澳大利亚', '加拿大', '新加坡', '香港', '新西兰', '爱尔兰'],
  
  // 申请阶段
  stages: ['本科申请', '硕士申请', '博士申请', '转学申请', '预科申请'],
  
  // FAQ
  faqs: [
    { question: '申请需要准备哪些材料？', answer: '一般需要成绩单、语言成绩、推荐信、个人陈述、简历等，具体要求因学校而异。' },
    { question: '申请周期大概多长？', answer: '通常需要6-12个月，建议提前一年开始准备。' },
    { question: '可以同时申请多个国家吗？', answer: '可以，我们支持多国混申策略，增加录取机会。' },
  ],
  
  // 联系方式
  contact_phone: '400-888-8888',
  contact_wechat: 'huanan_liuxue',
  
  // 状态
  status: 1,
  show_on_home: true,
  sort_order: 1,
};

function StudyAbroadApplication() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [config, setConfig] = useState(defaultConfig);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await getAdminConfigs('service_study_abroad');
      if (res.success && res.data && res.data.length > 0) {
        // 解析配置
        const configMap = {};
        res.data.forEach(item => {
          try {
            configMap[item.key] = JSON.parse(item.value);
          } catch {
            configMap[item.key] = item.value;
          }
        });
        setConfig(prev => ({ ...prev, ...configMap }));
        form.setFieldsValue({ ...defaultConfig, ...configMap });
      } else {
        // 使用默认配置
        form.setFieldsValue(defaultConfig);
      }
    } catch (error) {
      console.error('获取配置失败:', error);
      message.error('获取配置失败');
      form.setFieldsValue(defaultConfig);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      // 将配置转换为 key-value 数组
      const configs = Object.keys(values).map(key => ({
        key,
        value: typeof values[key] === 'object' ? JSON.stringify(values[key]) : String(values[key]),
        group: 'service_study_abroad'
      }));

      const res = await batchUpdateConfigs(configs);
      if (res.success) {
        message.success('保存成功');
        setConfig(values);
      } else {
        message.error(res.message || '保存失败');
      }
    } catch (error) {
      console.error('保存配置失败:', error);
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">留学申请配置</h1>
        <p className="text-gray-500 mt-1">配置首页「留学申请」服务卡片及详情页内容</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        loading={loading}
      >
        <Row gutter={24}>
          {/* 左侧：主要内容 */}
          <Col span={18}>
            <Card 
              className="shadow-sm mb-6"
              extra={
                <Space>
                  <Button 
                    icon={<ReloadOutlined />} 
                    onClick={fetchConfig}
                    loading={loading}
                  >
                    刷新
                  </Button>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={form.submit}
                    loading={saving}
                  >
                    保存配置
                  </Button>
                </Space>
              }
            >
              <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="基础信息" key="basic">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="title"
                        label="服务名称"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="如：留学申请" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="subtitle"
                        label="副标题"
                      >
                        <Input placeholder="简短的副标题" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    name="description"
                    label="服务描述"
                  >
                    <TextArea rows={3} placeholder="服务的详细描述" />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        name="badge"
                        label="标签"
                      >
                        <Input placeholder="如：热门、推荐" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="card_icon"
                        label="图标类型"
                      >
                        <Select options={[
                          { value: 'graduation', label: '毕业帽' },
                          { value: 'book', label: '书本' },
                          { value: 'plane', label: '飞机' },
                          { value: 'document', label: '文件' },
                        ]} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="card_color"
                        label="主题色"
                      >
                        <Select options={[
                          { value: 'from-blue-500 to-blue-600', label: '蓝色' },
                          { value: 'from-emerald-500 to-teal-600', label: '绿色' },
                          { value: 'from-violet-500 to-purple-600', label: '紫色' },
                          { value: 'from-amber-500 to-orange-600', label: '橙色' },
                        ]} />
                      </Form.Item>
                    </Col>
                  </Row>
                </TabPane>

                <TabPane tab="特色功能" key="features">
                  <Form.List name="features">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Form.Item
                            required={false}
                            key={field.key}
                          >
                            <Space align="baseline">
                              <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                rules={[{
                                  required: true,
                                  whitespace: true,
                                  message: "请输入特色功能",
                                }]}
                                noStyle
                              >
                                <Input placeholder={`特色功能 ${index + 1}`} style={{ width: 300 }} />
                              </Form.Item>
                              <DeleteOutlined onClick={() => remove(field.name)} />
                            </Space>
                          </Form.Item>
                        ))}
                        <Form.Item>
                          <Button
                            type="dashed"
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                          >
                            添加特色功能
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </TabPane>

                <TabPane tab="Banner设置" key="banner">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="banner_title"
                        label="Banner标题"
                      >
                        <Input placeholder="详情页大标题" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="banner_subtitle"
                        label="Banner副标题"
                      >
                        <Input placeholder="详情页副标题" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    name="banner_image"
                    label="Banner图片URL"
                  >
                    <Input placeholder="Banner背景图片地址" />
                  </Form.Item>
                </TabPane>

                <TabPane tab="服务流程" key="process">
                  <Form.List name="process_steps">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Card 
                            key={field.key} 
                            size="small" 
                            className="mb-3"
                            extra={<DeleteOutlined onClick={() => remove(field.name)} />}
                            title={`步骤 ${index + 1}`}
                          >
                            <Row gutter={16}>
                              <Col span={8}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'title']}
                                  label="步骤名称"
                                >
                                  <Input placeholder="如：初步咨询" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'desc']}
                                  label="步骤描述"
                                >
                                  <Input placeholder="简短描述" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'icon']}
                                  label="图标"
                                >
                                  <Input placeholder="图标标识" />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          icon={<PlusOutlined />}
                          block
                        >
                          添加流程步骤
                        </Button>
                      </>
                    )}
                  </Form.List>
                </TabPane>

                <TabPane tab="价格方案" key="pricing">
                  <Form.List name="pricing_plans">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Card 
                            key={field.key} 
                            size="small" 
                            className="mb-3"
                            extra={<DeleteOutlined onClick={() => remove(field.name)} />}
                            title={`方案 ${index + 1}`}
                          >
                            <Row gutter={16}>
                              <Col span={6}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'name']}
                                  label="方案名称"
                                >
                                  <Input placeholder="如：基础版" />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'price']}
                                  label="价格"
                                >
                                  <Input placeholder="如：¥15,000" />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'period']}
                                  label="计价单位"
                                >
                                  <Input placeholder="如：起" />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'recommended']}
                                  label="推荐方案"
                                  valuePropName="checked"
                                >
                                  <Switch />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Form.Item
                              {...field}
                              name={[field.name, 'features']}
                              label="包含服务"
                            >
                              <Select
                                mode="tags"
                                placeholder="输入服务项后回车"
                                style={{ width: '100%' }}
                              />
                            </Form.Item>
                          </Card>
                        ))}
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          icon={<PlusOutlined />}
                          block
                        >
                          添加价格方案
                        </Button>
                      </>
                    )}
                  </Form.List>
                </TabPane>

                <TabPane tab="常见问题" key="faq">
                  <Form.List name="faqs">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Card 
                            key={field.key} 
                            size="small" 
                            className="mb-3"
                            extra={<DeleteOutlined onClick={() => remove(field.name)} />}
                            title={`问题 ${index + 1}`}
                          >
                            <Form.Item
                              {...field}
                              name={[field.name, 'question']}
                              label="问题"
                            >
                              <Input placeholder="常见问题" />
                            </Form.Item>
                            <Form.Item
                              {...field}
                              name={[field.name, 'answer']}
                              label="答案"
                            >
                              <TextArea rows={2} placeholder="问题答案" />
                            </Form.Item>
                          </Card>
                        ))}
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          icon={<PlusOutlined />}
                          block
                        >
                          添加FAQ
                        </Button>
                      </>
                    )}
                  </Form.List>
                </TabPane>
              </Tabs>
            </Card>
          </Col>

          {/* 右侧：侧边栏设置 */}
          <Col span={6}>
            <Card title="状态设置" className="shadow-sm mb-6">
              <Form.Item
                name="status"
                label="服务状态"
                valuePropName="checked"
              >
                <Switch checkedChildren="上架" unCheckedChildren="下架" />
              </Form.Item>
              <Form.Item
                name="show_on_home"
                label="首页展示"
                valuePropName="checked"
              >
                <Switch checkedChildren="显示" unCheckedChildren="隐藏" />
              </Form.Item>
              <Form.Item
                name="sort_order"
                label="排序"
              >
                <Input type="number" min={1} />
              </Form.Item>
            </Card>

            <Card title="申请范围" className="shadow-sm mb-6">
              <Form.Item
                name="countries"
                label="支持国家/地区"
              >
                <Select
                  mode="multiple"
                  placeholder="选择国家/地区"
                  options={[
                    { value: '美国', label: '美国' },
                    { value: '英国', label: '英国' },
                    { value: '澳大利亚', label: '澳大利亚' },
                    { value: '加拿大', label: '加拿大' },
                    { value: '新加坡', label: '新加坡' },
                    { value: '香港', label: '香港' },
                    { value: '新西兰', label: '新西兰' },
                    { value: '爱尔兰', label: '爱尔兰' },
                    { value: '日本', label: '日本' },
                    { value: '韩国', label: '韩国' },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="stages"
                label="申请阶段"
              >
                <Select
                  mode="multiple"
                  placeholder="选择申请阶段"
                  options={[
                    { value: '本科申请', label: '本科申请' },
                    { value: '硕士申请', label: '硕士申请' },
                    { value: '博士申请', label: '博士申请' },
                    { value: '转学申请', label: '转学申请' },
                    { value: '预科申请', label: '预科申请' },
                    { value: '语言班申请', label: '语言班申请' },
                  ]}
                />
              </Form.Item>
            </Card>

            <Card title="联系方式" className="shadow-sm mb-6">
              <Form.Item
                name="contact_phone"
                label="咨询电话"
              >
                <Input prefix={<PhoneOutlined />} placeholder="400-xxx-xxxx" />
              </Form.Item>
              <Form.Item
                name="contact_wechat"
                label="微信咨询"
              >
                <Input placeholder="微信号" />
              </Form.Item>
            </Card>

            <Card title="预览" className="shadow-sm">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center text-white mb-3">
                  <span className="text-xl">🎓</span>
                </div>
                <h4 className="font-bold text-gray-900">{config.title || '留学申请'}</h4>
                <p className="text-gray-500 text-sm mt-1">{config.subtitle || '本科/硕士/博士全阶段'}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {(config.features || []).slice(0, 3).map((f, i) => (
                    <Tag key={i} size="small">{f}</Tag>
                  ))}
                </div>
                {config.badge && (
                  <Badge className="mt-2" count={config.badge} style={{ backgroundColor: '#f97316' }} />
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default StudyAbroadApplication;
