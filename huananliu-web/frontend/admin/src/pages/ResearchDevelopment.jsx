import { useState, useEffect } from 'react';
import { 
  Card, Form, Input, Button, Switch, Tag, Space, 
  message, Row, Col, Select, Divider, Badge, Tabs,
  InputNumber, Upload, List
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, SaveOutlined, 
  ReloadOutlined, ExperimentOutlined, FileSearchOutlined,
  TeamOutlined, ReadOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { getAdminConfigs, batchUpdateConfigs } from '../utils/api';

const { TabPane } = Tabs;
const { TextArea } = Input;

// 默认配置
const defaultConfig = {
  // 基础信息
  title: '科研提升',
  subtitle: '顶尖教授指导',
  description: '顶尖教授指导科研项目，发表国际论文，获得权威推荐信',
  badge: '推荐',
  
  // 卡片展示
  card_icon: 'flask',
  card_color: 'from-cyan-500 to-blue-600',
  features: ['课题设计', '实验指导', '论文发表', '推荐信'],
  
  // 详情页 Banner
  banner_title: '科研背景提升项目',
  banner_subtitle: '与世界顶尖教授合作，开展前沿科研项目，发表高水平学术论文',
  banner_image: '',
  
  // 科研领域
  research_fields: [
    { 
      name: '人工智能', 
      icon: '🤖', 
      desc: '机器学习、深度学习、计算机视觉、自然语言处理',
      topics: ['神经网络架构', '大语言模型', '计算机视觉', '强化学习', 'AI伦理'],
      professors: 'MIT、斯坦福、CMU教授',
      output: 'SCI/EI论文、专利'
    },
    { 
      name: '生物医学', 
      icon: '🧬', 
      desc: '分子生物学、基因工程、药物研发、神经科学',
      topics: ['基因编辑', '癌症研究', '神经退行性疾病', '药物筛选', '生物信息学'],
      professors: '哈佛、约翰霍普金斯教授',
      output: 'SCI论文、实验报告'
    },
    { 
      name: '材料科学', 
      icon: '⚗️', 
      desc: '纳米材料、新能源材料、生物材料、计算材料',
      topics: ['纳米技术', '电池材料', '柔性电子', '催化剂', '量子材料'],
      professors: '斯坦福、伯克利教授',
      output: 'SCI论文、专利'
    },
    { 
      name: '金融经济', 
      icon: '📈', 
      desc: '量化金融、行为经济、金融科技、风险管理',
      topics: ['量化交易', '区块链技术', '行为金融', '市场微观结构', 'ESG投资'],
      professors: '沃顿、LSE、芝大教授',
      output: 'SSCI论文、研究报告'
    },
    { 
      name: '环境科学', 
      icon: '🌱', 
      desc: '气候变化、可持续发展、环境工程、生态学',
      topics: ['碳中和', '可再生能源', '环境建模', '生态保护', '循环经济'],
      professors: '耶鲁、哥大教授',
      output: 'SCI论文、政策建议'
    },
    { 
      name: '心理学', 
      icon: '🧠', 
      desc: '认知心理学、发展心理学、社会心理学、神经心理学',
      topics: ['认知发展', '心理健康', '决策行为', '脑成像研究', '教育心理学'],
      professors: '哈佛、剑桥教授',
      output: 'SSCI论文、实验报告'
    },
  ],
  
  // 服务流程
  process_steps: [
    { title: '兴趣评估', desc: '评估学术兴趣和科研潜力，匹配研究方向', icon: 'assess' },
    { title: '导师匹配', desc: '根据研究方向匹配全球顶尖教授', icon: 'match' },
    { title: '课题确定', desc: '与导师共同确定研究课题和目标', icon: 'topic' },
    { title: '科研培训', desc: '研究方法、文献阅读、数据分析培训', icon: 'train' },
    { title: '项目执行', desc: '在导师指导下开展科研项目', icon: 'execute' },
    { title: '论文发表', desc: '撰写论文，投稿国际期刊或会议', icon: 'publish' },
  ],
  
  // 项目类型
  project_types: [
    { 
      name: '基础研究项目', 
      duration: '3-6个月', 
      desc: '系统性文献综述、理论框架构建、小规模实验',
      suitable: '科研入门，希望了解学术研究流程',
      output: '文献综述、研究报告'
    },
    { 
      name: '应用研究项目', 
      duration: '6-12个月', 
      desc: '实证研究、数据分析、模型构建、应用验证',
      suitable: '有一定基础，希望产出实质成果',
      output: 'SCI/SSCI论文投稿、专利'
    },
    { 
      name: '高端定制项目', 
      duration: '12-18个月', 
      desc: '前沿课题探索、大规模实验、多篇论文发表',
      suitable: '追求顶尖成果，目标顶尖名校',
      output: '顶刊论文、权威推荐信、奖项提名'
    },
  ],
  
  // 导师资源
  mentors: [
    { 
      name: 'Prof. Anderson', 
      university: 'MIT', 
      field: '人工智能',
      title: '计算机科学系教授',
      research: '深度学习、计算机视觉',
      papers: 'Nature/Science 10+篇',
      students: '指导30+学生进MIT/斯坦福'
    },
    { 
      name: 'Prof. Chen', 
      university: 'Stanford', 
      field: '生物医学',
      title: '医学院教授',
      research: '癌症免疫治疗、基因编辑',
      papers: 'Cell/Nature Medicine 20+篇',
      students: '指导25+学生进医学院'
    },
    { 
      name: 'Prof. Williams', 
      university: 'Harvard', 
      field: '经济学',
      title: '经济系教授',
      research: '行为经济学、发展经济学',
      papers: 'AER/QJE 15+篇',
      students: '指导20+学生进哈佛/芝大'
    },
  ],
  
  // 成功案例
  success_cases: [
    { student: '张同学', project: '深度学习在医疗影像中的应用', journal: 'IEEE TMI', school: '录取MIT CS' },
    { student: '李同学', project: 'CRISPR基因编辑优化研究', journal: 'Cell Reports', school: '录取斯坦福生物' },
    { student: '王同学', project: '区块链金融风险管理', journal: 'JFQA', school: '录取沃顿商学院' },
    { student: '陈同学', project: '碳中和政策效果评估', journal: 'Nature Energy', school: '录取耶鲁环境' },
  ],
  
  // 价格方案
  pricing_plans: [
    { 
      name: '入门项目', 
      price: '¥30,000', 
      period: '起', 
      duration: '3-6个月',
      features: ['导师匹配', '研究计划制定', '20小时指导', '文献综述指导', '基础写作辅导'],
      recommended: false 
    },
    { 
      name: '标准项目', 
      price: '¥60,000', 
      period: '起', 
      duration: '6-12个月',
      features: ['顶尖教授1对1', '完整科研指导', '50小时指导', '论文撰写辅导', '期刊投稿指导', '推荐信支持'],
      recommended: true 
    },
    { 
      name: '高端项目', 
      price: '¥120,000', 
      period: '起', 
      duration: '12-18个月',
      features: ['院士/讲席教授', '前沿课题研究', '100小时指导', '顶刊发表目标', '权威推荐信', '奖项提名支持', '全程学术规划'],
      recommended: false 
    },
  ],
  
  // 合作院校
  partner_universities: [
    { name: '麻省理工学院', country: '美国', rank: 'QS #1' },
    { name: '斯坦福大学', country: '美国', rank: 'QS #3' },
    { name: '哈佛大学', country: '美国', rank: 'QS #4' },
    { name: '剑桥大学', country: '英国', rank: 'QS #2' },
    { name: '牛津大学', country: '英国', rank: 'QS #5' },
    { name: '加州理工学院', country: '美国', rank: 'QS #6' },
  ],
  
  // FAQ
  faqs: [
    { question: '科研项目对留学申请有多大帮助？', answer: '顶尖科研项目经历是申请顶尖名校的重要加分项，尤其是研究型硕士和博士申请，能显著提升竞争力。' },
    { question: '我没有科研基础可以参加吗？', answer: '可以的，我们有入门项目专为科研新手设计，从基础开始系统培养科研能力。' },
    { question: '论文发表有保障吗？', answer: '我们承诺标准项目和高端项目的论文发表支持，具体级别取决于项目类型和研究成果。' },
    { question: '导师都是什么水平？', answer: '我们的导师均为全球Top 20大学教授，包括多位院士、讲席教授，在各自领域有重要影响力。' },
  ],
  
  // 联系方式
  contact_phone: '400-888-8888',
  contact_wechat: 'huanan_research',
  
  // 状态
  status: 1,
  show_on_home: true,
  sort_order: 4,
};

function ResearchDevelopment() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [config, setConfig] = useState(defaultConfig);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await getAdminConfigs('service_research');
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
        group: 'service_research'
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
        <h1 className="text-2xl font-bold text-gray-900">科研提升配置</h1>
        <p className="text-gray-500 mt-1">配置首页「科研提升」服务卡片及详情页内容</p>
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
                        <Input placeholder="如：科研提升" />
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
                          { value: 'flask', label: '烧瓶' },
                          { value: 'microscope', label: '显微镜' },
                          { value: 'atom', label: '原子' },
                          { value: 'dna', label: 'DNA' },
                        ]} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="card_color"
                        label="主题色"
                      >
                        <Select options={[
                          { value: 'from-cyan-500 to-blue-600', label: '青色' },
                          { value: 'from-blue-500 to-blue-600', label: '蓝色' },
                          { value: 'from-emerald-500 to-teal-600', label: '绿色' },
                          { value: 'from-violet-500 to-purple-600', label: '紫色' },
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

                <TabPane tab="科研领域" key="fields">
                  <Form.List name="research_fields">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Card 
                            key={field.key} 
                            size="small" 
                            className="mb-3"
                            extra={<DeleteOutlined onClick={() => remove(field.name)} />}
                            title={`领域 ${index + 1}`}
                          >
                            <Row gutter={16}>
                              <Col span={6}>
                                <Form.Item {...field} name={[field.name, 'name']} label="领域名称">
                                  <Input placeholder="如：人工智能" />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item {...field} name={[field.name, 'icon']} label="图标">
                                  <Input placeholder="emoji图标" />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item {...field} name={[field.name, 'professors']} label="导师来源">
                                  <Input placeholder="如：MIT、斯坦福教授" />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item {...field} name={[field.name, 'output']} label="成果形式">
                                  <Input placeholder="如：SCI/EI论文、专利" />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Form.Item {...field} name={[field.name, 'desc']} label="领域描述">
                              <Input placeholder="简短描述" />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'topics']} label="研究主题">
                              <Select mode="tags" placeholder="输入研究主题后回车" style={{ width: '100%' }} />
                            </Form.Item>
                          </Card>
                        ))}
                        <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                          添加科研领域
                        </Button>
                      </>
                    )}
                  </Form.List>
                </TabPane>

                <TabPane tab="项目类型" key="projects">
                  <Form.List name="project_types">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => (
                          <Card 
                            key={field.key} 
                            size="small" 
                            className="mb-3"
                            extra={<DeleteOutlined onClick={() => remove(field.name)} />}
                            title={`类型 ${index + 1}`}
                          >
                            <Row gutter={16}>
                              <Col span={8}>
                                <Form.Item {...field} name={[field.name, 'name']} label="类型名称">
                                  <Input placeholder="如：基础研究项目" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item {...field} name={[field.name, 'duration']} label="项目周期">
                                  <Input placeholder="如：3-6个月" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item {...field} name={[field.name, 'suitable']} label="适合人群">
                                  <Input placeholder="适合什么样的学生" />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Form.Item {...field} name={[field.name, 'desc']} label="项目描述">
                              <Input placeholder="简短描述" />
                            </Form.Item>
                            <Form.Item {...field} name={[field.name, 'output']} label="预期产出">
                              <Input placeholder="如：文献综述、研究报告" />
                            </Form.Item>
                          </Card>
                        ))}
                        <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                          添加项目类型
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
                                <Form.Item {...field} name={[field.name, 'journal']} label="发表期刊">
                                  <Input placeholder="如：IEEE TMI" />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item {...field} name={[field.name, 'school']} label="录取结果">
                                  <Input placeholder="如：录取MIT CS" />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Form.Item {...field} name={[field.name, 'project']} label="项目名称">
                              <Input placeholder="科研项目名称" />
                            </Form.Item>
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
                                  <Input placeholder="如：入门项目" />
                                </Form.Item>
                              </Col>
                              <Col span={5}>
                                <Form.Item {...field} name={[field.name, 'price']} label="价格">
                                  <Input placeholder="如：¥30,000" />
                                </Form.Item>
                              </Col>
                              <Col span={4}>
                                <Form.Item {...field} name={[field.name, 'period']} label="计价单位">
                                  <Input placeholder="如：起" />
                                </Form.Item>
                              </Col>
                              <Col span={5}>
                                <Form.Item {...field} name={[field.name, 'duration']} label="项目周期">
                                  <Input placeholder="如：3-6个月" />
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

            <Card title="导师资源" className="shadow-sm mb-6">
              <Form.List name="mentors">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <div key={field.key} className="mb-4 pb-4 border-b border-gray-100 last:border-0">
                        <Form.Item {...field} name={[field.name, 'name']} label="导师姓名">
                          <Input placeholder="导师姓名" />
                        </Form.Item>
                        <Form.Item {...field} name={[field.name, 'university']} label="所在院校">
                          <Input placeholder="如：MIT" />
                        </Form.Item>
                        <Form.Item {...field} name={[field.name, 'field']} label="研究领域">
                          <Input placeholder="如：人工智能" />
                        </Form.Item>
                        <Form.Item {...field} name={[field.name, 'title']} label="职称">
                          <Input placeholder="如：计算机科学系教授" />
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

            <Card title="合作院校" className="shadow-sm mb-6">
              <Form.List name="partner_universities">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => (
                      <div key={field.key} className="mb-3 pb-3 border-b border-gray-100 last:border-0">
                        <Row gutter={8}>
                          <Col span={12}>
                            <Form.Item {...field} name={[field.name, 'name']} label="院校名称" className="!mb-2">
                              <Input placeholder="院校名称" size="small" />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item {...field} name={[field.name, 'country']} label="国家" className="!mb-2">
                              <Input placeholder="国家" size="small" />
                            </Form.Item>
                          </Col>
                          <Col span={6}>
                            <Form.Item {...field} name={[field.name, 'rank']} label="排名" className="!mb-2">
                              <Input placeholder="QS排名" size="small" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Button type="link" danger size="small" onClick={() => remove(field.name)}>删除</Button>
                      </div>
                    ))}
                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block size="small">
                      添加院校
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
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center text-white mb-3">
                  <span className="text-xl">⚗️</span>
                </div>
                <h4 className="font-bold text-gray-900">{config.title || '科研提升'}</h4>
                <p className="text-gray-500 text-sm mt-1">{config.subtitle || '顶尖教授指导'}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {(config.features || []).slice(0, 3).map((f, i) => (
                    <Tag key={i} size="small">{f}</Tag>
                  ))}
                </div>
                {config.badge && (
                  <Badge className="mt-2" count={config.badge} style={{ backgroundColor: '#06b6d4' }} />
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default ResearchDevelopment;
