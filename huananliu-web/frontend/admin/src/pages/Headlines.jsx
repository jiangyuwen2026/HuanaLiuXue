import { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Input, Switch, Space, 
  Popconfirm, message, Card, Tag, Upload, Image
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  ReloadOutlined, EyeOutlined, ArrowUpOutlined, ArrowDownOutlined
} from '@ant-design/icons';
import api from '../utils/api';

function Headlines() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/headlines/admin');
      if (res.success) {
        setData(res.data || []);
      } else {
        message.error(res.message || '获取数据失败');
      }
    } catch (error) {
      console.error('获取头条列表失败:', error);
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
      const submitData = {
        ...values,
        cover: imageUrl || values.cover
      };

      if (editingId) {
        await api.put(`/headlines/admin/${editingId}`, submitData);
        message.success('更新成功');
      } else {
        await api.post('/headlines/admin', submitData);
        message.success('创建成功');
      }
      setModalVisible(false);
      form.resetFields();
      setImageUrl('');
      setEditingId(null);
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setImageUrl(record.cover || '');
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/headlines/admin/${id}`);
      message.success('删除成功');
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleInit = async () => {
    try {
      const res = await api.post('/headlines/admin/init');
      if (res.success) {
        message.success(res.message || '初始化成功');
        fetchData();
      }
    } catch (error) {
      message.error('初始化失败');
    }
  };

  const handleStatusChange = async (id, checked) => {
    try {
      await api.put(`/headlines/admin/${id}`, { status: checked ? 1 : 0 });
      message.success('状态更新成功');
      fetchData();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const moveItem = async (index, direction) => {
    const newData = [...data];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newData.length) return;
    
    [newData[index], newData[targetIndex]] = [newData[targetIndex], newData[index]];
    
    // 更新排序
    try {
      for (let i = 0; i < newData.length; i++) {
        await api.put(`/headlines/admin/${newData[i].id}`, { sort: i });
      }
      setData(newData);
      message.success('排序更新成功');
    } catch (error) {
      message.error('排序更新失败');
    }
  };

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      render: (_, record, index) => (
        <Space direction="vertical" size="small">
          <Tag color="blue">{index + 1}</Tag>
          <Space>
            <Button 
              type="text" 
              size="small" 
              icon={<ArrowUpOutlined />} 
              disabled={index === 0}
              onClick={() => moveItem(index, 'up')}
            />
            <Button 
              type="text" 
              size="small" 
              icon={<ArrowDownOutlined />} 
              disabled={index === data.length - 1}
              onClick={() => moveItem(index, 'down')}
            />
          </Space>
        </Space>
      )
    },
    {
      title: '封面图',
      dataIndex: 'cover',
      width: 120,
      render: (url) => url ? (
        <Image src={url} alt="封面" width={100} height={60} className="object-cover rounded-lg" />
      ) : <span className="text-gray-400">无图片</span>
    },
    {
      title: '标题',
      dataIndex: 'title',
      render: (text, record) => (
        <div>
          <div className="font-medium text-base">{text}</div>
          <div className="text-gray-500 text-sm line-clamp-1">{record.summary}</div>
        </div>
      )
    },
    {
      title: '链接类型',
      dataIndex: 'link_type',
      width: 100,
      render: (type) => (
        <Tag color={type === 'news' ? 'blue' : 'green'}>
          {type === 'news' ? '站内新闻' : '外部链接'}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status, record) => (
        <Switch 
          checked={status === 1} 
          onChange={(checked) => handleStatusChange(record.id, checked)}
          checkedChildren="上架"
          unCheckedChildren="下架"
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">头条管理</h1>
          <p className="text-gray-500 mt-1">管理留学资讯首页的头条轮播图（最多显示5条）</p>
        </div>
        <Space>
          {data.length === 0 && (
            <Button onClick={handleInit}>
              初始化默认头条
            </Button>
          )}
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchData}
            loading={loading}
          >
            刷新
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              setImageUrl('');
              form.setFieldsValue({ 
                status: 1, 
                sort: data.length,
                link_type: 'news'
              });
              setModalVisible(true);
            }}
          >
            新增头条
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600">{data.length}</div>
            <div className="text-gray-500">头条总数</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {data.filter(h => h.status === 1).length}
            </div>
            <div className="text-gray-500">已上架</div>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card className="shadow-sm">
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={false}
        />
      </Card>

      {/* Edit Modal */}
      <Modal
        title={editingId ? '编辑头条' : '新增头条'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setImageUrl('');
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
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="头条标题" />
          </Form.Item>

          <Form.Item
            name="summary"
            label="摘要"
          >
            <Input.TextArea rows={3} placeholder="简短描述，显示在首页" />
          </Form.Item>

          <Form.Item
            name="cover"
            label="封面图URL"
          >
            <Input 
              placeholder="封面图片地址" 
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="封面预览">
            {imageUrl ? (
              <Image src={imageUrl} alt="封面预览" width={200} className="rounded-lg" />
            ) : (
              <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                暂无图片
              </div>
            )}
          </Form.Item>

          <Form.Item
            name="link_type"
            label="链接类型"
            initialValue="news"
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="link_id"
            label="关联新闻ID"
          >
            <Input type="number" placeholder="关联的新闻文章ID（可选）" />
          </Form.Item>

          <Form.Item
            name="sort"
            label="排序"
            rules={[{ required: true }]}
          >
            <Input type="number" min={0} />
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

export default Headlines;
