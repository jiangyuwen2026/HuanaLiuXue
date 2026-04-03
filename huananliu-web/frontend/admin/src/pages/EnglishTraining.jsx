import { useState, useEffect } from 'react';
import { 
  Card, Form, Input, Button, Switch, Tag, Space, 
  message, Row, Col, Select, Divider, Badge, Tabs,
  Slider, TimePicker, InputNumber
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, SaveOutlined, 
  ReloadOutlined, SettingOutlined, BookOutlined,
  ClockCircleOutlined, TeamOutlined, TrophyOutlined
} from '@ant-design/icons';
import { getAdminConfigs, batchUpdateConfigs } from '../utils/api';

const { TabPane } = Tabs;
const { TextArea } = Input;

// 默认配置
const defaultConfig = {
  // 基础信息
  title: '英语培训',
  subtitle: '雅思/托福专业培训',
  description: '资深名师团队，个性化教学方案，助力冲刺高分',
  badge: '推荐',
  
  // 卡片展示
  card_icon: 'book',
  card_color: 'from-emerald-500 to-teal-600',
  features: ['小班教学', '1对1辅导', '模考练习', '冲刺班'],
  
  // 详情页 Banner
  banner_title: '专业英语培训',
  banner_subtitle: '雅思/托福/SAT/GRE/GMAT，名师助力冲刺高分',
  banner_image: '',
  
  // 课程类型
  course_types: [
    { 
      name: '雅思课程', 
      icon: '📚', 
      desc: '针对雅思考试的全科培训',
      levels: ['基础班', '强化班', '冲刺班', 'VIP一对一'],
      duration: '4-12周',
      class_size: '6-12人'
    },
    { 
      name: '托福课程', 
      icon: '📝', 
      desc: '托福听说读写全方位提升',
      levels: ['基础班', '强化班', '冲刺班', 'VIP一对一'],
      duration: '4-12周',
      class_size: '6-12人'
    },
    { 
      name: 'SAT课程', 
      icon: '🎯', 
      desc: 'SAT考试专项辅导',
      levels: ['基础班', '强化班', '冲刺班'],
      duration: '8-16周',
      class_size: '4-8人'
    },
    { 
      name: 'GRE/GMAT', 
      icon: '🎓', 
      desc: '研究生入学考试培训',
      levels: ['基础班', '强化班', 'VIP一对一'],
      duration: '8-20周',
      class_size: '4-6人'
    },
  ],
  
  // 师资团队
  teachers: [
    { name: '张老师', title: '雅思首席讲师', experience: '10年教龄', specialty: '雅思口语/写作', students: '5000+' },
    { name: '李老师', title: '托福金牌讲师', experience: '8年教龄', specialty: '托福听力/阅读', students: '4000+' },
    { name: '王老师', title: 'SAT资深讲师', experience: '12年教龄', specialty: 'SAT数学/文法', students: '3000+' },
  ],
  
  // 教学特色
  highlights: [
    { title: '名师授课', desc: '平均10年以上教龄，深谙考试规律', icon: 'teacher' },
    { title: '小班教学', desc: '6-12人精品小班，关注每位学员', icon: 'class' },
    { title: '模考系统', desc: '全真模考，实时评估学习效果', icon: 'exam' },
    { title: '定制方案', desc: '个性化学习方案，针对性提升', icon: 'plan' },
    { title: '课后督导', desc: '助教全程跟踪，确保学习进度', icon: 'track' },
    { title: '高分保障', desc: '未达目标分数，免费重读', icon: 'guarantee' },
  ],
  
  // 课程安排
  schedule: {
    weekday: ['09:00-12:00', '14:00-17:00', '18:30-21:30'],
    weekend: ['09:00-12:00', '14:00-17:00'],
    flexibility: '支持线上线下混合授课'
  },
  
  // 价格方案
  pricing_plans: [
    { 
      name: '基础班', 
      price: '¥6,800', 
      period: '期', 
      hours: '60课时',
      features: ['系统课程', '教材资料', '课后答疑', '阶段测试'],
      recommended: false 
    },
    { 
      name: '强化班', 
      price: '¥12,800', 
      period: '期', 
      hours: '120课时',
      features: ['系统课程', '教材资料', '模考训练', '作文批改', '口语陪练', '学习督导'],
      recommended: true 
    },
    { 
      name: 'VIP一对一', 
      price: '¥500', 
      period: '小时', 
      hours: '按需定制',
      features: ['量身定制', '灵活时间', '专属教材', '全程跟踪', '快速提分', '隐私保护'],
      recommended: false 
    },
  ],
  
  // 学员成果
  achievements: {
    avg_improvement: '1.5-2.0分',
    high_score_rate: '85%',
    satisfaction: '98%',
    total_students: '10000+'
  },
  
  // 校区信息
  campuses: [
    { name: '天河校区', address: '天河区珠江新城', phone: '020-12345678' },
    { name: '越秀校区', address: '越秀区北京路', phone: '020-87654321' },
    { name: '番禺校区', address: '番禺区大学城', phone: '020-11223344' },
  ],
  
  // FAQ
  faqs: [
    { question: '零基础可以学吗？', answer: '可以的，我们有专门的基础班，从语法词汇开始系统学习。' },
    { question: '课程时间灵活吗？', answer: '我们提供平日班、周末班、晚班等多种选择，支持一对一灵活预约。' },
    { question: '没有达到目标分数怎么办？', answer: '我们提供高分保障，未达目标可免费重读强化班课程。' },
    { question: '可以试听吗？', answer: '可以的，我们提供免费试听课，您可以先体验后再决定是否报名。' },
  ],
  
  // 联系方式
  contact_phone: '400-888-8888',
  contact_wechat: 'huanan_english',
  
  // 状态
  status: 1,
  show_on_home: true,
  sort_order: 2,
};

