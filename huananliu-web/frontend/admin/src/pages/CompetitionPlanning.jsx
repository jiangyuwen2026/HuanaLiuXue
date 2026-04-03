import { useState, useEffect } from 'react';
import { 
  Card, Form, Input, Button, Switch, Tag, Space, 
  message, Row, Col, Select, Divider, Badge, Tabs,
  InputNumber, Upload, List
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, SaveOutlined, 
  ReloadOutlined, TrophyOutlined, StarOutlined,
  TeamOutlined, CalendarOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { getAdminConfigs, batchUpdateConfigs } from '../utils/api';

const { TabPane } = Tabs;
const { TextArea } = Input;

// 默认配置
const defaultConfig = {
  // 基础信息
  title: '竞赛规划',
  subtitle: '国际竞赛辅导',
  description: '提升背景实力，助力名校申请，专业竞赛规划全程指导',
  badge: '',
  
  // 卡片展示
  card_icon: 'trophy',
  card_color: 'from-violet-500 to-purple-600',
  features: ['竞赛选择', '备赛指导', '团队组建', '项目实践'],
  
  // 详情页 Banner
  banner_title: '国际竞赛规划辅导',
  banner_subtitle: '顶尖竞赛指导团队，助力学生在国际舞台脱颖而出',
  banner_image: '',
  
  // 竞赛类型
  competition_types: [
    { 
      name: '数学竞赛', 
      icon: '🔢', 
      desc: 'AMC、AIME、IMO等国际数学奥林匹克竞赛',
      competitions: ['AMC 8/10/12', 'AIME', 'ARML', 'HiMCM', 'MCM/ICM'],
      difficulty: '中等至极高',
      suitable: '数学基础扎实，逻辑思维强的学生'
    },
    { 
      name: '物理竞赛', 
      icon: '⚛️', 
      desc: 'Physics Bowl、BPhO等国际物理奥林匹克竞赛',
      competitions: ['Physics Bowl', 'BPhO', 'CAP', 'SIN', 'PUPC'],
      difficulty: '中等至极高',
      suitable: '物理基础好，实验能力强的学生'
    },
    { 
      name: '化学竞赛', 
      icon: '⚗️', 
      desc: 'USNCO、UKChO等国际化学奥林匹克竞赛',
      competitions: ['USNCO', 'UKChO', 'CCC', 'CCO', 'ChemOlympiad'],
      difficulty: '中等至高',
      suitable: '化学基础扎实，实验操作熟练的学生'
    },
    { 
      name: '生物竞赛', 
      icon: '🧬', 
      desc: 'USABO、BBO等国际生物奥林匹克竞赛',
      competitions: ['USABO', 'BBO', 'Brain Bee', 'iGEM', 'HOSA'],
      difficulty: '中等至高',
      suitable: '生物基础好，记忆力强的学生'
    },
    { 
      name: '计算机竞赛', 
      icon: '💻', 
      desc: 'USACO、NOI等编程与信息学竞赛',
      competitions: ['USACO', 'NOI', 'IOI', 'ACSL', 'Google Code-in'],
      difficulty: '中等至极高',
      suitable: '编程基础好，算法能力强的学生'
    },
    { 
      name: '商科竞赛', 
      icon: '📊', 
      desc: 'NEC、FBLA、DECA等商业与经济竞赛',
      competitions: ['NEC', 'FBLA', 'DECA', 'KWHS', 'ME'],
      difficulty: '中等',
      suitable: '对商业、经济感兴趣的学生'
    },
  ],
  
  // 服务流程
  process_steps: [
    { title: '能力评估', desc: '全面评估学生学科基础与竞赛潜力', icon: 'assess' },
    { title: '竞赛匹配', desc: '根据背景和目标推荐最适合的竞赛', icon: 'match' },
    { title: '规划制定', desc: '制定长期备赛计划和时间安排', icon: 'plan' },
    { title: '系统培训', desc: '知识点讲解、真题训练、模拟测试', icon: 'train' },
    { title: '项目实践', desc: '科研项目、团队项目实践指导', icon: 'practice' },
    { title: '赛前冲刺', desc: '考前强化训练和心理辅导', icon: 'sprint' },
  ],
  
  // 服务优势
  advantages: [
    { title: '金牌导师', desc: '竞赛金牌得主，深谙竞赛规律与技巧', icon: 'gold' },
    { title: '精准定位', desc: '科学评估，精准匹配最适合的竞赛项目', icon: 'target' },
    { title: '系统课程', desc: '从基础到高阶，系统化竞赛培训课程', icon: 'system' },
    { title: '项目资源', desc: '丰富的科研项目和竞赛资源对接', icon: 'resource' },
  ],
  
  // 成功案例
  success_cases: [
    { student: '张同学', competition: 'AMC 12', award: '全球前1%', school: '录取MIT' },
    { student: '李同学', competition: 'Physics Bowl', award: '金奖', school: '录取斯坦福' },
    { student: '王同学', competition: 'USABO', award: '银牌', school: '录取耶鲁' },
    { student: '陈同学', competition: 'USACO', award: '白金级', school: '录取卡内基梅隆' },
  ],
  
  // 价格方案
  pricing_plans: [
    { 
      name: '基础指导', 
      price: '¥8,000', 
      period: '起', 
      features: ['竞赛评估', '选赛建议', '备考资料', '答疑支持'],
      recommended: false 
    },
    { 
      name: '系统培训', 
      price: '¥25,000', 
      period: '起', 
      features: ['全程规划', '系统课程', '真题训练', '模拟测试', '导师1对1', '项目指导'],
      recommended: true 
    },
    { 
      name: 'VIP定制', 
      price: '¥50,000', 
      period: '起', 
      features: ['个性化方案', '金牌导师', '科研项目', '论文发表', '推荐信支持', '全程跟踪'],
      recommended: false 
    },
  ],
  
  // 导师团队
  mentors: [
    { name: 'Dr. Chen', title: '数学竞赛金牌教练', background: 'MIT数学博士', specialty: 'AMC/AIME/IMO', students: '50+金牌学员' },
    { name: 'Dr. Wang', title: '物理竞赛专家', background: '斯坦福物理博士', specialty: 'Physics Bowl/BPhO', students: '30+获奖学员' },
    { name: 'Prof. Li', title: '计算机竞赛导师', background: '前谷歌工程师', specialty: 'USACO/NOI', students: '100+晋级学员' },
  ],
  
  // 竞赛时间线
  timeline: [
    { month: '9-10月', events: ['AMC 10/12报名', 'Physics Bowl报名'] },
    { month: '11月', events: ['AMC 10/12考试', 'BPhO Round 1'] },
    { month: '12月', events: ['AIME资格公布', 'USNCO报名'] },
    { month: '1-2月', events: ['AIME考试', 'USACO月赛', 'USNCO初赛'] },
    { month: '3-4月', events: ['Physics Bowl', 'USABO初赛', 'CCC'] },
    { month: '5-6月', events: ['AP考试', '竞赛冲刺期'] },
  ],
  
  // FAQ
  faqs: [
    { question: '如何选择适合自己的竞赛？', answer: '我们会根据学生的学科基础、兴趣爱好、时间安排以及目标院校，进行科学评估后推荐最适合的竞赛项目。' },
    { question: '竞赛对留学申请有多大帮助？', answer: '顶尖国际竞赛奖项是申请名校的重要加分项，尤其是理工科专业，能显著提升申请竞争力。' },
    { question: '没有基础可以参加竞赛吗？', answer: '可以的，很多竞赛都有适合初学者的级别，我们有基础班帮助学生从零开始系统学习。' },
    { question: '备赛周期一般多长？', answer: '根据竞赛难度和学生基础，一般需要6-12个月的系统准备时间。' },
  ],
  
  // 联系方式
  contact_phone: '400-888-8888',
  contact_wechat: 'huanan_competition',
  
  // 状态
  status: 1,
  show_on_home: true,
  sort_order: 3,
};

function CompetitionPlanning() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [config, setConfig] = useState(defaultConfig);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await getAdminConfigs('service_competition');
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
        group: 'service_competition'
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
        <h1 className="text-2xl font-bold text-gray-900">竞赛规划配置</h1>
        <p className="text-gray-500 mt-1">配置首页「竞赛规划」服务卡片及详情页内容</p>
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
                        <Input placeholder="如：竞赛规划" />
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
                          { value: 'trophy', label: '奖杯' },
                          { value: 'star', label: '星星' },
                          { value: 'medal', label: '奖牌' },
                          { value: 'crown', label: '皇冠' },
                        ]} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="card_color"
                        label="主题色"
                      >
                        <Select options={[
                          { value: 'from-violet-500 to-purple-600', label: '紫色' },
                          { value: 'from-blue-500 to-blue-600', label: '蓝色' },
                          { value: 'from-emerald-500 to-teal-600', label: '绿色' },
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

                <TabPane tab="竞赛类型" key="competitions">
                  <Form.List name="competition_types">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Card 
                            key={field.key} 
                            size="small" 
                            className="mb-3"
                            extra={<DeleteOutlined onClick={() => remove(field.name)} />}
                            title={`竞赛类型 ${index + 1}`}
                          >
                            <Row gutter={16}>
                              <Col span={6}>
                                <Form.Item {...field} name={[field.name, 'name']} label="类型名称">
                                  <Input placeholder="如：数学竞赛" />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item {...field} name={[field.name, 'icon']} label="图标">
                                  <Input placeholder="emoji图标" />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item {...field} name={[field.name, 'difficulty']} label="难度等级">
                                  <Input placeholder="如：中等至极高" />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item {...field} name={[field.name, 'suitable']} label="适合人群">
                                  <Input placeholder="适合什么样的学生" />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Form.Item {...field} name={[field.name, 'desc']} label="类型描述">
                              <Input placeholder="简短描述" />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'competitions']} label="包含竞赛">
                              <Select mode="tags" placeholder="输入竞赛名称后回车" style={{ width: '100%' }} />
                            </Form.Item>
                          </Card>
                        ))}
                        <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                          添加竞赛类型
                        </Button>
                      </>
                    )}
                  </Form.List>
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
                                <Form.Item {...field} name={[field.name, 'title']} label="步骤名称">
                                  <Input placeholder="如：能力评估" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item {...field} name={[field.name, 'icon']} label="图标">
                                  <Input placeholder="图标标识" />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Form.Item {...field} name={[field.name, 'desc']} label="步骤描述">
                              <Input placeholder="简短描述" />
                            </Form.Item>
                          </Card>
                        ))}
                        <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                          添加流程步骤
                        </Button>
                      </>
                    )}
                  </Form.List>
                </TabPane>

                <TabPane tab="成功案例" key="cases">
                  <Form.List name="success_cases">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Card 
                            key={field.key} 
                            size="small" 
                            className="mb-3"
                            extra={<DeleteOutlined onClick={() => remove(field.name)} />}
                            title={`案例 ${index + 1}`}
                          >
                            <Row gutter={16}>
                              <Col span={6}>
                                <Form.Item {...field} name={[field.name, 'student']} label="学生姓名">
                                  <Input placeholder="如：张同学" />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item {...field} name={[field.name, 'competition']} label="竞赛名称">
                                  <Input placeholder="如：AMC 12" />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item {...field} name={[field.name, 'award']} label="获奖情况">
                                  <Input placeholder="如：全球前1%" />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item {...field} name={[field.name, 'school']} label="录取结果">
                                  <Input placeholder="如：录取MIT" />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                        <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                          添加成功案例
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
                                  <Input placeholder="如：基础指导" />
                                </Form.Item>
                              </Col>
                              <Col span={5}>
                                <Form.Item {...field} name={[field.name, 'price']} label="价格">
                                  <Input placeholder="如：¥8,000" />
                                </Form.Item>
                              </Col>
                              <Col span={4}>
                                <Form.Item {...field} name={[field.name, 'period']} label="计价单位">
                                  <Input placeholder="如：起" />
                                </Form.Item>
                              </Col>
                              <Col span={5}>
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

            <Card title="导师团队" className="shadow-sm mb-6">
              <Form.List name="mentors">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <div key={field.key} className="mb-4 pb-4 border-b border-gray-100 last:border-0">
                        <Form.Item {...field} name={[field.name, 'name']} label="导师姓名">
                          <Input placeholder="导师姓名" />
                        </Form.Item>
                        <Form.Item {...field} name={[field.name, 'title']} label="职称">
                          <Input placeholder="如：数学竞赛金牌教练" />
                        </Form.Item>
                        <Form.Item {...field} name={[field.name, 'background']} label="背景">
                          <Input placeholder="如：MIT数学博士" />
                        </Form.Item>
                        <Button type="link" danger onClick={() => remove(field.name)}>删除</Button>
                      </div>
                    ))}
                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                      添加导师
                    </Button>
                  </>
                )}
              </Form.List>
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
                <div className="bg-gradient-to-br from-violet-500 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center text-white mb-3">
                  <span className="text-xl">🏆</span>
                </div>
                <h4 className="font-bold text-gray-900">{config.title || '竞赛规划'}</h4>
                <p className="text-gray-500 text-sm mt-1">{config.subtitle || '国际竞赛辅导'}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {(config.features || []).slice(0, 3).map((f, i) => (
                    <Tag key={i} size="small">{f}</Tag>
                  ))}
                </div>
                {config.badge && (
                  <Badge className="mt-2" count={config.badge} style={{ backgroundColor: '#8b5cf6' }} />
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default CompetitionPlanning;
