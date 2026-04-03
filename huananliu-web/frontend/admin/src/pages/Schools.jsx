import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Tabs, Card as AntCard, InputNumber, Upload, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { getAdminSchools, createSchool, updateSchool, deleteSchool, uploadSchoolImage, deleteSchoolImage } from '../utils/api';

function Schools() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState({ banner: false, logo: false });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAdminSchools({ limit: 100 });
      if (res.success) setData(res.data.list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (values) => {
    // 处理院系列表和专业分类的数据格式
    const processedValues = { ...values };
    
    // 处理faculties - 将逗号分隔的字符串转换为数组
    if (processedValues.faculties && Array.isArray(processedValues.faculties)) {
      processedValues.faculties = processedValues.faculties.map(f => ({
        ...f,
        majors: f.majors ? f.majors.split(',').map(m => m.trim()).filter(m => m) : []
      }));
    }
    
    // 处理master_categories
    if (processedValues.master_categories && Array.isArray(processedValues.master_categories)) {
      processedValues.master_categories = processedValues.master_categories.map(c => ({
        ...c,
        majors: c.majors ? c.majors.split(',').map(m => m.trim()).filter(m => m) : []
      }));
    }
    
    // 解析JSON字段
    if (processedValues.features && typeof processedValues.features === 'string') {
      try {
        processedValues.features = JSON.parse(processedValues.features);
      } catch (e) {
        processedValues.features = [];
      }
    }
    if (processedValues.requirements && typeof processedValues.requirements === 'string') {
      try {
        processedValues.requirements = JSON.parse(processedValues.requirements);
      } catch (e) {
        processedValues.requirements = {};
      }
    }
    
    try {
      if (editingId) {
        await updateSchool(editingId, processedValues);
        message.success('更新成功');
      } else {
        await createSchool(processedValues);
        message.success('创建成功');
      }
      setModalVisible(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    
    // 处理faculties - 将数组转换为逗号分隔的字符串
    const formData = { ...record };
    if (formData.faculties && Array.isArray(formData.faculties)) {
      formData.faculties = formData.faculties.map(f => ({
        ...f,
        majors: Array.isArray(f.majors) ? f.majors.join(', ') : (f.majors || '')
      }));
    }
    if (formData.master_categories && Array.isArray(formData.master_categories)) {
      formData.master_categories = formData.master_categories.map(c => ({
        ...c,
        majors: Array.isArray(c.majors) ? c.majors.join(', ') : (c.majors || '')
      }));
    }
    
    form.setFieldsValue(formData);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSchool(id);
      message.success('删除成功');
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 处理图片上传
  const handleImageUpload = async (file, type) => {
    setUploading({ ...uploading, [type]: true });
    try {
      const res = await uploadSchoolImage(file);
      if (res.success) {
        const currentValues = form.getFieldsValue();
        form.setFieldsValue({ ...currentValues, [type]: res.data.url });
        message.success('上传成功');
      }
    } catch (error) {
      message.error('上传失败');
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
    return false; // 阻止默认上传行为
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '中文名', dataIndex: 'name_cn' },
    { title: '英文名', dataIndex: 'name_en' },
    { title: '国家', dataIndex: 'country' },
    { title: '城市', dataIndex: 'city' },
    { title: '排名', dataIndex: 'rank', width: 80 },
    { title: '首图', dataIndex: 'banner', width: 100, render: (v) => v ? <img src={v} alt="banner" style={{width: 80, height: 50, objectFit: 'cover', borderRadius: 4}} /> : '-'},
    { title: 'Logo', dataIndex: 'logo', width: 80, render: (v) => v ? <img src={v} alt="logo" style={{width: 50, height: 50, objectFit: 'contain', borderRadius: 4}} /> : '-'},
    { title: '状态', dataIndex: 'status', width: 80, render: (v) => v === 1 ? '上架' : '下架' },
    { title: '操作', key: 'action', width: 150, render: (_, record) => (
      <>
        <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
        <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>
      </>
    )},
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">学校管理</h1>
        <p className="text-gray-500 mt-1">管理所有学校信息</p>
      </div>
      
      <AntCard 
        className="shadow-sm"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => { setEditingId(null); form.resetFields(); setModalVisible(true); }}
          >
            新增学校
          </Button>
        }
      >
        <Table columns={columns} dataSource={data} loading={loading} rowKey="id" />
      </AntCard>
      <Modal 
        title={editingId ? '编辑学校' : '新增学校'} 
        open={modalVisible} 
        onCancel={() => setModalVisible(false)} 
        onOk={form.submit}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Tabs items={[
            {
              key: 'basic',
              label: '基本信息',
              children: (
                <>
                  <Form.Item name="name_cn" label="中文名" rules={[{ required: true }]}><Input /></Form.Item>
                  <Form.Item name="name_en" label="英文名"><Input /></Form.Item>
                  <Form.Item name="country" label="国家">
                    <Select>
                      <Select.Option value="香港">香港</Select.Option>
                      <Select.Option value="澳门">澳门</Select.Option>
                      <Select.Option value="英国">英国</Select.Option>
                      <Select.Option value="美国">美国</Select.Option>
                      <Select.Option value="澳大利亚">澳大利亚</Select.Option>
                      <Select.Option value="加拿大">加拿大</Select.Option>
                      <Select.Option value="新加坡">新加坡</Select.Option>
                      <Select.Option value="其他">其他</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="city" label="城市"><Input /></Form.Item>
                  <Form.Item name="rank" label="排名"><InputNumber min={1} style={{width: '100%'}} /></Form.Item>
                  <Form.Item name="banner" label="学校首图">
                    <Space direction="vertical" style={{width: '100%'}}>
                      <Input placeholder="输入图片URL或使用下方上传" />
                      <Upload
                        beforeUpload={(file) => handleImageUpload(file, 'banner')}
                        showUploadList={false}
                        accept="image/*"
                      >
                        <Button icon={<UploadOutlined />} loading={uploading.banner}>上传首图</Button>
                      </Upload>
                      {form.getFieldValue('banner') && (
                        <img 
                          src={form.getFieldValue('banner')} 
                          alt="banner preview" 
                          style={{width: 200, height: 120, objectFit: 'cover', borderRadius: 4, marginTop: 8}} 
                        />
                      )}
                    </Space>
                  </Form.Item>
                  <Form.Item name="logo" label="学校Logo">
                    <Space direction="vertical" style={{width: '100%'}}>
                      <Input placeholder="输入Logo URL或使用下方上传" />
                      <Upload
                        beforeUpload={(file) => handleImageUpload(file, 'logo')}
                        showUploadList={false}
                        accept="image/*"
                      >
                        <Button icon={<UploadOutlined />} loading={uploading.logo}>上传Logo</Button>
                      </Upload>
                      {form.getFieldValue('logo') && (
                        <img 
                          src={form.getFieldValue('logo')} 
                          alt="logo preview" 
                          style={{width: 100, height: 100, objectFit: 'contain', borderRadius: 4, marginTop: 8, border: '1px solid #eee'}} 
                        />
                      )}
                    </Space>
                  </Form.Item>
                  <Form.Item name="description" label="简介"><Input.TextArea rows={4} /></Form.Item>
                  <Form.Item name="tuition" label="学费"><Input /></Form.Item>
                  <Form.Item name="website" label="官网"><Input /></Form.Item>
                  <Form.Item name="features" label="特色亮点（JSON数组）">
                    <Input.TextArea rows={3} placeholder='["特色1", "特色2"]' />
                  </Form.Item>
                  <Form.Item name="requirements" label="申请要求（JSON对象）">
                    <Input.TextArea rows={3} placeholder='{"本科": "要求...", "硕士": "要求..."}' />
                  </Form.Item>
                  <Form.Item name="status" label="状态" initialValue={1}>
                    <Select><Select.Option value={1}>上架</Select.Option><Select.Option value={0}>下架</Select.Option></Select>
                  </Form.Item>
                </>
              )
            },
            {
              key: 'faculties',
              label: '院系设置',
              children: (
                <Form.List name="faculties">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Card size="small" style={{ marginBottom: 16 }} key={key}>
                          <Form.Item {...restField} name={[name, 'name']} label="院系名称" style={{ marginBottom: 8 }}>
                            <Input placeholder="如：商学院" />
                          </Form.Item>
                          <Form.Item {...restField} name={[name, 'majors']} label="专业列表" style={{ marginBottom: 8 }}>
                            <Input.TextArea rows={2} placeholder="专业1,专业2,专业3（用逗号分隔）" />
                          </Form.Item>
                          <Button type="link" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)}>删除院系</Button>
                        </Card>
                      ))}
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>添加院系</Button>
                    </>
                  )}
                </Form.List>
              )
            },
            {
              key: 'majors',
              label: '硕士专业',
              children: (
                <Form.List name="master_categories">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Card size="small" style={{ marginBottom: 16 }} key={key}>
                          <Form.Item {...restField} name={[name, 'name']} label="专业类别" style={{ marginBottom: 8 }}>
                            <Input placeholder="如：商科类" />
                          </Form.Item>
                          <Form.Item {...restField} name={[name, 'majors']} label="专业列表" style={{ marginBottom: 8 }}>
                            <Input.TextArea rows={2} placeholder="专业1,专业2,专业3（用逗号分隔）" />
                          </Form.Item>
                          <Button type="link" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)}>删除类别</Button>
                        </Card>
                      ))}
                      <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>添加专业类别</Button>
                    </>
                  )}
                </Form.List>
              )
            }
          ]} />
        </Form>
      </Modal>
    </div>
  );
}

export default Schools;
