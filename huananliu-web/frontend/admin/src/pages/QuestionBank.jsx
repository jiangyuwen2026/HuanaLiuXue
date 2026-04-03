/**
 * 题库管理页面
 * 功能：题目列表、新增/编辑/删除题目、分类管理、标签管理
 */
import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Popconfirm,
  message,
  Row,
  Col,
  Tabs,
  InputNumber,
  Divider,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TagsOutlined,
  FolderOutlined,
  EyeOutlined,
  CopyOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

// 考试类型
const EXAM_TYPES = [
  { value: 'ielts', label: '雅思', color: 'blue' },
  { value: 'toefl', label: '托福', color: 'green' }
];

// 科目
const SUBJECTS = [
  { value: 'listening', label: '听力' },
  { value: 'reading', label: '阅读' },
  { value: 'writing', label: '写作' },
  { value: 'speaking', label: '口语' }
];

// 难度
const DIFFICULTIES = [
  { value: 1, label: '简单', color: 'success' },
  { value: 2, label: '中等', color: 'warning' },
  { value: 3, label: '困难', color: 'error' }
];

// 题型
const QUESTION_TYPES = [
  { value: 'single_choice', label: '单选题', subjects: ['listening', 'reading'] },
  { value: 'multiple_choice', label: '多选题', subjects: ['reading'] },
  { value: 'true_false_not_given', label: '判断题', subjects: ['reading'] },
  { value: 'fill_blank', label: '填空题', subjects: ['listening', 'reading'] },
  { value: 'matching', label: '匹配题', subjects: ['reading'] },
  { value: 'map_labeling', label: '地图标注', subjects: ['listening'] },
  { value: 'sentence_completion', label: '句子完成', subjects: ['listening'] },
  { value: 'essay', label: '大作文(Task 2)', subjects: ['writing'] },
  { value: 'short_answer', label: '小作文(Task 1)', subjects: ['writing'] },
  { value: 'speaking_part1', label: '口语Part 1', subjects: ['speaking'] },
  { value: 'speaking_part2', label: '口语Part 2', subjects: ['speaking'] },
  { value: 'speaking_part3', label: '口语Part 3', subjects: ['speaking'] }
];

