import { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, DatePicker, Switch, message, Popconfirm, Tabs as AntTabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../utils/api';

const { TextArea } = Input;
const { Option } = Select;

const categoryOptions = [
  { value: '申请动态', label: '申请动态', color: 'blue' },
  { value: '签证资讯', label: '签证资讯', color: 'green' },
  { value: '语言考试', label: '语言考试', color: 'orange' },
  { value: '奖学金', label: '奖学金', color: 'gold' },
  { value: '政策解读', label: '政策解读', color: 'purple' },
  { value: '招生政策', label: '招生政策', color: 'cyan' },
  { value: '专业动态', label: '专业动态', color: 'magenta' },
  { value: '其他', label: '其他', color: 'default' }
];

const countryOptions = [
  { value: '香港', label: '香港' },
  { value: '英国', label: '英国' },
  { value: '美国', label: '美国' },
  { value: '澳大利亚', label: '澳大利亚' },
  { value: '加拿大', label: '加拿大' },
  { value: '新加坡', label: '新加坡' },
  { value: '新西兰', label: '新西兰' },
  { value: '其他', label: '其他' }
];

export default function StudyNewsTab() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [filters, setFilters] = useState({ search: '', category: '', status: '' });

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page: page,
        limit: pagination.pageSize,
        ...filters
      };
      
      const result = await api.get('/study-news/admin/list', { params });
      
      if (result.success) {
        setData(result.data.list);
        setPagination({ ...pagination, current: page, total: result.data.total });
      }
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({
      status: true,
      is_top: false,
      sort: 0,
      publish_date: dayjs()
    });
    setModalVisible(true);
  };

  const handleEdit = async (record) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      status: record.status === 1,
      is_top: record.is_top === 1,
      publish_date: record.publish_date ? dayjs(record.publish_date) : dayjs()
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      const result = await api.delete(`/study-news/admin/${id}`);
      
      if (result.success) {
        message.success('删除成功');
        fetchData(pagination.current);
      } else {
        message.error(result.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleToggleTop = async (record) => {
    try {
      const result = await api.patch(`/study-news/admin/${record.id}/toggle-top`);
      
      if (result.success) {
        message.success(result.message);
        fetchData(pagination.current);
      } else {
        message.error(result.message || '操作失败');
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        status: values.status ? 1 : 0,
        is_top: values.is_top ? 1 : 0,
        publish_date: values.publish_date ? values.publish_date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
      };

      let result;
      if (editingId) {
        result = await api.put(`/study-news/admin/${editingId}`, payload);
      } else {
        result = await api.post('/study-news/admin', payload);
      }
      
      if (result.success) {
        message.success(editingId ? '更新成功' : '添加成功');
        setModalVisible(false);
        fetchData(pagination.current);
      } else {
        message.error(result.message || '保存失败');
      }
    } catch (error) {
      console.error(error);
      message.error('保存失败，请检查网络或重试');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60
    },
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
      render: (text, record) => (
        <Space>
          {record.is_top === 1 && <Tag color="red">置顶</Tag>}
          {text}
        </Space>
      )
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 100,
      render: (category) => {
        const option = categoryOptions.find(o => o.value === category);
        return option ? <Tag color={option.color}>{category}</Tag> : category;
      }
    },
    {
      title: '国家/地区',
      dataIndex: 'country',
      width: 100
    },
    {
      title: '发布日期',
      dataIndex: 'publish_date',
      width: 110,
      render: (date) => date || '-'
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status === 1 ? 'success' : 'default'}>
          {status === 1 ? '已发布' : '草稿'}
        </Tag>
      )
    },
    {
      title: '浏览量',
      dataIndex: 'view_count',
      width: 80
    },
    {
      title: '操作',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            icon={record.is_top === 1 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
            onClick={() => handleToggleTop(record)}
          >
            {record.is_top === 1 ? '取消置顶' : '置顶'}
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这条快讯吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Input.Search
            placeholder="搜索标题"
            allowClear
            onSearch={(value) => setFilters({ ...filters, search: value })}
            style={{ width: 250 }}
          />
          <Select
            placeholder="全部分类"
            allowClear
            style={{ width: 120 }}
            onChange={(value) => setFilters({ ...filters, category: value || '' })}
          >
            {categoryOptions.map(opt => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
          <Select
            placeholder="全部状态"
            allowClear
            style={{ width: 120 }}
            onChange={(value) => setFilters({ ...filters, status: value !== undefined ? value : '' })}
          >
            <Option value={1}>已发布</Option>
            <Option value={0}>草稿</Option>
          </Select>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加快讯
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: false,
          onChange: (page) => fetchData(page)
        }}
      />

      <Modal
        title={editingId ? '编辑快讯' : '添加快讯'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入快讯标题" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="category" label="分类">
              <Select placeholder="请选择分类" allowClear>
                {categoryOptions.map(opt => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="country" label="国家/地区">
              <Select placeholder="请选择国家/地区" allowClear>
                {countryOptions.map(opt => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="publish_date" label="发布日期">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="sort" label="排序">
              <Input type="number" placeholder="数字越大越靠前" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="source" label="信息来源">
              <Input placeholder="如：香港大学官网" />
            </Form.Item>

            <Form.Item name="source_url" label="来源链接">
              <Input placeholder="https://..." />
            </Form.Item>
          </div>

          <Form.Item name="summary" label="摘要/简介">
            <TextArea rows={3} placeholder="简要描述快讯内容（选填）" />
          </Form.Item>

          <Form.Item name="content" label="详细内容">
            <TextArea rows={6} placeholder="详细内容（选填，支持HTML）" />
          </Form.Item>

          <div style={{ display: 'flex', gap: 32 }}>
            <Form.Item name="is_top" valuePropName="checked" style={{ marginBottom: 0 }}>
              <Switch checkedChildren="置顶" unCheckedChildren="普通" />
            </Form.Item>

            <Form.Item name="status" valuePropName="checked" style={{ marginBottom: 0 }}>
              <Switch checkedChildren="发布" unCheckedChildren="草稿" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
