import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Switch, Card, Upload, Image, Tabs, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, EyeOutlined, StarOutlined, MessageOutlined } from '@ant-design/icons';
import { getAdminCases, createCase, updateCase, deleteCase, uploadCaseCover, deleteCaseCover, setCaseFeatured, getFeaturedCases, getAdminTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../utils/api';

const { TextArea } = Input;
const { Option } = Select;

function Cases() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const [coverUrl, setCoverUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('cases');
  const [featuredCases, setFeaturedCases] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredModalVisible, setFeaturedModalVisible] = useState(false);
  const [featuredForm] = Form.useForm();
  const [featuredEditingCase, setFeaturedEditingCase] = useState(null);
  
  // 学员留言状态
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [testimonialModalVisible, setTestimonialModalVisible] = useState(false);
  const [testimonialForm] = Form.useForm();
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAdminCases({ limit: 100 });
      if (res.success) setData(res.data.list);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const fetchFeatured = async () => {
    setFeaturedLoading(true);
    try {
      const res = await getFeaturedCases(20);
      if (res.success) setFeaturedCases(res.data);
    } catch (error) { message.error('获取明星案例失败'); }
    finally { setFeaturedLoading(false); }
  };

  useEffect(() => { fetchData(); fetchFeatured(); fetchTestimonials(); }, []);
  
  // 获取学员留言
  const fetchTestimonials = async () => {
    setTestimonialsLoading(true);
    try {
      const res = await getAdminTestimonials();
      if (res.success) setTestimonials(res.data);
    } catch (error) {
      message.error('获取学员留言失败');
    } finally {
      setTestimonialsLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const submitData = {
        ...values,
        status: values.status ? 1 : 0
      };
      
      if (editingId) { 
        await updateCase(editingId, submitData); 
        message.success('更新成功'); 
      } else { 
        await createCase(submitData); 
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
    form.setFieldsValue({
      ...record,
      status: record.status === 1
    });
    setCoverUrl(record.cover || '');
    setModalVisible(true); 
  };

  const handleDelete = async (id) => { 
    try { 
      await deleteCase(id); 
      message.success('删除成功'); 
      fetchData(); 
    } catch (error) { 
      message.error('删除失败'); 
    } 
  };

  // 设置明星案例
  const handleSetFeatured = async (record, isFeatured) => {
    try {
      const res = await setCaseFeatured(record.id, {
        is_featured: isFeatured,
        feature_sort: isFeatured ? (record.feature_sort || 0) : 0,
        feature_highlight: record.feature_highlight || '成功案例',
        feature_bg: record.feature_bg || 'from-emerald-500 to-teal-600'
      });
      if (res.success) {
        message.success(isFeatured ? '已设为明星案例' : '已取消明星案例');
        fetchData();
        fetchFeatured();
      } else {
        message.error(res.message || '操作失败');
      }
    } catch (error) {
      message.error('网络错误，请稍后重试');
    }
  };

  // 打开明星案例设置弹窗
  const openFeaturedModal = (record) => {
    setFeaturedEditingCase(record);
    featuredForm.setFieldsValue({
      feature_sort: record.feature_sort || 0,
      feature_highlight: record.feature_highlight || '成功案例',
      feature_bg: record.feature_bg || 'from-emerald-500 to-teal-600'
    });
    setFeaturedModalVisible(true);
  };

  // 保存明星案例设置
  const handleSaveFeatured = async (values) => {
    if (!featuredEditingCase) return;
    try {
      const res = await setCaseFeatured(featuredEditingCase.id, {
        is_featured: 1,
        feature_sort: values.feature_sort,
        feature_highlight: values.feature_highlight,
        feature_bg: values.feature_bg
      });
      if (res.success) {
        message.success('明星案例设置成功');
        setFeaturedModalVisible(false);
        fetchData();
        fetchFeatured();
      }
    } catch (error) {
      message.error('设置失败');
    }
  };
  
  // 学员留言相关操作
  const handleTestimonialSubmit = async (values) => {
    try {
      const submitData = {
        ...values,
        status: values.status ? 1 : 0
      };
      
      if (editingTestimonialId) {
        await updateTestimonial(editingTestimonialId, submitData);
        message.success('更新成功');
      } else {
        await createTestimonial(submitData);
        message.success('创建成功');
      }
      setTestimonialModalVisible(false);
      testimonialForm.resetFields();
      setEditingTestimonialId(null);
      fetchTestimonials();
    } catch (error) {
      message.error('操作失败');
    }
  };
  
  const handleEditTestimonial = (record) => {
    setEditingTestimonialId(record.id);
    testimonialForm.setFieldsValue({
      ...record,
      status: record.status === 1
    });
    setTestimonialModalVisible(true);
  };
  
  const handleDeleteTestimonial = async (id) => {
    try {
      await deleteTestimonial(id);
      message.success('删除成功');
      fetchTestimonials();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 自定义上传函数
  const customUpload = async ({ file, onSuccess, onError }) => {
    try {
      setUploading(true);
      const res = await uploadCaseCover(file);
      if (res.success) {
        setCoverUrl(res.data.url);
        message.success('上传成功');
        onSuccess?.();
      } else {
        message.error(res.message || '上传失败');
        onError?.();
      }
    } catch (error) {
      message.error('上传失败');
      onError?.();
    } finally {
      setUploading(false);
    }
  };

  // 删除封面
  const handleRemoveCover = async () => {
    if (coverUrl) {
      try {
        const filename = coverUrl.split('/').pop();
        await deleteCaseCover(filename);
        setCoverUrl('');
        message.success('已删除');
      } catch (error) {
        message.error('删除失败');
      }
    }
  };

  // 提交时包含封面
  const handleSubmitWithCover = async (values) => {
    await handleSubmit({ ...values, cover: coverUrl });
    setCoverUrl('');
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { 
      title: '首图', 
      dataIndex: 'cover',
      width: 100,
      render: (url) => url ? (
        <Image 
          src={url} 
          alt="首图" 
          className="w-16 h-12 object-cover rounded"
          preview={{ mask: <EyeOutlined /> }}
        />
      ) : (
        <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
          无图片
        </div>
      )
    },
    { 
      title: '标题', 
      dataIndex: 'title',
      render: (text) => <span className="font-medium text-gray-800">{text}</span>
    },
    { title: '学生', dataIndex: 'student_name', width: 100 },
    { title: '目标国家', dataIndex: 'target_country', width: 100 },
    { 
      title: '录取结果', 
      dataIndex: 'admission_result',
      render: (text) => (
        <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
          {text}
        </span>
      )
    },
    { 
      title: '奖学金', 
      dataIndex: 'scholarship',
      render: (text) => text ? (
        <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs">
          {text}
        </span>
      ) : '-'
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      width: 80,
      render: (v) => (
        <span className={`px-2 py-1 rounded text-xs ${v === 1 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
          {v === 1 ? '上架' : '下架'}
        </span>
      )
    },
    {
      title: '明星案例',
      dataIndex: 'is_featured',
      width: 120,
      render: (v, record) => (
        <Space direction="vertical" size="small">
          <Switch 
            checked={v === 1} 
            onChange={(checked) => handleSetFeatured(record, checked)}
            checkedChildren="明星"
            unCheckedChildren="普通"
          />
          {v === 1 && (
            <Button type="link" size="small" onClick={() => openFeaturedModal(record)}>
              排序:{record.feature_sort || 0}
            </Button>
          )}
        </Space>
      )
    },
    { 
      title: '操作', 
      key: 'action', 
      width: 150,
      render: (_, record) => (
        <div className="space-x-2">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确认删除此案例?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </div>
      )
    },
  ];

  // 明星案例列表列
  const featuredColumns = [
    { title: '排序', dataIndex: 'feature_sort', width: 80, sorter: (a, b) => a.feature_sort - b.feature_sort },
    { 
      title: '头像', 
      dataIndex: 'avatar',
      width: 80,
      render: (avatar) => (
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-xl">
          {avatar || '👨‍🎓'}
        </div>
      )
    },
    { title: '学生', dataIndex: 'name', width: 100 },
    { title: '录取院校', dataIndex: 'school' },
    { title: '专业', dataIndex: 'major', width: 150 },
    { title: '亮点标签', dataIndex: 'highlight', width: 150 },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openFeaturedModal({
            id: record.id,
            feature_sort: record.feature_sort,
            feature_highlight: record.highlight,
            feature_bg: record.bg
          })}>设置</Button>
          <Popconfirm title="确认取消明星案例?" onConfirm={() => handleSetFeatured({ id: record.id }, false)}>
            <Button type="link" danger>取消</Button>
          </Popconfirm>
        </Space>
      )
    },
  ];
  
  // 学员留言列表列
  const testimonialColumns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { 
      title: '头像', 
      dataIndex: 'student_name',
      width: 80,
      render: (name) => (
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
          {name ? name[0] : '学'}
        </div>
      )
    },
    { title: '学生姓名', dataIndex: 'student_name', width: 100 },
    { title: '录取学校', dataIndex: 'school', width: 150 },
    { title: '专业', dataIndex: 'major', width: 150 },
    { 
      title: '留言内容', 
      dataIndex: 'content',
      ellipsis: true,
      render: (text) => <span className="text-gray-600">{text}</span>
    },
    { title: '排序', dataIndex: 'sort_order', width: 80 },
    { 
      title: '状态', 
      dataIndex: 'status', 
      width: 80,
      render: (v) => (
        <span className={`px-2 py-1 rounded text-xs ${v === 1 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
          {v === 1 ? '上架' : '下架'}
        </span>
      )
    },
    { 
      title: '操作', 
      key: 'action', 
      width: 150,
      render: (_, record) => (
        <div className="space-x-2">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditTestimonial(record)}>
            编辑
          </Button>
          <Popconfirm title="确认删除此留言?" onConfirm={() => handleDeleteTestimonial(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </div>
      )
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">案例管理</h1>
        <p className="text-gray-500 text-sm mt-1">管理成功案例和明星案例展示</p>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        type="card"
        items={[
          {
            key: 'cases',
            label: '案例列表',
            children: (
              <Card 
                className="shadow-sm"
                extra={
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => { 
                      setEditingId(null); 
                      form.resetFields();
                      setCoverUrl('');
                      setModalVisible(true); 
                    }}
                  >
                    新增案例
                  </Button>
                }
              >
                <Table 
                  columns={columns} 
                  dataSource={data} 
                  loading={loading} 
                  rowKey="id" 
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            )
          },
          {
            key: 'featured',
            label: (
              <span>
                <StarOutlined className="mr-1" />
                明星案例
              </span>
            ),
            children: (
              <Card 
                className="shadow-sm"
                extra={
                  <Button onClick={() => { setActiveTab('cases'); message.info('请在"案例列表"中设置明星案例'); }}>
                    去设置明星案例
                  </Button>
                }
              >
                <p className="text-gray-500 mb-4">显示已设为明星案例的成功案例，最多展示6个在官网首页</p>
                <Table 
                  columns={featuredColumns} 
                  dataSource={featuredCases} 
                  loading={featuredLoading} 
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            )
          },
          {
            key: 'testimonials',
            label: (
              <span>
                <MessageOutlined className="mr-1" />
                学员留言
              </span>
            ),
            children: (
              <Card 
                className="shadow-sm"
                extra={
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => { 
                      setEditingTestimonialId(null); 
                      testimonialForm.resetFields();
                      setTestimonialModalVisible(true); 
                    }}
                  >
                    新增留言
                  </Button>
                }
              >
                <p className="text-gray-500 mb-4">管理成功案例页面的学员留言轮播内容</p>
                <Table 
                  columns={testimonialColumns} 
                  dataSource={testimonials} 
                  loading={testimonialsLoading} 
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            )
          }
        ]}
      />

      {/* 明星案例设置弹窗 */}
      <Modal
        title="设置明星案例"
        open={featuredModalVisible}
        onCancel={() => {
          setFeaturedModalVisible(false);
          setFeaturedEditingCase(null);
        }}
        onOk={featuredForm.submit}
        width={500}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={featuredForm}
          layout="vertical"
          onFinish={handleSaveFeatured}
          className="mt-4"
        >
          <Form.Item 
            name="feature_sort" 
            label="排序值（数字越小越靠前）"
            rules={[{ required: true, message: "请输入排序值" }]}
            initialValue={0}
          >
            <Input type="number" min={0} placeholder="请输入排序值" />
          </Form.Item>
          
          <Form.Item 
            name="feature_highlight" 
            label="亮点标签"
            rules={[{ required: true, message: "请输入亮点标签" }]}
          >
            <Input placeholder="如：双非背景逆袭、全奖录取、工作党转型" />
          </Form.Item>
          
          <Form.Item 
            name="feature_bg" 
            label="背景配色"
            rules={[{ required: true, message: "请选择背景配色" }]}
          >
            <Select placeholder="选择背景渐变配色">
              <Option value="from-blue-500 to-cyan-600">蓝青渐变</Option>
              <Option value="from-violet-500 to-purple-600">紫罗兰渐变</Option>
              <Option value="from-amber-500 to-orange-600">橙黄渐变</Option>
              <Option value="from-emerald-500 to-teal-600">青绿渐变</Option>
              <Option value="from-rose-500 to-pink-600">玫瑰渐变</Option>
              <Option value="from-indigo-500 to-blue-600">靛蓝渐变</Option>
            </Select>
          </Form.Item>
          
          <p className="text-gray-500 text-sm">排序值越小，在明星案例列表中显示越靠前</p>
        </Form>
      </Modal>

      <Modal 
        title={
          <div className="text-lg font-semibold">
            {editingId ? '编辑案例' : '新增案例'}
          </div>
        }
        open={modalVisible} 
        onCancel={() => {
          setModalVisible(false);
          setCoverUrl('');
        }} 
        onOk={form.submit}
        width={700}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitWithCover} className="mt-4">
          {/* 首图上传 */}
          <Form.Item label="案例首图">
            <div className="flex items-center gap-4">
              {coverUrl ? (
                <div className="relative">
                  <Image 
                    src={coverUrl} 
                    alt="首图预览" 
                    className="w-32 h-24 object-cover rounded-lg border"
                    style={{ width: 128, height: 96 }}
                  />
                  <Button 
                    size="small" 
                    danger
                    className="absolute -top-2 -right-2"
                    onClick={handleRemoveCover}
                  >
                    删除
                  </Button>
                </div>
              ) : (
                <Upload
                  customRequest={customUpload}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button 
                    icon={<UploadOutlined />} 
                    loading={uploading}
                    style={{ width: 128, height: 96 }}
                  >
                    上传首图
                  </Button>
                </Upload>
              )}
              <div className="text-xs text-gray-500">
                <p>建议尺寸：800x600 像素</p>
                <p>支持格式：JPG、PNG、GIF</p>
                <p>最大 10MB</p>
              </div>
            </div>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              name="title" 
              label="案例标题" 
              rules={[{ required: true, message: '请输入案例标题' }]}
            >
              <Input placeholder="如：张同学香港大学金融硕士录取" />
            </Form.Item>

            <Form.Item name="student_name" label="学生姓名">
              <Input placeholder="学生姓名（可选）" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="target_country" label="目标国家/地区">
              <Select placeholder="选择目标国家/地区">
                <Option value="香港">香港</Option>
                <Option value="澳门">澳门</Option>
                <Option value="新加坡">新加坡</Option>
                <Option value="英国">英国</Option>
                <Option value="美国">美国</Option>
                <Option value="澳大利亚">澳大利亚</Option>
                <Option value="加拿大">加拿大</Option>
                <Option value="其他">其他</Option>
              </Select>
            </Form.Item>

            <Form.Item name="target_major" label="目标专业">
              <Input placeholder="如：金融学、计算机科学" />
            </Form.Item>
          </div>

          <Form.Item 
            name="admission_result" 
            label="录取结果"
            rules={[{ required: true, message: '请输入录取结果' }]}
          >
            <Input placeholder="如：香港大学 金融学硕士" />
          </Form.Item>

          <Form.Item name="scholarship" label="奖学金">
            <Input placeholder="如：全额奖学金 HKD 180,000/年" />
          </Form.Item>

          <Form.Item 
            name="story" 
            label="申请故事"
            extra="详细描述学生的申请过程、遇到的挑战、解决方案等"
          >
            <TextArea 
              rows={6} 
              placeholder="描述学生的申请背景、准备过程、遇到的挑战以及如何克服困难最终获得录取的故事..."
            />
          </Form.Item>

          <Form.Item 
            name="status" 
            label="状态" 
            valuePropName="checked"
            initialValue={true}
          >
            <Switch 
              checkedChildren="上架" 
              unCheckedChildren="下架"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 学员留言弹窗 */}
      <Modal
        title={editingTestimonialId ? '编辑学员留言' : '新增学员留言'}
        open={testimonialModalVisible}
        onCancel={() => {
          setTestimonialModalVisible(false);
          setEditingTestimonialId(null);
        }}
        onOk={testimonialForm.submit}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={testimonialForm}
          layout="vertical"
          onFinish={handleTestimonialSubmit}
          className="mt-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item 
              name="student_name" 
              label="学生姓名" 
              rules={[{ required: true, message: '请输入学生姓名' }]}
            >
              <Input placeholder="如：张同学" />
            </Form.Item>
            
            <Form.Item 
              name="sort_order" 
              label="排序值"
              initialValue={0}
            >
              <Input type="number" min={0} placeholder="数字越小越靠前" />
            </Form.Item>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="school" label="录取学校">
              <Input placeholder="如：香港大学" />
            </Form.Item>
            
            <Form.Item name="major" label="专业">
              <Input placeholder="如：金融硕士" />
            </Form.Item>
          </div>
          
          <Form.Item 
            name="content" 
            label="留言内容"
            rules={[{ required: true, message: '请输入留言内容' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="请输入学生的留言内容..."
            />
          </Form.Item>
          
          <Form.Item 
            name="status" 
            label="状态" 
            valuePropName="checked"
            initialValue={true}
          >
            <Switch 
              checkedChildren="上架" 
              unCheckedChildren="下架"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Cases;
