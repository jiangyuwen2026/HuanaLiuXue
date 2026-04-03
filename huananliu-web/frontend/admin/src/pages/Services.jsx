import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, Button, Modal, Form, Input, Switch, Tag, 
  Space, Popconfirm, message, Card, Row, Col, 
  Select, Badge, Divider, Tooltip, List
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  ReloadOutlined, TagOutlined, DollarOutlined,
  AppstoreOutlined, CheckCircleOutlined, SettingOutlined
} from '@ant-design/icons';
import { 
  getAdminServices, createAdminService, 
  updateAdminService, deleteAdminService, initServices 
} from '../utils/api';

const colorOptions = [
  { value: 'from-blue-500 to-blue-600', label: '蓝色', color: '#1890ff' },
  { value: 'from-emerald-500 to-teal-600', label: '绿色', color: '#52c41a' },
  { value: 'from-violet-500 to-purple-600', label: '紫色', color: '#722ed1' },
  { value: 'from-cyan-500 to-blue-600', label: '青色', color: '#13c2c2' },
  { value: 'from-amber-500 to-orange-600', label: '橙色', color: '#fa8c16' },
  { value: 'from-rose-500 to-pink-600', label: '粉色', color: '#eb2f96' },
  { value: 'from-red-500 to-red-600', label: '红色', color: '#f5222d' },
];

const iconOptions = [
  { value: 'graduation', label: '毕业帽 🎓' },
  { value: 'book', label: '书本 📚' },
  { value: 'trophy', label: '奖杯 🏆' },
  { value: 'flask', label: '实验 🔬' },
  { value: 'language', label: '语言 🌍' },
  { value: 'plane', label: '飞机 ✈️' },
  { value: 'home', label: '住宿 🏠' },
  { value: 'document', label: '文件 📄' },
];

function Services() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAdminServices();
      if (res.success) {
        setData(res.data || []);
      } else {
        message.error(res.message || '获取数据失败');
      }
    } catch (error) {
      console.error('获取服务列表失败:', error);
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    try {
      // 处理features数组
      const submitData = {
        ...values,
        features: values.features?.filter(f => f) || []
      };

      if (editingId) {
        await updateAdminService(editingId, submitData);
        message.success('更新成功');
      } else {
        await createAdminService(submitData);
        message.success('创建成功');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingId(null);
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      features: record.features || ['', '', '', '']
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAdminService(id);
      message.success('删除成功');
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleInit = async () => {
    try {
      const res = await initServices();
      if (res.success) {
        message.success('初始化成功');
        fetchData();
      }
    } catch (error) {
      message.error('初始化失败');
    }
  };

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      render: (sort) => <Tag color="blue">{sort}</Tag>
    },
    {
      title: '服务名称',
      dataIndex: 'title',
      render: (text, record) => (
        <div>
          <div className="font-medium text-base">{text}</div>
          <div className="text-gray-500 text-sm">{record.subtitle}</div>
        </div>
      )
    },
    {
      title: '标签',
      dataIndex: 'badge',
      width: 100,
      render: (badge) => badge ? (
        <Tag color="orange">{badge}</Tag>
      ) : '-'
    },
    {
      title: '价格',
      dataIndex: 'price',
      width: 120,
      render: (price) => price || '-'
    },
    {
      title: '特色功能',
      dataIndex: 'features',
      render: (features) => (
        <Space size={[4, 4]} wrap>
          {(features || []).slice(0, 3).map((feature, i) => (
            <Tag key={i} size="small">{feature}</Tag>
          ))}
          {(features || []).length > 3 && (
            <Tag size="small">+{(features || []).length - 3}</Tag>
          )}
        </Space>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status) => (
        <Badge 
          status={status === 1 ? 'success' : 'default'} 
          text={status === 1 ? '上架' : '下架'}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          {record.title === '留学申请' && (
            <Button
              type="link"
              icon={<SettingOutlined />}
              onClick={() => navigate('/services/study-abroad')}
            >
              配置
            </Button>
          )}
          {record.title === '英语培训' && (
            <Button
              type="link"
              icon={<SettingOutlined />}
              onClick={() => navigate('/services/english-training')}
            >
              配置
            </Button>
          )}
          {record.title === '竞赛规划' && (
            <Button
              type="link"
              icon={<SettingOutlined />}
              onClick={() => navigate('/services/competition')}
            >
              配置
            </Button>
          )}
          {record.title === '科研提升' && (
            <Button
              type="link"
              icon={<SettingOutlined />}
              onClick={() => navigate('/services/research')}
            >
              配置
            </Button>
          )}
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">产品与服务</h1>
        <p className="text-gray-500 mt-1">管理首页展示的服务项目</p>
      </div>

      {/* Stats Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{data.length}</div>
              <div className="text-gray-500">服务总数</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {data.filter(s => s.status === 1).length}
              </div>
              <div className="text-gray-500">已上架</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card 
        className="shadow-sm"
        extra={
          <Space>
            {data.length === 0 && (
              <Button onClick={handleInit}>
                初始化默认服务
              </Button>
            )}
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchData}
            >
              刷新
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingId(null);
                form.resetFields();
                form.setFieldsValue({ 
                  status: 1, 
                  sort: data.length + 1,
                  color: 'from-blue-500 to-blue-600',
                  icon: 'graduation',
                  features: ['', '', '', '']
                });
                setModalVisible(true);
              }}
            >
              新增服务
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Edit Modal */}
      <Modal
        title={editingId ? '编辑服务' : '新增服务'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingId(null);
        }}
        onOk={form.submit}
        width={700}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="服务名称"
                rules={[{ required: true, message: '请输入服务名称' }]}
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
            label="详细描述"
          >
            <Input.TextArea rows={2} placeholder="服务的详细描述" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="icon"
                label="图标"
              >
                <Select placeholder="选择图标" options={iconOptions} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="color"
                label="主题色"
              >
                <Select placeholder="选择颜色">
                  {colorOptions.map(opt => (
                    <Select.Option key={opt.value} value={opt.value}>
                      <span 
                        className="inline-block w-3 h-3 rounded-full mr-2" 
                        style={{ background: opt.color }}
                      />
                      {opt.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="link"
                label="链接地址"
              >
                <Input placeholder="如：/apply" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="价格显示"
              >
                <Input placeholder="如：¥ 15,000 起" />
              </Form.Item>
            </Col>
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
                name="sort"
                label="排序"
                rules={[{ required: true }]}
              >
                <Input type="number" min={1} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="features"
            label="特色功能（最多4个）"
          >
            <List>
              {[0, 1, 2, 3].map(i => (
                <List.Item key={i} className="!px-0">
                  <Form.Item 
                    name={['features', i]} 
                    className="!mb-0 w-full"
                  >
                    <Input placeholder={`特色功能 ${i + 1}`} />
                  </Form.Item>
                </List.Item>
              ))}
            </List>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="上架" unCheckedChildren="下架" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Services;
