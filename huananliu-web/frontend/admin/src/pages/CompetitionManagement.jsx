import { useState, useEffect } from 'react';
import {
  Card, Table, Button, Tag, Space, message, Popconfirm,
  Input, Select, Modal, Form, Tabs, Row, Col, Upload,
  Divider, InputNumber, Switch
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
  TrophyOutlined, SearchOutlined, ReloadOutlined,
  UploadOutlined, CheckCircleOutlined, CloseCircleOutlined
} from '@ant-design/icons';
import {
  getAdminCompetitions, createCompetition, updateCompetition,
  deleteCompetition, updateCompetitionStatus, getCompetitionCategories
} from '../utils/api';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

// 分类选项
const CATEGORY_OPTIONS = [
  { value: 'math', label: '数学竞赛', color: 'blue' },
  { value: 'physics', label: '物理竞赛', color: 'purple' },
  { value: 'chemistry', label: '化学竞赛', color: 'green' },
  { value: 'biology', label: '生物竞赛', color: 'red' },
  { value: 'computer', label: '计算机竞赛', color: 'indigo' },
  { value: 'business', label: '商科竞赛', color: 'orange' }
];

// 难度选项
const LEVEL_OPTIONS = [
  { value: 'beginner', label: '入门级' },
  { value: 'intermediate', label: '中级' },
  { value: 'advanced', label: '高级' }
];

// 默认表单数据
const defaultFormData = {
  slug: '',
  name: '',
  name_en: '',
  category: 'math',
  level: 'intermediate',
  hero_tag: '',
  hero_short_desc: '',
  overview: '',
  eligibility: '',
  format: '',
  syllabus: '',
  scoring: '',
  timeline: [],
  awards: '',
  award_details: [],
  score_history: [],
  resources: [],
  recommended_books: [],
  participants: '',
  countries: '',
  difficulty_score: 5,
  recognition: '',
  logo: '',
  banner: '',
  official_url: '',
  status: 1,
  sort_order: 0
};

