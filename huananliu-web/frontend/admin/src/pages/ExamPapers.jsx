/**
 * 试卷管理页面
 * 功能：模考卷列表、创建/编辑试卷、组卷
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
  InputNumber,
  Switch,
  Transfer,
  List,
  Typography,
  Divider,
  Badge
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  ReloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const EXAM_TYPES = [
  { value: 'ielts', label: '雅思', color: 'blue' },
  { value: 'toefl', label: '托福', color: 'green' }
];

const SUBJECTS = [
  { value: 'listening', label: '听力' },
  { value: 'reading', label: '阅读' },
  { value: 'writing', label: '写作' },
  { value: 'speaking', label: '口语' }
];

function ExamPapers() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);
  const [transferVisible, setTransferVisible] = useState(false);
  const [targetKeys, setTargetKeys] = useState([]);

  // 获取试卷列表
  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: params.current || pagination.current,
        pageSize: params.pageSize || pagination.pageSize
      });
      const res = await fetch(`/api/exam-papers?${queryParams}`);
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

  useEffect(() => {
    fetchData();
  }, []);

  // 获取可选题目
  const fetchAvailableQuestions = async (examType, subject) => {
    try {
      const excludeIds = editingRecord?.questions?.map(q => q.id).join(',') || '';
      const query = new URLSearchParams({
        exam_type: examType,
        ...(subject && { subject }),
        exclude_ids: excludeIds
      });
      const res = await fetch(`/api/exam-papers/options/available-questions?${query}`);
      const result = await res.json();
      if (result.success) {
        setAvailableQuestions(result.data.map(q => ({
          key: q.id.toString(),
          ...q,
          title: `[${q.type}] ${q.title?.replace(/<[^>]+>/g, '').slice(0, 50) || '无标题'}...`
        })));
      }
    } catch (error) {
      message.error('获取可选题目失败');
    }
  };

  // 表格列
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60
    },
    {
      title: '试卷标题',
      dataIndex: 'title',
      render: (text, record) => (
        <Space>
          {text}
          {record.is_official === 1 && <Badge count="官方" style={{ backgroundColor: '#52c41a' }} />}
        </Space>
      )
    },
    {
      title: '考试类型',
      dataIndex: 'exam_type',
      width: 100,
      render: (type) => {
        const item = EXAM_TYPES.find(t => t.value === type);
        return <Tag color={item?.color}>{item?.label || type}</Tag>;
      }
    },
    {
      title: '科目',
      dataIndex: 'subject',
      width: 80,
      render: (subject) => subject ? SUBJECTS.find(s => s.value === subject)?.label : '综合'
    },
    {
      title: '题目数',
      dataIndex: 'question_count',
      width: 80
    },
    {
      title: '总分',
      dataIndex: 'total_score',
      width: 80,
      render: (score) => <Tag color="blue">{score}分</Tag>
    },
    {
      title: '时长',
      dataIndex: 'time_limit',
      width: 100,
      render: (seconds) => {
        if (!seconds) return '-';
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        return hours > 0 ? `${hours}小时${mins}分` : `${mins}分钟`;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === 1 ? 'success' : 'default'}>
          {status === 1 ? '已上架' : '已下架'}
        </Tag>
      )
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button icon={<EyeOutlined />} size="small" onClick={() => handleView(record)}>
            查看
          </Button>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger />
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 查看详情
  const handleView = async (record) => {
    try {
      const res = await fetch(`/api/exam-papers/${record.id}`);
      const result = await res.json();
      if (result.success) {
        setDetailRecord(result.data);
        setDetailModalVisible(true);
      }
    } catch (error) {
      message.error('获取详情失败');
    }
  };

  // 新增
  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setSelectedQuestions([]);
    setTargetKeys([]);
    setModalVisible(true);
  };

  // 编辑
  const handleEdit = async (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      title: record.title,
      exam_type: record.exam_type,
      subject: record.subject,
      description: record.description,
      time_limit: record.time_limit ? record.time_limit / 60 : null, // 转换为分钟
      is_official: record.is_official === 1
    });

    // 获取试卷详情以加载题目
    try {
      const res = await fetch(`/api/exam-papers/${record.id}`);
      const result = await res.json();
      if (result.success && result.data.questions) {
        const questions = result.data.questions.map(q => ({
          ...q,
          sort_order: q.ExamPaperQuestion?.sort_order || 0,
          score: q.ExamPaperQuestion?.score || 1
        }));
        setSelectedQuestions(questions);
      }
    } catch (error) {
      console.error('获取试卷题目失败', error);
    }

    setModalVisible(true);
  };

  // 删除
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/exam-papers/${id}`, { method: 'DELETE' });
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

      if (selectedQuestions.length === 0) {
        message.error('请至少选择一道题目');
        return;
      }

      const payload = {
        ...values,
        time_limit: values.time_limit ? values.time_limit * 60 : 0,
        is_official: values.is_official ? 1 : 0,
        question_ids: selectedQuestions.map(q => q.id),
        scores: selectedQuestions.reduce((acc, q) => {
          acc[q.id] = q.score || 1;
          return acc;
        }, {})
      };

      const url = editingRecord ? `/api/exam-papers/${editingRecord.id}` : '/api/exam-papers';
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

  // 打开题目选择
  const openQuestionSelector = () => {
    const examType = form.getFieldValue('exam_type');
    const subject = form.getFieldValue('subject');

    if (!examType) {
      message.warning('请先选择考试类型');
      return;
    }

    fetchAvailableQuestions(examType, subject);
    setTargetKeys(selectedQuestions.map(q => q.id.toString()));
    setTransferVisible(true);
  };

  // 确认选择题目
  const handleTransferConfirm = () => {
    const newQuestions = targetKeys.map(key => {
      const existing = selectedQuestions.find(q => q.id.toString() === key);
      if (existing) return existing;

      const fromAvailable = availableQuestions.find(q => q.key === key);
      return {
        id: parseInt(fromAvailable.key),
        title: fromAvailable.title,
        type: fromAvailable.type,
        difficulty: fromAvailable.difficulty,
        score: 1
      };
    });

    setSelectedQuestions(newQuestions);
    setTransferVisible(false);
  };

  // 移除题目
  const removeQuestion = (index) => {
    const newQuestions = selectedQuestions.filter((_, i) => i !== index);
    setSelectedQuestions(newQuestions);
  };

  // 调整顺序
  const moveQuestion = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === selectedQuestions.length - 1) return;

    const newQuestions = [...selectedQuestions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
    setSelectedQuestions(newQuestions);
  };

  // 修改分值
  const updateScore = (index, score) => {
    const newQuestions = [...selectedQuestions];
    newQuestions[index].score = score;
    setSelectedQuestions(newQuestions);
  };

  return (
    <div>
      <Card
        title={
          <Space>
            <FileTextOutlined />
            <span>试卷管理</span>
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            创建试卷
          </Button>
        }
      >
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

      {/* 编辑/新增弹窗 */}
      <Modal
        title={editingRecord ? '编辑试卷' : '创建试卷'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={1000}
        bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="title" label="试卷标题" rules={[{ required: true }]}>
                <Input placeholder="如：雅思全真模拟卷-Test 1" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="is_official" valuePropName="checked">
                <Switch checkedChildren="官方真题" unCheckedChildren="自定义" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="exam_type" label="考试类型" rules={[{ required: true }]}>
                <Select placeholder="请选择">
                  {EXAM_TYPES.map(t => <Option key={t.value} value={t.value}>{t.label}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="subject" label="科目（可选）">
                <Select placeholder="综合卷" allowClear>
                  {SUBJECTS.map(s => <Option key={s.value} value={s.value}>{s.label}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="time_limit" label="考试时长（分钟）">
                <InputNumber min={0} style={{ width: '100%' }} placeholder="不限时" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="试卷描述">
            <TextArea rows={2} placeholder="试卷简介、适用人群等" />
          </Form.Item>

          <Divider>题目设置</Divider>

          <div style={{ marginBottom: 16 }}>
            <Space>
              <Button type="primary" onClick={openQuestionSelector}>
                选择题目
              </Button>
              <Text type="secondary">
                已选 {selectedQuestions.length} 题，总分 {selectedQuestions.reduce((sum, q) => sum + (q.score || 1), 0)} 分
              </Text>
            </Space>
          </div>

          <List
            bordered
            dataSource={selectedQuestions}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <InputNumber
                    key="score"
                    min={0.5}
                    max={100}
                    step={0.5}
                    value={item.score || 1}
                    onChange={(v) => updateScore(index, v)}
                    style={{ width: 70 }}
                    addonAfter="分"
                  />,
                  <Button
                    key="up"
                    icon={<ArrowUpOutlined />}
                    size="small"
                    disabled={index === 0}
                    onClick={() => moveQuestion(index, 'up')}
                  />,
                  <Button
                    key="down"
                    icon={<ArrowDownOutlined />}
                    size="small"
                    disabled={index === selectedQuestions.length - 1}
                    onClick={() => moveQuestion(index, 'down')}
                  />,
                  <Button
                    key="delete"
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                    onClick={() => removeQuestion(index)}
                  />
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <Badge count={index + 1} style={{ backgroundColor: '#1890ff' }} />
                      <span style={{ fontSize: 12, color: '#666' }}>
                        [{item.type === 'single_choice' ? '单选' : item.type}]
                      </span>
                    </Space>
                  }
                  description={
                    <Text ellipsis style={{ maxWidth: 400 }}>
                      {item.title?.replace(/<[^>]+>/g, '').slice(0, 80)}...
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        </Form>
      </Modal>

      {/* 题目选择弹窗 */}
      <Modal
        title="选择题目"
        open={transferVisible}
        onOk={handleTransferConfirm}
        onCancel={() => setTransferVisible(false)}
        width={800}
      >
        <Transfer
          dataSource={availableQuestions}
          titles={['可选题目', '已选题目']}
          targetKeys={targetKeys}
          onChange={setTargetKeys}
          render={item => item.title}
          listStyle={{ width: 350, height: 400 }}
          showSearch
          filterOption={(inputValue, item) =>
            item.title.toLowerCase().includes(inputValue.toLowerCase())
          }
        />
      </Modal>

      {/* 详情弹窗 */}
      <Modal
        title="试卷详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[<Button key="close" onClick={() => setDetailModalVisible(false)}>关闭</Button>]}
        width={900}
      >
        {detailRecord && (
          <div>
            <Title level={4}>{detailRecord.title}</Title>
            <Space size="large" style={{ marginBottom: 16 }}>
              <Tag color={EXAM_TYPES.find(t => t.value === detailRecord.exam_type)?.color}>
                {EXAM_TYPES.find(t => t.value === detailRecord.exam_type)?.label}
              </Tag>
              <span>{detailRecord.subject ? SUBJECTS.find(s => s.value === detailRecord.subject)?.label : '综合卷'}</span>
              <span><ClockCircleOutlined /> {detailRecord.time_limit ? `${detailRecord.time_limit / 60} 分钟` : '不限时'}</span>
              <span><TrophyOutlined /> {detailRecord.total_score} 分</span>
              <span>共 {detailRecord.question_count} 题</span>
            </Space>

            {detailRecord.description && (
              <>
                <Divider />
                <Text>{detailRecord.description}</Text>
              </>
            )}

            <Divider orientation="left">题目列表</Divider>

            <List
              bordered
              dataSource={detailRecord.questions}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <Badge count={index + 1} style={{ backgroundColor: '#1890ff' }} />
                        <Tag color="blue">{item.ExamPaperQuestion?.score || 1}分</Tag>
                        <span style={{ fontSize: 12, color: '#666' }}>
                          [{item.type}]
                        </span>
                      </Space>
                    }
                    description={
                      <Text ellipsis style={{ maxWidth: 600 }}>
                        {item.title?.replace(/<[^>]+>/g, '').slice(0, 100)}...
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ExamPapers;