function EnglishTraining() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [config, setConfig] = useState(defaultConfig);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await getAdminConfigs('service_english_training');
      if (res.success && res.data && res.data.length > 0) {
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
      const configs = Object.keys(values).map(key => ({
        key,
        value: typeof values[key] === 'object' ? JSON.stringify(values[key]) : String(values[key]),
        group: 'service_english_training'
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
        <h1 className="text-2xl font-bold text-gray-900">英语培训配置</h1>
        <p className="text-gray-500 mt-1">配置首页「英语培训」服务卡片及详情页内容</p>
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
                        <Input placeholder="如：英语培训" />
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
                          { value: 'book', label: '书本' },
                          { value: 'graduation', label: '毕业帽' },
                          { value: 'language', label: '语言' },
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
                          { value: 'from-emerald-500 to-teal-600', label: '绿色' },
                          { value: 'from-blue-500 to-blue-600', label: '蓝色' },
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
                          <Form.Item required={false} key={field.key}>
                            <Space align="baseline">
                              <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                rules={[{ required: true, whitespace: true, message: "请输入特色功能" }]}
                                noStyle
                              >
                                <Input placeholder={`特色功能 ${index + 1}`} style={{ width: 300 }} />
                              </Form.Item>
                              <DeleteOutlined onClick={() => remove(field.name)} />
                            </Space>
                          </Form.Item>
                        ))}
                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
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
                      <Form.Item name="banner_title" label="Banner标题">
                        <Input placeholder="详情页大标题" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="banner_subtitle" label="Banner副标题">
                        <Input placeholder="详情页副标题" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name="banner_image" label="Banner图片URL">
                    <Input placeholder="Banner背景图片地址" />
                  </Form.Item>
                </TabPane>

                <TabPane tab="课程类型" key="courses">
                  <Form.List name="course_types">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Card 
                            key={field.key} 
                            size="small" 
                            className="mb-3"
                            extra={<DeleteOutlined onClick={() => remove(field.name)} />}
                            title={`课程 ${index + 1}`}
                          >
                            <Row gutter={16}>
                              <Col span={6}>
                                <Form.Item {...field} name={[field.name, 'name']} label="课程名称">
                                  <Input placeholder="如：雅思课程" />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item {...field} name={[field.name, 'icon']} label="图标">
                                  <Input placeholder="emoji图标" />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item {...field} name={[field.name, 'duration']} label="课程周期">
                                  <Input placeholder="如：4-12周" />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item {...field} name={[field.name, 'class_size']} label="班级规模">
                                  <Input placeholder="如：6-12人" />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Form.Item {...field} name={[field.name, 'desc']} label="课程描述">
                              <Input placeholder="简短描述" />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'levels']} label="班型设置">
                              <Select mode="tags" placeholder="输入班型后回车" style={{ width: '100%' }} />
                            </Form.Item>
                          </Card>
                        ))}
                        <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                          添加课程类型
                        </Button>
                      </>
                    )}
                  </Form.List>
                </TabPane>

                <TabPane tab="教学特色" key="highlights">
                  <Form.List name="highlights">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Card 
                            key={field.key} 
                            size="small" 
                            className="mb-3"
                            extra={<DeleteOutlined onClick={() => remove(field.name)} />}
                            title={`特色 ${index + 1}`}
                          >
                            <Row gutter={16}>
                              <Col span={8}>
                                <Form.Item {...field} name={[field.name, 'title']} label="特色标题">
                                  <Input placeholder="如：名师授课" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item {...field} name={[field.name, 'icon']} label="图标标识">
                                  <Input placeholder="图标名称" />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Form.Item {...field} name={[field.name, 'desc']} label="特色描述">
                              <Input placeholder="简短描述" />
                            </Form.Item>
                          </Card>
                        ))}
                        <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                          添加教学特色
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
                                <Form.Item {...field} name={[field.name, 'name']} label="方案名称">
                                  <Input placeholder="如：基础班" />
                                </Form.Item>
                              </Col>
                              <Col span={5}>
                                <Form.Item {...field} name={[field.name, 'price']} label="价格">
                                  <Input placeholder="如：¥6,800" />
                                </Form.Item>
                              </Col>
                              <Col span={4}>
                                <Form.Item {...field} name={[field.name, 'period']} label="计价单位">
                                  <Input placeholder="如：期" />
                                </Form.Item>
                              </Col>
                              <Col span={5}>
                                <Form.Item {...field} name={[field.name, 'hours']} label="课时数">
                                  <Input placeholder="如：60课时" />
                                </Form.Item>
                              </Col>
                              <Col span={4}>
                                <Form.Item {...field} name={[field.name, 'recommended']} label="推荐方案" valuePropName="checked">
                                  <Switch />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Form.Item {...field} name={[field.name, 'features']} label="包含服务">
                              <Select mode="tags" placeholder="输入服务项后回车" style={{ width: '100%' }} />
                            </Form.Item>
                          </Card>
                        ))}
                        <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                          添加价格方案
                        </Button>
                      </>
                    )}
                  </Form.List>
                </TabPane>

                <TabPane tab="校区信息" key="campuses">
                  <Form.List name="campuses">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Card 
                            key={field.key} 
                            size="small" 
                            className="mb-3"
                            extra={<DeleteOutlined onClick={() => remove(field.name)} />}
                            title={`校区 ${index + 1}`}
                          >
                            <Row gutter={16}>
                              <Col span={8}>
                                <Form.Item {...field} name={[field.name, 'name']} label="校区名称">
                                  <Input placeholder="如：天河校区" />
                                </Form.Item>
                              </Col>
                              <Col span={10}>
                                <Form.Item {...field} name={[field.name, 'address']} label="地址">
                                  <Input placeholder="校区地址" />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item {...field} name={[field.name, 'phone']} label="电话">
                                  <Input placeholder="联系电话" />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                        <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                          添加校区
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
                            <Form.Item {...field} name={[field.name, 'question']} label="问题">
                              <Input placeholder="常见问题" />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'answer']} label="答案">
                              <TextArea rows={2} placeholder="问题答案" />
                            </Form.Item>
                          </Card>
                        ))}
                        <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
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
              <Form.Item name="status" label="服务状态" valuePropName="checked">
                <Switch checkedChildren="上架" unCheckedChildren="下架" />
              </Form.Item>
              <Form.Item name="show_on_home" label="首页展示" valuePropName="checked">
                <Switch checkedChildren="显示" unCheckedChildren="隐藏" />
              </Form.Item>
              <Form.Item name="sort_order" label="排序">
                <Input type="number" min={1} />
              </Form.Item>
            </Card>

            <Card title="学员成果" className="shadow-sm mb-6">
              <Form.Item name={['achievements', 'avg_improvement']} label="平均提分">
                <Input placeholder="如：1.5-2.0分" />
              </Form.Item>
              <Form.Item name={['achievements', 'high_score_rate']} label="高分率">
                <Input placeholder="如：85%" />
              </Form.Item>
              <Form.Item name={['achievements', 'satisfaction']} label="满意度">
                <Input placeholder="如：98%" />
              </Form.Item>
              <Form.Item name={['achievements', 'total_students']} label="学员总数">
                <Input placeholder="如：10000+" />
              </Form.Item>
            </Card>

            <Card title="联系方式" className="shadow-sm mb-6">
              <Form.Item name="contact_phone" label="咨询电话">
                <Input placeholder="400-xxx-xxxx" />
              </Form.Item>
              <Form.Item name="contact_wechat" label="微信咨询">
                <Input placeholder="微信号" />
              </Form.Item>
            </Card>

            <Card title="预览" className="shadow-sm">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-12 h-12 rounded-lg flex items-center justify-center text-white mb-3">
                  <span className="text-xl">📚</span>
                </div>
                <h4 className="font-bold text-gray-900">{config.title || '英语培训'}</h4>
                <p className="text-gray-500 text-sm mt-1">{config.subtitle || '雅思/托福专业培训'}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {(config.features || []).slice(0, 3).map((f, i) => (
                    <Tag key={i} size="small">{f}</Tag>
                  ))}
                </div>
                {config.badge && (
                  <Badge className="mt-2" count={config.badge} style={{ backgroundColor: '#10b981' }} />
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default EnglishTraining;