function QuestionBank() {
  const [activeTab, setActiveTab] = useState('questions');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [filters, setFilters] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [stats, setStats] = useState({});
  const [options, setOptions] = useState([{ key: 'A', text: '' }, { key: 'B', text: '' }]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);

  // 获取题目列表
  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
        ...filters
      });
      const res = await fetch(`/api/questions?${queryParams}`);
      const result = await res.json();
      if (result.success) {
        setData(result.data.list);
        setPagination({
          ...pagination,
          ...params,
          total: result.data.pagination.total
        });
      }
    } catch (error) {
      message.error('获取数据失败');
    }
    setLoading(false);
  };

  // 获取分类
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/questions/categories');
      const result = await res.json();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('获取分类失败', error);
    }
  };

  // 获取标签
  const fetchTags = async () => {
    try {
      const res = await fetch('/api/questions/tags');
      const result = await res.json();
      if (result.success) {
        setTags(result.data);
      }
    } catch (error) {
      console.error('获取标签失败', error);
    }
  };

  // 获取统计
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/questions/stats/overview');
      const result = await res.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('获取统计失败', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
    fetchTags();
    fetchStats();
  }, []);

  // 筛选变化
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    if (!value) delete newFilters[key];
    setFilters(newFilters);
    setPagination({ ...pagination, current: 1 });
    fetchData({ current: 1, pageSize: pagination.pageSize });
  };

  // 表格列
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60
    },
    {
      title: '考试类型',
      dataIndex: 'exam_type',
      width: 80,
      render: (type) => {
        const item = EXAM_TYPES.find(t => t.value === type);
        return <Tag color={item?.color}>{item?.label || type}</Tag>;
      }
    },
    {
      title: '科目',
      dataIndex: 'subject',
      width: 80,
      render: (subject) => {
        const item = SUBJECTS.find(s => s.value === subject);
        return item?.label || subject;
      }
    },
    {
      title: '题型',
      dataIndex: 'type',
      width: 120,
      render: (type) => {
        const item = QUESTION_TYPES.find(t => t.value === type);
        return item?.label || type;
      }
    },
    {
      title: '题干',
      dataIndex: 'title',
      ellipsis: true,
      render: (text) => text?.replace(/<[^>]+>/g, '').slice(0, 50) + '...'
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      width: 80,
      render: (diff) => {
        const item = DIFFICULTIES.find(d => d.value === diff);
        return <Tag color={item?.color}>{item?.label}</Tag>;
      }
    },
    {
      title: '知识点',
      dataIndex: 'tags',
      width: 150,
      render: (tags) => (
        <Space size="small" wrap>
          {tags?.slice(0, 2).map(tag => (
            <Tag key={tag.id} color={tag.color}>{tag.name}</Tag>
          ))}
          {tags?.length > 2 && <Tag>...</Tag>}
        </Space>
      )
    },
    {
      title: '练习次数',
      dataIndex: 'usage_count',
      width: 90
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看">
            <Button icon={<EyeOutlined />} size="small" onClick={() => handleView(record)} />
          </Tooltip>
          <Tooltip title="编辑">
            <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          </Tooltip>
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 查看详情
  const handleView = (record) => {
    setDetailRecord(record);
    setDetailModalVisible(true);
  };

  // 新增
  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setOptions([{ key: 'A', text: '' }, { key: 'B', text: '' }]);
    setModalVisible(true);
  };

  // 编辑
  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      tag_ids: record.tags?.map(t => t.id)
    });
    if (record.options) {
      setOptions(record.options);
    }
    setModalVisible(true);
  };

  // 删除
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        message.success('删除成功');
        fetchData();
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 保存
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        options: ['single_choice', 'multiple_choice'].includes(values.type) ? options : undefined
      };

      const url = editingRecord ? `/api/questions/${editingRecord.id}` : '/api/questions';
      const method = editingRecord ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.success) {
        message.success(editingRecord ? '更新成功' : '创建成功');
        setModalVisible(false);
        fetchData();
      }
    } catch (error) {
      console.error('保存失败', error);
    }
  };

  // 添加选项
  const addOption = () => {
    const key = String.fromCharCode(65 + options.length); // A, B, C...
    setOptions([...options, { key, text: '' }]);
  };

  // 删除选项
  const removeOption = (index) => {
    if (options.length <= 2) {
      message.warning('至少需要两个选项');
      return;
    }
    const newOptions = options.filter((_, i) => i !== index);
    // 重新排列 key
    newOptions.forEach((opt, i) => {
      opt.key = String.fromCharCode(65 + i);
    });
    setOptions(newOptions);
  };

  // 更新选项文本
  const updateOptionText = (index, text) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    setOptions(newOptions);
  };

  // 根据科目筛选题型
  const getQuestionTypesBySubject = (subject) => {
    if (!subject) return QUESTION_TYPES;
    return QUESTION_TYPES.filter(t => t.subjects.includes(subject));
  };

  // 分类管理
  const CategoryManagement = () => (
    <Card>
      <Tabs>
        <TabPane tab="分类列表" key="list">
          <Table
            dataSource={categories}
            rowKey="id"
            columns={[
              { title: 'ID', dataIndex: 'id', width: 60 },
              { title: '名称', dataIndex: 'name' },
              { title: '考试类型', dataIndex: 'exam_type' },
              { title: '科目', dataIndex: 'subject' },
              { title: '排序', dataIndex: 'sort_order', width: 80 },
              {
                title: '操作',
                width: 120,
                render: (_, record) => (
                  <Space>
                    <Button size="small" icon={<EditOutlined />} />
                    <Button size="small" icon={<DeleteOutlined />} danger />
                  </Space>
                )
              }
            ]}
          />
        </TabPane>
      </Tabs>
    </Card>
  );

  // 标签管理
  const TagManagement = () => (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />}>新增标签</Button>
      </div>
      <Space size="large" wrap>
        {tags.map(tag => (
          <Tag key={tag.id} color={tag.color} style={{ fontSize: 14, padding: '4px 12px' }}>
            {tag.name}
            <EditOutlined style={{ marginLeft: 8, cursor: 'pointer' }} />
          </Tag>
        ))}
      </Space>
    </Card>
  );

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="题目管理" key="questions" icon={<QuestionCircleOutlined />}>
          <Card>
            {/* 统计 */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Card size="small">
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                    {stats.total || 0}
                  </div>
                  <div>总题目数</div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                    {stats.today_count || 0}
                  </div>
                  <div>今日新增</div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                    {categories.length}
                  </div>
                  <div>分类数</div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#eb2f96' }}>
                    {tags.length}
                  </div>
                  <div>标签数</div>
                </Card>
              </Col>
            </Row>

            {/* 筛选 */}
            <Space style={{ marginBottom: 16 }} wrap>
              <Select
                placeholder="考试类型"
                style={{ width: 120 }}
                allowClear
                onChange={(v) => handleFilterChange('exam_type', v)}
              >
                {EXAM_TYPES.map(t => <Option key={t.value} value={t.value}>{t.label}</Option>)}
              </Select>
              <Select
                placeholder="科目"
                style={{ width: 120 }}
                allowClear
                onChange={(v) => handleFilterChange('subject', v)}
              >
                {SUBJECTS.map(s => <Option key={s.value} value={s.value}>{s.label}</Option>)}
              </Select>
              <Select
                placeholder="难度"
                style={{ width: 120 }}
                allowClear
                onChange={(v) => handleFilterChange('difficulty', v)}
              >
                {DIFFICULTIES.map(d => <Option key={d.value} value={d.value}>{d.label}</Option>)}
              </Select>
              <Input.Search
                placeholder="搜索题干"
                style={{ width: 250 }}
                onSearch={(v) => handleFilterChange('keyword', v)}
                allowClear
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                新增题目
              </Button>
            </Space>

            {/* 表格 */}
            <Table
              columns={columns}
              dataSource={data}
              rowKey="id"
              loading={loading}
              pagination={pagination}
              onChange={(p) => fetchData(p)}
              scroll={{ x: 1200 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="分类管理" key="categories" icon={<FolderOutlined />}>
          <CategoryManagement />
        </TabPane>

        <TabPane tab="标签管理" key="tags" icon={<TagsOutlined />}>
          <TagManagement />
        </TabPane>
      </Tabs>

      {/* 编辑/新增弹窗 */}
      <Modal
        title={editingRecord ? '编辑题目' : '新增题目'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={900}
        bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="exam_type" label="考试类型" rules={[{ required: true }]}>
                <Select placeholder="请选择">
                  {EXAM_TYPES.map(t => <Option key={t.value} value={t.value}>{t.label}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="subject" label="科目" rules={[{ required: true }]}>
                <Select placeholder="请选择">
                  {SUBJECTS.map(s => <Option key={s.value} value={s.value}>{s.label}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="difficulty" label="难度" rules={[{ required: true }]}>
                <Select placeholder="请选择">
                  {DIFFICULTIES.map(d => <Option key={d.value} value={d.value}>{d.label}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="category_id" label="分类">
            <Select placeholder="请选择分类" allowClear>
              {categories.map(c => (
                <Option key={c.id} value={c.id}>{c.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="type" label="题型" rules={[{ required: true }]}>
            <Select placeholder="请选择">
              {QUESTION_TYPES.map(t => (
                <Option key={t.value} value={t.value}>{t.label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="title" label="题干" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="请输入题干" />
          </Form.Item>

          {/* 选择题选项 */}
          <Form.Item shouldUpdate={(prev, curr) => prev.type !== curr.type}>
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              if (!['single_choice', 'multiple_choice'].includes(type)) return null;
              return (
                <>
                  <Divider>选项设置</Divider>
                  {options.map((opt, index) => (
                    <Row key={opt.key} gutter={8} style={{ marginBottom: 8 }}>
                      <Col span={2}>
                        <Tag color="blue">{opt.key}</Tag>
                      </Col>
                      <Col span={18}>
                        <Input
                          value={opt.text}
                          onChange={(e) => updateOptionText(index, e.target.value)}
                          placeholder={`选项 ${opt.key}`}
                        />
                      </Col>
                      <Col span={4}>
                        <Button size="small" danger onClick={() => removeOption(index)}>
                          删除
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={addOption} block icon={<PlusOutlined />}>
                    添加选项
                  </Button>
                </>
              );
            }}
          </Form.Item>

          <Form.Item name="correct_answer" label="正确答案" rules={[{ required: true }]}>
            <Input placeholder="如：A 或 A,B 或 填空答案" />
          </Form.Item>

          <Form.Item name="answer_analysis" label="答案解析">
            <TextArea rows={4} placeholder="请输入答案解析" />
          </Form.Item>

          <Form.Item name="sample_answer" label="参考答案/范文">
            <TextArea rows={4} placeholder="写作/口语题请输入参考答案" />
          </Form.Item>

          <Form.Item name="tag_ids" label="知识点标签">
            <Select mode="multiple" placeholder="请选择标签">
              {tags.map(t => <Option key={t.id} value={t.id}>{t.name}</Option>)}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="score" label="默认分值">
                <InputNumber min={0.5} max={100} step={0.5} defaultValue={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="time_limit" label="建议用时(秒)">
                <InputNumber min={0} step={10} defaultValue={60} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title="题目详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[<Button key="close" onClick={() => setDetailModalVisible(false)}>关闭</Button>]}
        width={800}
      >
        {detailRecord && (
          <div>
            <p><strong>ID:</strong> {detailRecord.id}</p>
            <p>
              <strong>考试类型:</strong>{' '}
              <Tag color={EXAM_TYPES.find(t => t.value === detailRecord.exam_type)?.color}>
                {EXAM_TYPES.find(t => t.value === detailRecord.exam_type)?.label}
              </Tag>
            </p>
            <p>
              <strong>科目:</strong>{' '}
              {SUBJECTS.find(s => s.value === detailRecord.subject)?.label}
            </p>
            <p>
              <strong>题型:</strong>{' '}
              {QUESTION_TYPES.find(t => t.value === detailRecord.type)?.label}
            </p>
            <p><strong>难度:</strong> {DIFFICULTIES.find(d => d.value === detailRecord.difficulty)?.label}</p>
            <Divider />
            <p><strong>题干:</strong></p>
            <div dangerouslySetInnerHTML={{ __html: detailRecord.title }} />
            {detailRecord.options && (
              <>
                <p><strong>选项:</strong></p>
                <ul>
                  {detailRecord.options.map(opt => (
                    <li key={opt.key}>{opt.key}: {opt.text}</li>
                  ))}
                </ul>
              </>
            )}
            <p><strong>正确答案:</strong> <Tag color="green">{detailRecord.correct_answer}</Tag></p>
            <p><strong>答案解析:</strong></p>
            <div dangerouslySetInnerHTML={{ __html: detailRecord.answer_analysis }} />
            {detailRecord.tags && (
              <>
                <p><strong>知识点标签:</strong></p>
                <Space>
                  {detailRecord.tags.map(tag => (
                    <Tag key={tag.id} color={tag.color}>{tag.name}</Tag>
                  ))}
                </Space>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default QuestionBank;
