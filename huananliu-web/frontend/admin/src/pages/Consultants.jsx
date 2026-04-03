import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Tag, Space, Avatar, Upload, Image, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons';
import { getAdminConsultants, createConsultant, updateConsultant, deleteConsultant, uploadConsultantAvatar } from '../utils/api';

function Consultants() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const [specialties, setSpecialties] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAdminConsultants({ limit: 100 });
      if (res.success) setData(res.data.list);
    } catch (error) { 
      console.error(error); 
      message.error('获取数据失败');
    }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (values) => {
    try {
      const submitData = { ...values, specialties: JSON.stringify(specialties) };
      if (editingId) { 
        await updateConsultant(editingId, submitData); 
        message.success('更新成功'); 
      }
      else { 
        await createConsultant(submitData); 
        message.success('创建成功'); 
      }
      setModalVisible(false); 
      form.resetFields(); 
      setSpecialties([]);
      fetchData();
    } catch (error) { 
      message.error('操作失败'); 
    }
  };

  const handleEdit = (record) => { 
    setEditingId(record.id); 
    form.setFieldsValue(record); 
    // Parse specialties
    let specs = record.specialties;
    if (typeof specs === 'string') {
      try { specs = JSON.parse(specs); } catch { specs = []; }
    }
    setSpecialties(Array.isArray(specs) ? specs : []);
    setModalVisible(true); 
  };

  const handleDelete = async (id) => { 
    try { 
      await deleteConsultant(id); 
      message.success('删除成功'); 
      fetchData(); 
    } catch (error) { 
      message.error('删除失败'); 
    } 
  };

  const handleAddSpecialty = () => {
    if (inputValue && !specialties.includes(inputValue)) {
      setSpecialties([...specialties, inputValue]);
      setInputValue('');
    }
  };

  const handleRemoveSpecialty = (removedTag) => {
    setSpecialties(specialties.filter(tag => tag !== removedTag));
  };

  // 处理图片上传
  const handleUpload = async ({ file, onSuccess, onError }) => {
    setUploadLoading(true);
    try {
      const res = await uploadConsultantAvatar(file);
      if (res.success) {
        message.success('上传成功');
        form.setFieldsValue({ avatar: res.data.url });
        onSuccess(res.data);
      } else {
        message.error(res.message || '上传失败');
        onError(new Error(res.message));
      }
    } catch (error) {
      message.error('上传失败');
      onError(error);
    } finally {
      setUploadLoading(false);
    }
  };

  // 预览图片
  const handlePreview = (url) => {
    setPreviewImage(url);
    setPreviewVisible(true);
  };

  const serviceTypes = [
    { value: '本科申请', label: '本科申请' },
    { value: '硕士申请', label: '硕士申请' },
    { value: '博士申请', label: '博士申请' },
    { value: '语言考试', label: '语言考试' },
    { value: '艺术申请', label: '艺术申请' },
    { value: '全阶段申请', label: '全阶段申请' },
  ];

  const regions = [
    { value: '广州', label: '广州' },
    { value: '深圳', label: '深圳' },
    { value: '北京', label: '北京' },
    { value: '上海', label: '上海' },
    { value: '杭州', label: '杭州' },
    { value: '成都', label: '成都' },
  ];

  const columns = [
    { 
      title: '头像', 
      dataIndex: 'avatar', 
      width: 90,
      render: (avatar, record) => (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Avatar 
            size={64} 
            src={avatar} 
            style={{ border: '2px solid #f0f0f0', cursor: 'pointer' }}
            onClick={() => avatar && handlePreview(avatar)}
          >
            {record.name?.charAt(0)}
          </Avatar>
          {avatar && (
            <EyeOutlined 
              style={{ 
                position: 'absolute', 
                bottom: 0, 
                right: 0, 
                background: '#1890ff', 
                color: 'white', 
                borderRadius: '50%', 
                padding: '2px', 
                fontSize: '12px',
                cursor: 'pointer'
              }}
              onClick={() => handlePreview(avatar)}
            />
          )}
        </div>
      )
    },
    { title: '姓名', dataIndex: 'name', width: 100 },
    { title: '职位', dataIndex: 'title', width: 150 },
    { 
      title: '服务类型', 
      dataIndex: 'service_type',
      width: 120,
      render: (v) => <Tag color="blue">{v}</Tag>
    },
    { 
      title: '地区', 
      dataIndex: 'region',
      width: 100,
      render: (v) => <Tag color="green">{v}</Tag>
    },
    { 
      title: '专业领域', 
      dataIndex: 'specialties',
      width: 220,
      render: (v) => {
        let specs = v;
        if (typeof specs === 'string') {
          try { specs = JSON.parse(specs); } catch { specs = []; }
        }
        return (
          <Space size={[4, 4]} wrap>
            {Array.isArray(specs) && specs.slice(0, 3).map((tag, i) => (
              <Tag key={i} color="orange" style={{ margin: 2 }}>{tag}</Tag>
            ))}
            {Array.isArray(specs) && specs.length > 3 && (
              <Tag style={{ margin: 2 }}>+{specs.length - 3}</Tag>
            )}
          </Space>
        );
      }
    },
    { title: '案例数', dataIndex: 'success_cases', width: 90 },
    { 
      title: '评分', 
      dataIndex: 'rating',
      width: 80,
      render: (v) => <span style={{ color: '#faad14', fontWeight: 'bold' }}>{v} ★</span>
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      width: 80,
      render: (v) => v === 1 ? 
        <Tag color="success">上架</Tag> : 
        <Tag color="default">下架</Tag>
    },
    { 
      title: '操作', 
      key: 'action', 
      width: 150, 
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">顾问管理</h1>
        <p className="text-gray-500 mt-1">管理所有顾问信息</p>
      </div>
      
      <Card 
        className="shadow-sm"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => { 
              setEditingId(null); 
              form.resetFields(); 
              setSpecialties([]);
              setModalVisible(true); 
            }}
          >
            新增顾问
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={data} 
          loading={loading} 
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      
      <Modal 
        title={editingId ? '编辑顾问' : '新增顾问'} 
        open={modalVisible} 
        onCancel={() => setModalVisible(false)} 
        onOk={form.submit} 
        width={720}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* 头像上传区域 */}
          <Form.Item 
            name="avatar" 
            label="顾问头像"
            extra="支持 JPG、PNG、GIF 格式，最大 5MB"
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              {/* 当前头像预览 */}
              <div>
                <div style={{ marginBottom: 8, color: '#666', fontSize: 12 }}>当前头像</div>
                <Avatar 
                  size={100} 
                  src={form.getFieldValue('avatar')} 
                  style={{ border: '2px solid #f0f0f0' }}
                >
                  {form.getFieldValue('name')?.charAt(0) || '顾问'}
                </Avatar>
              </div>
              
              {/* 上传按钮 */}
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 8, color: '#666', fontSize: 12 }}>上传新头像</div>
                <Upload
                  customRequest={handleUpload}
                  accept="image/*"
                  showUploadList={false}
                >
                  <Button 
                    icon={<UploadOutlined />} 
                    loading={uploadLoading}
                    style={{ marginBottom: 8 }}
                  >
                    {uploadLoading ? '上传中...' : '选择图片上传'}
                  </Button>
                </Upload>
                <Input 
                  placeholder="或输入图片URL" 
                  style={{ marginTop: 8 }}
                  onChange={(e) => form.setFieldsValue({ avatar: e.target.value })}
                  value={form.getFieldValue('avatar')}
                />
                {form.getFieldValue('avatar') && (
                  <Button 
                    type="link" 
                    size="small" 
                    onClick={() => handlePreview(form.getFieldValue('avatar'))}
                    style={{ padding: 0, marginTop: 4 }}
                  >
                    <EyeOutlined /> 预览大图
                  </Button>
                )}
              </div>
            </div>
          </Form.Item>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
              <Input placeholder="请输入姓名" />
            </Form.Item>
            <Form.Item name="title" label="职位" rules={[{ required: true }]}>
              <Input placeholder="如：资深留学顾问" />
            </Form.Item>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="service_type" label="服务类型" rules={[{ required: true }]}>
              <Select placeholder="请选择服务类型">
                {serviceTypes.map(t => (
                  <Select.Option key={t.value} value={t.value}>{t.label}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="region" label="地区" rules={[{ required: true }]}>
              <Select placeholder="请选择地区">
                {regions.map(r => (
                  <Select.Option key={r.value} value={r.value}>{r.label}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item name="experience" label="从业年限(年)">
              <Input type="number" min={0} placeholder="如：8" />
            </Form.Item>
            <Form.Item name="success_cases" label="成功案例数">
              <Input type="number" min={0} placeholder="如：328" />
            </Form.Item>
            <Form.Item name="rating" label="评分(0-5)">
              <Input type="number" min={0} max={5} step="0.01" placeholder="如：4.95" />
            </Form.Item>
          </div>
          
          <Form.Item name="education" label="教育背景">
            <Input placeholder="如：香港大学教育学硕士" />
          </Form.Item>
          
          <Form.Item label="专业领域">
            <Space size={[8, 8]} wrap style={{ marginBottom: 8 }}>
              {specialties.map((tag, index) => (
                <Tag 
                  key={tag} 
                  closable 
                  onClose={() => handleRemoveSpecialty(tag)}
                  color="blue"
                >
                  {tag}
                </Tag>
              ))}
            </Space>
            <Space>
              <Input
                type="text"
                size="small"
                style={{ width: 150 }}
                placeholder="输入专业领域"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={handleAddSpecialty}
              />
              <Button size="small" onClick={handleAddSpecialty}>添加</Button>
            </Space>
          </Form.Item>
          
          <Form.Item name="bio" label="个人简介">
            <Input.TextArea rows={4} placeholder="请输入个人简介" />
          </Form.Item>
          
          <Form.Item name="status" label="状态" initialValue={1}>
            <Select>
              <Select.Option value={1}>上架</Select.Option>
              <Select.Option value={0}>下架</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 图片预览 Modal */}
      <Modal
        open={previewVisible}
        title="图片预览"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <Image
          alt="预览"
          style={{ width: '100%' }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
}

export default Consultants;
