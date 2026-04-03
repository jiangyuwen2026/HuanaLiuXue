import { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Upload, Image, Switch, Card, Row, Col, Tooltip, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, EyeOutlined, DragOutlined, LinkOutlined } from '@ant-design/icons';
import { getAdminBanners, createBanner, updateBanner, deleteBanner, uploadBannerImage } from '../utils/api';
import { DndContext } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';

// 可排序的行组件
function SortableRow({ children, id, ...props }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    background: isDragging ? '#f0f0f0' : 'transparent',
  };

  return (
    <tr ref={setNodeRef} style={style} {...props} {...attributes}>
      {children}
    </tr>
  );
}

function Banners() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const sensors = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAdminBanners();
      if (res.success) {
        // 后端返回的数据结构是 { list: [], total, page, limit }
        const list = res.data?.list || res.data || [];
        // 按sort排序
        const sortedData = list.sort((a, b) => (a.sort || 0) - (b.sort || 0));
        setData(sortedData);
      } else {
        message.error(res.message || '获取数据失败');
      }
    } catch (error) {
      console.error('获取轮播图失败:', error);
      message.error('获取数据失败: ' + (error.message || '网络错误'));
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
        image: imageUrl || values.image
      };
      
      if (editingId) {
        await updateBanner(editingId, submitData);
        message.success('更新成功');
      } else {
        await createBanner(submitData);
        message.success('创建成功');
      }
      setModalVisible(false);
      form.resetFields();
      setImageUrl('');
      fetchData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setImageUrl(record.image || '');
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBanner(id);
      message.success('删除成功');
      fetchData();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleUpload = async ({ file, onSuccess, onError }) => {
    setUploadLoading(true);
    try {
      const res = await uploadBannerImage(file);
      if (res.success) {
        setImageUrl(res.data.url);
        message.success('上传成功');
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

  const handleStatusChange = async (id, checked) => {
    try {
      await updateBanner(id, { status: checked ? 1 : 0 });
      message.success('状态更新成功');
      fetchData();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  // 拖拽排序
  const onDragEnd = async ({ active, over }) => {
    if (active.id !== over?.id) {
      const oldIndex = data.findIndex(item => item.id === active.id);
      const newIndex = data.findIndex(item => item.id === over.id);
      
      const newData = [...data];
      const [movedItem] = newData.splice(oldIndex, 1);
      newData.splice(newIndex, 0, movedItem);
      
      // 更新排序值
      const updatedData = newData.map((item, index) => ({
        ...item,
        sort: index
      }));
      
      setData(updatedData);
      
      // 批量更新排序
      try {
        for (let i = 0; i < updatedData.length; i++) {
          await updateBanner(updatedData[i].id, { sort: updatedData[i].sort });
        }
        message.success('排序更新成功');
      } catch (error) {
        message.error('排序更新失败');
        fetchData();
      }
    }
  };

  const getLinkTypeLabel = (type) => {
    const labels = {
      school: '学校',
      consultant: '顾问',
      case: '案例',
      news: '新闻',
      url: '外部链接'
    };
    return labels[type] || type;
  };

  const getLinkTypeColor = (type) => {
    const colors = {
      school: 'blue',
      consultant: 'green',
      case: 'orange',
      news: 'purple',
      url: 'default'
    };
    return colors[type] || 'default';
  };

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      width: 80,
      render: (_, record, index) => (
        <div className="flex items-center">
          <DragOutlined className="mr-2 text-gray-400 cursor-move" />
          <span className="font-mono text-gray-500">{index + 1}</span>
        </div>
      )
    },
    {
      title: '预览',
      dataIndex: 'image',
      width: 180,
      render: (url, record) => (
        <div className="relative group">
          {url ? (
            <Image
              src={url}
              alt={record.title}
              width={160}
              height={90}
              className="object-cover rounded-lg"
              style={{ borderRadius: 8 }}
              preview={false}
            />
          ) : (
            <div className="w-40 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              无图片
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(url)}
              className="text-white"
            >
              查看
            </Button>
          </div>
        </div>
      )
    },
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
      render: (text) => <span className="font-medium">{text}</span>
    },
    {
      title: '链接类型',
      dataIndex: 'link_type',
      width: 120,
      render: (type) => (
        <Tag color={getLinkTypeColor(type)}>
          {getLinkTypeLabel(type)}
        </Tag>
      )
    },
    {
      title: '链接信息',
      width: 200,
      render: (_, record) => {
        if (record.link_type === 'url') {
          return (
            <Tooltip title={record.link_url}>
              <a href={record.link_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline truncate max-w-[180px]">
                <LinkOutlined className="mr-1" />
                {record.link_url}
              </a>
            </Tooltip>
          );
        }
        return record.link_id ? (
          <span className="text-gray-600">ID: {record.link_id}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      }
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
            description="删除后将无法恢复"
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
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
        <h1 className="text-2xl font-bold text-gray-900">轮播图管理</h1>
        <p className="text-gray-500 mt-1">管理首页轮播 Banner，支持拖拽排序</p>
      </div>

      {/* Banner List with Drag & Drop */}
      <Card 
        className="shadow-sm"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              setImageUrl('');
              setModalVisible(true);
            }}
          >
            新增轮播图
          </Button>
        }
      >
        <DndContext
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={data.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              components={{
                body: {
                  row: SortableRow,
                },
              }}
              columns={columns}
              dataSource={data}
              loading={loading}
              rowKey="id"
              scroll={{ x: 1000 }}
              pagination={false}
            />
          </SortableContext>
        </DndContext>
      </Card>

      {/* Stats */}
      <Row gutter={16} className="mt-6">
        <Col span={6}>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{data.length}</div>
              <div className="text-gray-500">总轮播图</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {data.filter(item => item.status === 1).length}
              </div>
              <div className="text-gray-500">已上架</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {data.filter(item => item.status === 0).length}
              </div>
              <div className="text-gray-500">已下架</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal
        title={editingId ? '编辑轮播图' : '新增轮播图'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setImageUrl('');
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
            <Col span={16}>
              <Form.Item
                name="title"
                label="标题"
                rules={[{ required: true, message: '请输入标题' }]}
              >
                <Input placeholder="请输入轮播图标题" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="sort"
                label="排序"
                initialValue={0}
              >
                <Input type="number" placeholder="数字越小越靠前" />
              </Form.Item>
            </Col>
          </Row>

          {/* Image Upload */}
          <Form.Item
            label="轮播图片"
            required
          >
            <div className="flex gap-4">
              {/* Preview */}
              <div className="flex-shrink-0">
                <div className="text-sm text-gray-500 mb-2">预览</div>
                {imageUrl ? (
                  <div className="relative w-64 h-36 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={imageUrl}
                      alt="预览"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="text"
                      danger
                      size="small"
                      className="absolute top-2 right-2 bg-white/80"
                      onClick={() => setImageUrl('')}
                    >
                      删除
                    </Button>
                  </div>
                ) : (
                  <div className="w-64 h-36 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
                    暂无图片
                  </div>
                )}
              </div>

              {/* Upload */}
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-2">上传图片</div>
                <Upload
                  customRequest={handleUpload}
                  accept="image/*"
                  showUploadList={false}
                  disabled={uploadLoading}
                >
                  <Button
                    icon={<UploadOutlined />}
                    loading={uploadLoading}
                    className="w-full"
                  >
                    {uploadLoading ? '上传中...' : '选择图片'}
                  </Button>
                </Upload>
                <Input
                  placeholder="或输入图片URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="mt-2"
                />
                <p className="text-xs text-gray-400 mt-2">
                  建议尺寸：1920 x 600 像素，支持 JPG、PNG 格式
                </p>
              </div>
            </div>
          </Form.Item>

          <Form.Item
            name="link_type"
            label="链接类型"
          >
            <Select placeholder="请选择链接类型">
              <Select.Option value="school">🏫 学校详情页</Select.Option>
              <Select.Option value="consultant">👤 顾问详情页</Select.Option>
              <Select.Option value="case">📄 案例详情页</Select.Option>
              <Select.Option value="news">📰 新闻详情页</Select.Option>
              <Select.Option value="url">🔗 外部链接</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.link_type !== currentValues.link_type
            }
          >
            {({ getFieldValue }) => {
              const linkType = getFieldValue('link_type');
              if (linkType === 'url') {
                return (
                  <Form.Item
                    name="link_url"
                    label="外部链接 URL"
                    rules={[{ type: 'url', message: '请输入有效的URL' }]}
                  >
                    <Input placeholder="https://example.com" />
                  </Form.Item>
                );
              }
              if (linkType && linkType !== 'url') {
                return (
                  <Form.Item
                    name="link_id"
                    label={`${getLinkTypeLabel(linkType)}ID`}
                  >
                    <Input type="number" placeholder={`请输入${getLinkTypeLabel(linkType)}ID`} />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            initialValue={1}
          >
            <Select>
              <Select.Option value={1}>🟢 上架</Select.Option>
              <Select.Option value={0}>⚪ 下架</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        open={previewVisible}
        title="图片预览"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={900}
      >
        <Image
          alt="预览"
          style={{ width: '100%' }}
          src={previewImage}
          preview={false}
        />
      </Modal>
    </div>
  );
}

export default Banners;