function CompetitionManagement() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    keyword: '',
    category: undefined,
    status: undefined
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');

  const fetchData = async (page = pagination.current) => {
    setLoading(true);
    try {
      const res = await getAdminCompetitions({
        page,
        pageSize: pagination.pageSize,
        ...filters
      });
      if (res.success) {
        setData(res.data);
        setPagination(prev => ({
          ...prev,
          current: page,
          total: res.pagination.total
        }));
      }
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [filters]);

  const handleSearch = () => {
    fetchData(1);
  };

  const handleReset = () => {
    setFilters({ keyword: '', category: undefined, status: undefined });
  };

  const handleCreate = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue(defaultFormData);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...defaultFormData,
      ...record,
      timeline: record.timeline || [],
      award_details: record.award_details || [],
      score_history: record.score_history || [],
      resources: record.resources || [],
      recommended_books: record.recommended_books || []
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteCompetition(id);
      if (res.success) {
        message.success('删除成功');
        fetchData();
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await updateCompetitionStatus(id, status);
      if (res.success) {
        message.success(res.message);
        fetchData();
      }
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const res = editingId
        ? await updateCompetition(editingId, values)
        : await createCompetition(values);

      if (res.success) {
        message.success(editingId ? '更新成功' : '创建成功');
        setModalVisible(false);
        fetchData();
      }
    } catch (error) {
      message.error(editingId ? '更新失败' : '创建失败');
    }
  };

  const columns = [
    {
      title: '竞赛名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-2">
          {record.logo && (
            <img src={record.logo} alt="" className="w-8 h-8 rounded object-cover" />
          )}
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-xs text-gray-400">/{record.slug}</div>
          </div>
        </div>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        const opt = CATEGORY_OPTIONS.find(c => c.value === category);
        return opt ? (
          <Tag color={opt.color}>{opt.label}</Tag>
        ) : category;
      }
    },
    {
      title: '难度',
      dataIndex: 'level',
      key: 'level',
      render: (level) => {
        const opt = LEVEL_OPTIONS.find(l => l.value === level);
        return opt ? (
          <Tag>{opt.label}</Tag>
        ) : level;
      }
    },
    {
      title: '浏览量',
      dataIndex: 'view_count',
      key: 'view_count',
      sorter: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Switch
          checked={status === 1}
          onChange={(checked) => handleStatusChange(record.id, checked ? 1 : 0)}
          checkedChildren="上架"
          unCheckedChildren="下架"
        />
      )
    },
    {
      title: '排序',
      dataIndex: 'sort_order',
      key: 'sort_order'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => window.open(`/competition/${record.slug}`, '_blank')}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="确定删除吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">竞赛管理</h1>
        <p className="text-gray-500 mt-1">管理竞赛详情页面的内容</p>
      </div>

      {/* 搜索区域 */}
      <Card className="mb-6">
        <Space wrap>
          <Input
            placeholder="搜索竞赛名称/标识"
            value={filters.keyword}
            onChange={e => setFilters(f => ({ ...f, keyword: e.target.value }))}
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
            allowClear
            onPressEnter={handleSearch}
          />
          <Select
            placeholder="选择分类"
            value={filters.category}
            onChange={value => setFilters(f => ({ ...f, category: value }))}
            style={{ width: 120 }}
            allowClear
          >
            {CATEGORY_OPTIONS.map(opt => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
          <Select
            placeholder="状态"
            value={filters.status}
            onChange={value => setFilters(f => ({ ...f, status: value }))}
            style={{ width: 100 }}
            allowClear
          >
            <Option value={1}>上架</Option>
            <Option value={0}>下架</Option>
          </Select>
          <Button type="primary" onClick={handleSearch}>搜索</Button>
          <Button onClick={handleReset}>重置</Button>
        </Space>
      </Card>

      {/* 操作按钮 */}
      <div className="mb-4">
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          添加竞赛
        </Button>
      </div>

      {/* 数据表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={pagination}
          onChange={(p) => fetchData(p.current)}
        />
      </Card>

      {/* 编辑/创建弹窗 */}
      <Modal
        title={editingId ? '编辑竞赛' : '添加竞赛'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={1000}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={defaultFormData}
        >
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="基础信息" key="basic">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="竞赛名称"
                    rules={[{ required: true, message: '请输入竞赛名称' }]}
                  >
                    <Input placeholder="如：AMC 10" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="name_en"
                    label="英文名称"
                  >
                    <Input placeholder="英文名称" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="slug"
                    label="URL标识"
                    rules={[{ required: true, message: '请输入URL标识' }]}
                  >
                    <Input placeholder="如：amc-10" addonBefore="/competition/" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="category"
                    label="分类"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      {CATEGORY_OPTIONS.map(opt => (
                        <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="level"
                    label="难度级别"
                  >
                    <Select>
                      {LEVEL_OPTIONS.map(opt => (
                        <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="difficulty_score"
                    label="难度评分 (1-10)"
                  >
                    <InputNumber min={1} max={10} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="hero_tag"
                label="标签"
              >
                <Input placeholder="如：国际顶尖竞赛、藤校认可" />
              </Form.Item>
              <Form.Item
                name="hero_short_desc"
                label="简短描述"
              >
                <TextArea rows={2} placeholder="一句话描述竞赛" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="participants"
                    label="参赛人数"
                  >
                    <Input placeholder="如：30万+" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="countries"
                    label="参与国家数"
                  >
                    <Input placeholder="如：80+" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="recognition"
                label="认可度说明"
              >
                <Input placeholder="如：藤校、G5高度认可" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="logo"
                    label="Logo URL"
                  >
                    <Input placeholder="竞赛Logo图片地址" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="banner"
                    label="Banner URL"
                  >
                    <Input placeholder="详情页Banner图片地址" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="official_url"
                label="官网链接"
              >
                <Input placeholder="官方网站地址" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="sort_order"
                    label="排序"
                  >
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="status"
                    label="状态"
                    valuePropName="checked"
                    getValueFromEvent={(checked) => checked ? 1 : 0}
                    getValueProps={(value) => ({ checked: value === 1 })}
                  >
                    <Switch checkedChildren="上架" unCheckedChildren="下架" />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="竞赛概述" key="overview">
              <Form.Item
                name="overview"
                label="竞赛概述"
              >
                <TextArea rows={8} placeholder="支持HTML格式" />
              </Form.Item>
              <Form.Item
                name="eligibility"
                label="参赛资格"
              >
                <TextArea rows={4} placeholder="参赛条件和要求" />
              </Form.Item>
            </TabPane>

            <TabPane tab="赛制信息" key="format">
              <Form.Item
                name="format"
                label="竞赛形式"
              >
                <TextArea rows={6} placeholder="竞赛形式、题型、时长等（支持HTML）" />
              </Form.Item>
              <Form.Item
                name="syllabus"
                label="考试大纲"
              >
                <TextArea rows={6} placeholder="考试范围和知识点（支持HTML）" />
              </Form.Item>
              <Form.Item
                name="scoring"
                label="评分标准"
              >
                <TextArea rows={4} placeholder="评分规则和计分方式" />
              </Form.Item>
            </TabPane>

            <TabPane tab="时间节点" key="timeline">
              <Form.List name="timeline">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(field => (
                      <Card
                        key={field.key}
                        size="small"
                        className="mb-3"
                        extra={
                          <Button type="link" danger onClick={() => remove(field.name)}>
                            删除
                          </Button>
                        }
                      >
                        <Row gutter={16}>
                          <Col span={8}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'date']}
                              label="日期"
                            >
                              <Input placeholder="如：11月" />
                            </Form.Item>
                          </Col>
                          <Col span={16}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'title']}
                              label="事件"
                            >
                              <Input placeholder="事件名称" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Form.Item
                          {...field}
                          name={[field.name, 'description']}
                          label="描述"
                        >
                          <TextArea rows={2} placeholder="详细说明" />
                        </Form.Item>
                      </Card>
                    ))}
                    <Button type="dashed" onClick={() => add()} block>
                      添加时间节点
                    </Button>
                  </>
                )}
              </Form.List>
            </TabPane>

            <TabPane tab="奖项设置" key="awards">
              <Form.Item
                name="awards"
                label="奖项说明"
              >
                <TextArea rows={4} placeholder="奖项总体说明（支持HTML）" />
              </Form.Item>
              <Divider>奖项详情</Divider>
              <Form.List name="award_details">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(field => (
                      <Card
                        key={field.key}
                        size="small"
                        className="mb-3"
                        extra={
                          <Button type="link" danger onClick={() => remove(field.name)}>
                            删除
                          </Button>
                        }
                      >
                        <Row gutter={16}>
                          <Col span={8}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'level']}
                              label="奖项级别"
                            >
                              <Input placeholder="如：金牌" />
                            </Form.Item>
                          </Col>
                          <Col span={16}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'requirement']}
                              label="获奖条件"
                            >
                              <Input placeholder="如：全球前1%" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Form.Item
                          {...field}
                          name={[field.name, 'benefit']}
                          label="奖项权益"
                        >
                          <TextArea rows={2} placeholder="获奖后的权益" />
                        </Form.Item>
                      </Card>
                    ))}
                    <Button type="dashed" onClick={() => add()} block>
                      添加奖项
                    </Button>
                  </>
                )}
              </Form.List>
            </TabPane>

            <TabPane tab="历年分数线" key="scores">
              <Form.List name="score_history">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(field => (
                      <Card
                        key={field.key}
                        size="small"
                        className="mb-3"
                        extra={
                          <Button type="link" danger onClick={() => remove(field.name)}>
                            删除
                          </Button>
                        }
                      >
                        <Row gutter={16}>
                          <Col span={8}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'year']}
                              label="年份"
                            >
                              <Input placeholder="如：2024" />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'cutoff']}
                              label="分数线"
                            >
                              <Input placeholder="如：120" />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'note']}
                              label="备注"
                            >
                              <Input placeholder="如：晋级分数线" />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                    <Button type="dashed" onClick={() => add()} block>
                      添加分数线
                    </Button>
                  </>
                )}
              </Form.List>
            </TabPane>

            <TabPane tab="备考资源" key="resources">
              <Form.List name="resources">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(field => (
                      <Card
                        key={field.key}
                        size="small"
                        className="mb-3"
                        extra={
                          <Button type="link" danger onClick={() => remove(field.name)}>
                            删除
                          </Button>
                        }
                      >
                        <Row gutter={16}>
                          <Col span={8}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'type']}
                              label="类型"
                            >
                              <Select>
                                <Option value="course">课程</Option>
                                <Option value="material">资料</Option>
                                <Option value="video">视频</Option>
                                <Option value="tool">工具</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={16}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'title']}
                              label="标题"
                            >
                              <Input placeholder="资源标题" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Form.Item
                          {...field}
                          name={[field.name, 'description']}
                          label="描述"
                        >
                          <TextArea rows={2} placeholder="资源描述" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'link']}
                          label="链接"
                        >
                          <Input placeholder="资源链接" />
                        </Form.Item>
                      </Card>
                    ))}
                    <Button type="dashed" onClick={() => add()} block>
                      添加资源
                    </Button>
                  </>
                )}
              </Form.List>
            </TabPane>

            <TabPane tab="推荐书籍" key="books">
              <Form.List name="recommended_books">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(field => (
                      <Card
                        key={field.key}
                        size="small"
                        className="mb-3"
                        extra={
                          <Button type="link" danger onClick={() => remove(field.name)}>
                            删除
                          </Button>
                        }
                      >
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'title']}
                              label="书名"
                            >
                              <Input placeholder="书名" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'author']}
                              label="作者"
                            >
                              <Input placeholder="作者" />
                            </Form.Item>
                          </Col>
                        </Row>
                        <Form.Item
                          {...field}
                          name={[field.name, 'description']}
                          label="简介"
                        >
                          <TextArea rows={2} placeholder="书籍简介" />
                        </Form.Item>
                      </Card>
                    ))}
                    <Button type="dashed" onClick={() => add()} block>
                      添加书籍
                    </Button>
                  </>
                )}
              </Form.List>
            </TabPane>
          </Tabs>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <Button onClick={() => setModalVisible(false)}>取消</Button>
            <Button type="primary" htmlType="submit">
              {editingId ? '保存' : '创建'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default CompetitionManagement;
