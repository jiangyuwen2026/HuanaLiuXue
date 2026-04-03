import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Upload, Image, Tag, Space, Tabs, Switch, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, EyeOutlined, PictureOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/quill-custom.css';
import { getAdminNews, createNews, updateNews, deleteNews, uploadNewsCover, uploadNewsImage, setNewsRecommend, getRecommendedNews } from '../utils/api';
import api from '../utils/api';
import StudyNewsTab from './StudyNewsTab';

// 富文本编辑器配置
const quillModules = {
  toolbar: {
    container: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
    handlers: {
      image: function() {
        // 触发隐藏的文件输入框
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async () => {
          const file = input.files[0];
          if (file) {
            try {
              const res = await uploadNewsImage(file);
              if (res.success) {
                const range = this.quill.getSelection();
                this.quill.insertEmbed(range.index, 'image', res.data.url);
              }
            } catch (error) {
              message.error('图片上传失败');
            }
          }
        };
      }
    }
  },
  clipboard: {
    matchVisual: false
  }
};

const quillFormats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script', 'list', 'bullet', 'indent',
  'align', 'link', 'image', 'video'
];

function News() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const quillRef = useRef(null);
  
  // 头条相关状态
  const [activeTab, setActiveTab] = useState('news');
  const [headlines, setHeadlines] = useState([]);
  const [headlinesLoading, setHeadlinesLoading] = useState(false);
  const [headlineModalVisible, setHeadlineModalVisible] = useState(false);
  const [editingHeadlineId, setEditingHeadlineId] = useState(null);
  const [headlineForm] = Form.useForm();
  const [headlineImageUrl, setHeadlineImageUrl] = useState('');
  
  // 推荐阅读状态
  const [recommendedNews, setRecommendedNews] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [recommendModalVisible, setRecommendModalVisible] = useState(false);
  const [recommendForm] = Form.useForm();
  const [recommendEditingNews, setRecommendEditingNews] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAdminNews({ limit: 100 });
      if (res.success) setData(res.data.list);
    } catch (error) { 
      console.error(error);
      message.error('获取数据失败');
    } finally { 
      setLoading(false); 
    }
  };

  const fetchHeadlines = async () => {
    setHeadlinesLoading(true);
    try {
      const res = await api.get('/headlines/admin');
      if (res.success) setHeadlines(res.data || []);
    } catch (error) {
      message.error('获取头条失败');
    } finally {
      setHeadlinesLoading(false);
    }
  };

  useEffect(() => { fetchData(); fetchHeadlines(); fetchRecommended(); }, []);
  
  // 获取推荐阅读列表
  const fetchRecommended = async () => {
    setRecommendedLoading(true);
    try {
      const res = await getRecommendedNews(20);
      if (res.success) setRecommendedNews(res.data || []);
    } catch (error) {
      message.error('获取推荐阅读失败');
    } finally {
      setRecommendedLoading(false);
    }
  };

  // 头条相关处理函数
  const handleHeadlineSubmit = async (values) => {
    try {
      const submitData = {
        ...values,
        status: values.status ? 1 : 0,
        cover: headlineImageUrl || values.cover
      };
      if (editingHeadlineId) {
        await api.put(`/headlines/admin/${editingHeadlineId}`, submitData);
        message.success('更新成功');
      } else {
        await api.post('/headlines/admin', submitData);
        message.success('创建成功');
      }
      setHeadlineModalVisible(false);
      headlineForm.resetFields();
      setHeadlineImageUrl('');
      setEditingHeadlineId(null);
      fetchHeadlines();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleHeadlineEdit = (record) => {
    setEditingHeadlineId(record.id);
    headlineForm.setFieldsValue({
      ...record,
      status: record.status === 1
    });
    setHeadlineImageUrl(record.cover || '');
    setHeadlineModalVisible(true);
  };

  const handleHeadlineDelete = async (id) => {
    try {
      await api.delete(`/headlines/admin/${id}`);
      message.success('删除成功');
      fetchHeadlines();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleInitHeadlines = async () => {
    try {
      const res = await api.post('/headlines/admin/init');
      message.success(res.message || '初始化成功');
      fetchHeadlines();
    } catch (error) {
      message.error('初始化失败');
    }
  };
  
  // 设置新闻推荐状态
  const handleSetRecommend = async (record, isRecommended) => {
    try {
      const res = await setNewsRecommend(record.id, {
        is_recommended: isRecommended,
        recommend_sort: isRecommended ? (record.recommend_sort || 0) : 0
      });
      if (res.success) {
        message.success(isRecommended ? '已设为推荐' : '已取消推荐');
        fetchData();
        fetchRecommended();
      }
    } catch (error) {
      message.error('操作失败');
    }
  };
  
  // 打开推荐设置弹窗
  const openRecommendModal = (record) => {
    setRecommendEditingNews(record);
    recommendForm.setFieldsValue({
      recommend_sort: record.recommend_sort || 0
    });
    setRecommendModalVisible(true);
  };
  
  // 保存推荐排序
  const handleSaveRecommendSort = async (values) => {
    if (!recommendEditingNews) return;
    try {
      const res = await setNewsRecommend(recommendEditingNews.id, {
        is_recommended: 1,
        recommend_sort: values.recommend_sort
      });
      if (res.success) {
        message.success('排序设置成功');
        setRecommendModalVisible(false);
        fetchData();
        fetchRecommended();
      }
    } catch (error) {
      message.error('设置失败');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const submitData = { 
        ...values, 
        content,
        cover: coverUrl
      };
      
      if (editingId) { 
        await updateNews(editingId, submitData); 
        message.success('更新成功'); 
      } else { 
        await createNews(submitData); 
        message.success('创建成功'); 
      }
      setModalVisible(false); 
      form.resetFields(); 
      setContent('');
      setCoverUrl('');
      fetchData();
    } catch (error) { 
      message.error('操作失败'); 
    }
  };

  const handleEdit = (record) => { 
    setEditingId(record.id); 
    form.setFieldsValue({
      title: record.title,
      category: record.category,
      summary: record.summary,
      author: record.author,
      source: record.source,
      status: record.status,
      tags: record.tags
    });
    setContent(record.content || '');
    setCoverUrl(record.cover || '');
    setModalVisible(true); 
  };

  const handleDelete = async (id) => { 
    try { 
      await deleteNews(id); 
      message.success('删除成功'); 
      fetchData(); 
    } catch (error) { 
      message.error('删除失败'); 
    } 
  };

  const handleCoverUpload = async ({ file, onSuccess, onError }) => {
    setUploadLoading(true);
    try {
      const res = await uploadNewsCover(file);
      if (res.success) {
        setCoverUrl(res.data.url);
        message.success('封面上传成功');
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

  const handlePreview = (url) => {
    setPreviewImage(url);
    setPreviewVisible(true);
  };

  const handleContentImageUpload = async (file) => {
    try {
      const res = await uploadNewsImage(file);
      if (res.success) {
        return res.data.url;
      }
    } catch (error) {
      message.error('图片上传失败');
    }
    return null;
  };

  const columns = [
    { 
      title: '封面', 
      dataIndex: 'cover',
      width: 100,
      render: (cover) => cover ? (
        <Image 
          src={cover} 
          alt="封面" 
          width={80} 
          height={60} 
          style={{ objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
          preview={false}
          onClick={() => handlePreview(cover)}
        />
      ) : (
        <div style={{ width: 80, height: 60, background: '#f0f0f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
          无封面
        </div>
      )
    },
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '标题', dataIndex: 'title', ellipsis: true },
    { title: '分类', dataIndex: 'category', width: 100 },
    { title: '作者', dataIndex: 'author', width: 100 },
    { title: '浏览量', dataIndex: 'view_count', width: 80 },
    { 
      title: '状态', 
      dataIndex: 'status', 
      width: 80,
      render: (v) => v === 1 ? 
        <Tag color="success">上架</Tag> : 
        <Tag color="default">下架</Tag>
    },
    {
      title: '推荐',
      dataIndex: 'is_recommended',
      width: 100,
      render: (v, record) => (
        <Space direction="vertical" size="small">
          <Switch 
            checked={v === 1} 
            onChange={(checked) => handleSetRecommend(record, checked)}
            checkedChildren="推荐"
            unCheckedChildren="普通"
          />
          {v === 1 && (
            <Button type="link" size="small" onClick={() => openRecommendModal(record)}>
              排序:{record.recommend_sort || 0}
            </Button>
          )}
        </Space>
      )
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
  
  // 推荐阅读列表列
  const recommendColumns = [
    { title: '排序', dataIndex: 'recommend_sort', width: 80, sorter: (a, b) => a.recommend_sort - b.recommend_sort },
    { 
      title: '封面', 
      dataIndex: 'cover',
      width: 100,
      render: (cover) => cover ? (
        <Image src={cover} alt="封面" width={80} height={60} style={{ objectFit: 'cover', borderRadius: 8 }} />
      ) : <span className="text-gray-400">无封面</span>
    },
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '标题', dataIndex: 'title', ellipsis: true },
    { title: '分类', dataIndex: 'category', width: 100 },
    { title: '浏览量', dataIndex: 'view_count', width: 80 },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openRecommendModal(record)}>设置排序</Button>
          <Popconfirm title="确认取消推荐?" onConfirm={() => handleSetRecommend(record, false)}>
            <Button type="link" danger>取消推荐</Button>
          </Popconfirm>
        </Space>
      )
    },
  ];

  const headlineColumns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { 
      title: '封面', 
      dataIndex: 'cover',
      width: 120,
      render: (cover) => cover ? (
        <Image src={cover} alt="封面" width={100} height={60} style={{ objectFit: 'cover', borderRadius: 4 }} />
      ) : <span className="text-gray-400">无封面</span>
    },
    { title: '标题', dataIndex: 'title', ellipsis: true },
    { title: '排序', dataIndex: 'sort', width: 80 },
    { 
      title: '状态', 
      dataIndex: 'status', 
      width: 80,
      render: (v) => v === 1 ? <Tag color="success">上架</Tag> : <Tag color="default">下架</Tag>
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleHeadlineEdit(record)}>编辑</Button>
          <Popconfirm title="确认删除?" onConfirm={() => handleHeadlineDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">新闻管理</h1>
        <p className="text-gray-500 mt-1">管理新闻资讯和首页头条</p>
      </div>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        type="card"
        items={[
          {
            key: 'news',
            label: '新闻列表',
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
                      setContent('');
                      setCoverUrl('');
                      setModalVisible(true); 
                    }}
                  >
                    新增新闻
                  </Button>
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
            )
          },
          {
            key: 'headlines',
            label: '头条管理',
            children: (
              <Card 
                className="shadow-sm"
                extra={
                  <Space>
                    <Button onClick={handleInitHeadlines}>初始化默认数据</Button>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={() => { 
                        setEditingHeadlineId(null); 
                        headlineForm.resetFields(); 
                        setHeadlineImageUrl('');
                        setHeadlineModalVisible(true); 
                      }}
                    >
                      新增头条
                    </Button>
                  </Space>
                }
              >
                <Table 
                  columns={headlineColumns} 
                  dataSource={headlines} 
                  loading={headlinesLoading} 
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            )
          },
          {
            key: 'recommended',
            label: '推荐阅读',
            children: (
              <Card 
                className="shadow-sm"
                extra={
                  <Button onClick={() => { setActiveTab('news'); message.info('请在"新闻列表"Tab中设置推荐'); }}>
                    去设置推荐
                  </Button>
                }
              >
                <p className="text-gray-500 mb-4">显示已设为推荐的新闻，最多显示6条在官网首页</p>
                <Table 
                  columns={recommendColumns} 
                  dataSource={recommendedNews} 
                  loading={recommendedLoading} 
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            )
          },
          {
            key: 'study-news',
            label: '留学快讯',
            children: <StudyNewsTab />
          }
        ]}
      />
      
      <Modal 
        title={editingId ? "编辑新闻" : "新增新闻"} 
        open={modalVisible} 
        onCancel={() => setModalVisible(false)} 
        onOk={form.submit} 
        width={960}
        destroyOnClose
        styles={{ body: { maxHeight: '70vh', overflow: 'auto' } }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* 封面上传 */}
          <Form.Item label="封面图">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              {/* 当前封面预览 */}
              <div>
                <div style={{ marginBottom: 8, color: '#666', fontSize: 12 }}>当前封面</div>
                {coverUrl ? (
                  <div style={{ position: 'relative', width: 200, height: 150, borderRadius: 8, overflow: 'hidden', border: '1px solid #e8e8e8' }}>
                    <img src={coverUrl} alt="封面" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div 
                      style={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8, 
                        background: 'rgba(0,0,0,0.6)', 
                        borderRadius: 4,
                        padding: '4px 8px',
                        cursor: 'pointer'
                      }}
                      onClick={() => handlePreview(coverUrl)}
                    >
                      <EyeOutlined style={{ color: 'white', fontSize: 14 }} />
                    </div>
                  </div>
                ) : (
                  <div style={{ width: 200, height: 150, background: '#f5f5f5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', border: '1px dashed #d9d9d9' }}>
                    <PictureOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                    <div>暂无封面</div>
                  </div>
                )}
              </div>
              
              {/* 上传按钮 */}
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 8, color: '#666', fontSize: 12 }}>上传新封面</div>
                <Upload
                  customRequest={handleCoverUpload}
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
                <div style={{ color: '#999', fontSize: 12 }}>
                  支持 JPG、PNG、GIF 格式，建议尺寸 1200x800，最大 10MB
                </div>
                <Input 
                  placeholder="或输入图片URL" 
                  style={{ marginTop: 8 }}
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                />
              </div>
            </div>
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
              <Input placeholder="请输入新闻标题" />
            </Form.Item>
            <Form.Item name="category" label="分类">
              <Select placeholder="请选择分类" allowClear>
                <Select.Option value="留学攻略">留学攻略</Select.Option>
                <Select.Option value="院校动态">院校动态</Select.Option>
                <Select.Option value="签证指南">签证指南</Select.Option>
                <Select.Option value="语言考试">语言考试</Select.Option>
                <Select.Option value="奖学金">奖学金</Select.Option>
                <Select.Option value="移民政策">移民政策</Select.Option>
                <Select.Option value="留学生活">留学生活</Select.Option>
              </Select>
            </Form.Item>
          </div>
          
          <Form.Item name="summary" label="摘要">
            <Input.TextArea rows={2} placeholder="请输入新闻摘要，简要概括文章内容" />
          </Form.Item>

          {/* 富文本编辑器 */}
          <Form.Item label="正文内容" required>
            <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, overflow: 'hidden' }}>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={setContent}
                modules={quillModules}
                formats={quillFormats}
                style={{ height: 400, background: '#fff' }}
                placeholder="请输入新闻正文内容，支持富文本格式..."
              />
            </div>
            <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
              提示：点击工具栏的图片按钮可上传图片到正文中
            </div>
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="author" label="作者">
              <Input placeholder="请输入作者名称" />
            </Form.Item>
            <Form.Item name="source" label="来源">
              <Input placeholder="如：原创、转载等" />
            </Form.Item>
          </div>
          
          <Form.Item name="tags" label="标签">
            <Select 
              mode="tags" 
              placeholder="输入标签后按回车添加"
              style={{ width: '100%' }}
            />
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
        width={800}
      >
        <Image
          alt="预览"
          style={{ width: '100%' }}
          src={previewImage}
          preview={false}
        />
      </Modal>

      {/* 推荐排序设置弹窗 */}
      <Modal
        title="设置推荐排序"
        open={recommendModalVisible}
        onCancel={() => {
          setRecommendModalVisible(false);
          setRecommendEditingNews(null);
        }}
        onOk={recommendForm.submit}
        width={400}
        destroyOnClose
      >
        <Form
          form={recommendForm}
          layout="vertical"
          onFinish={handleSaveRecommendSort}
          className="mt-4"
        >
          <Form.Item 
            name="recommend_sort" 
            label="排序值（数字越小越靠前）"
            rules={[{ required: true, message: "请输入排序值" }]}
            initialValue={0}
          >
            <Input type="number" min={0} placeholder="请输入排序值" />
          </Form.Item>
          <p className="text-gray-500 text-sm">排序值越小，在推荐阅读列表中显示越靠前</p>
        </Form>
      </Modal>

      {/* Headline Modal */}
      <Modal
        title={editingHeadlineId ? "编辑头条" : "新增头条"}
        open={headlineModalVisible}
        onCancel={() => {
          setHeadlineModalVisible(false);
          headlineForm.resetFields();
          setHeadlineImageUrl("");
          setEditingHeadlineId(null);
        }}
        onOk={headlineForm.submit}
        width={700}
        destroyOnClose
      >
        <Form
          form={headlineForm}
          layout="vertical"
          onFinish={handleHeadlineSubmit}
          className="mt-4"
        >
          <Form.Item name="title" label="标题" rules={[{ required: true, message: "请输入标题" }]}>
            <Input placeholder="头条标题" />
          </Form.Item>
          <Form.Item name="summary" label="摘要">
            <Input.TextArea rows={3} placeholder="简短描述，显示在首页" />
          </Form.Item>
          <Form.Item name="cover" label="封面图URL">
            <Input placeholder="封面图片地址" value={headlineImageUrl} onChange={(e) => setHeadlineImageUrl(e.target.value)} />
          </Form.Item>
          <Form.Item label="封面预览">
            {headlineImageUrl ? (
              <Image src={headlineImageUrl} alt="封面预览" width={200} className="rounded-lg" />
            ) : (
              <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">暂无图片</div>
            )}
          </Form.Item>
          <Form.Item name="link_type" label="链接类型" initialValue="news">
            <Select options={[{ value: "news", label: "站内新闻" }, { value: "url", label: "外部链接" }]} />
          </Form.Item>
          <Form.Item name="link_id" label="关联新闻ID">
            <Input type="number" placeholder="关联的新闻文章ID（可选）" />
          </Form.Item>
          <Form.Item name="sort" label="排序" rules={[{ required: true }]} initialValue={0}>
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item name="status" label="状态" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="上架" unCheckedChildren="下架" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default News;
