/**
 * ============================================================================
 * 后台用户管理页面 (v2.1.0)
 * ============================================================================
 * 功能：管理员账户管理
 * 包括：列表展示、新增、编辑、删除、重置密码、启用/禁用
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Input, Select, Tag, Space, 
  Popconfirm, message, Card, Row, Col, Statistic 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  LockOutlined, UserOutlined, CheckCircleOutlined, 
  StopOutlined 
} from '@ant-design/icons';
import axios from 'axios';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000
});

// 请求拦截器
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const { Option } = Select;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增管理员');
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [resetPwdModalVisible, setResetPwdModalVisible] = useState(false);
  const [resetPwdForm] = Form.useForm();
  const [resetPwdId, setResetPwdId] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 获取管理员列表
  const fetchUsers = async (params = {}) => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/users', {
        params: {
          page: params.current || pagination.current,
          limit: params.pageSize || pagination.pageSize,
          ...params
        }
      });
      if (response.data.success) {
        setUsers(response.data.data);
        setPagination({
          ...pagination,
          total: response.data.pagination.total,
          current: response.data.pagination.page
        });
      }
    } catch (error) {
      message.error('获取管理员列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80
    },
    {
      title: '用户名',
      dataIndex: 'username',
      render: (text, record) => (
        <Space>
          <UserOutlined />
          {text}
          {record.role === 'super' && (
            <Tag color="red">超级管理员</Tag>
          )}
        </Space>
      )
    },
    {
      title: '姓名',
      dataIndex: 'name'
    },
    {
      title: '角色',
      dataIndex: 'role',
      render: (role) => (
        <Tag color={role === 'super' ? 'red' : 'blue'}>
          {role === 'super' ? '超级管理员' : '普通管理员'}
        </Tag>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 1 ? 'success' : 'default'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '最后登录',
      dataIndex: 'last_login',
      render: (date) => date ? new Date(date).toLocaleString() : '-'
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      render: (date) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={record.role === 'super'}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            icon={<LockOutlined />}
            onClick={() => handleResetPwd(record)}
          >
            重置密码
          </Button>
          {record.status === 1 ? (
            <Popconfirm
              title="确定禁用该账户吗？"
              onConfirm={() => handleToggleStatus(record.id, 0)}
              disabled={record.role === 'super'}
            >
              <Button 
                type="link" 
                danger
                icon={<StopOutlined />}
                disabled={record.role === 'super'}
              >
                禁用
              </Button>
            </Popconfirm>
          ) : (
            <Button 
              type="link" 
              icon={<CheckCircleOutlined />}
              onClick={() => handleToggleStatus(record.id, 1)}
            >
              启用
            </Button>
          )}
          <Popconfirm
            title="确定删除该账户吗？此操作不可恢复！"
            onConfirm={() => handleDelete(record.id)}
            disabled={record.role === 'super'}
          >
            <Button 
              type="link" 
              danger
              icon={<DeleteOutlined />}
              disabled={record.role === 'super'}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  // 新增
  const handleAdd = () => {
    setModalTitle('新增管理员');
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 编辑
  const handleEdit = (record) => {
    setModalTitle('编辑管理员');
    setEditingId(record.id);
    form.setFieldsValue({
      name: record.name,
      role: record.role,
      status: record.status
    });
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        // 编辑
        await apiClient.put(`/admin/users/${editingId}`, values);
        message.success('更新成功');
      } else {
        // 新增
        await apiClient.post('/admin/users', values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error(error.response?.data?.message || '操作失败');
    }
  };

  // 重置密码
  const handleResetPwd = (record) => {
    setResetPwdId(record.id);
    resetPwdForm.resetFields();
    setResetPwdModalVisible(true);
  };

  const handleResetPwdSubmit = async (values) => {
    try {
      await apiClient.put(`/admin/users/${resetPwdId}/reset-password`, values);
      message.success('密码重置成功');
      setResetPwdModalVisible(false);
    } catch (error) {
      message.error(error.response?.data?.message || '重置失败');
    }
  };

  // 切换状态
  const handleToggleStatus = async (id, status) => {
    try {
      await apiClient.put(`/admin/users/${id}`, { status });
      message.success(status === 1 ? '启用成功' : '禁用成功');
      fetchUsers();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 删除
  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/admin/users/${id}`);
      message.success('删除成功');
      fetchUsers();
    } catch (error) {
      message.error('删除失败');
    }
  };

  return (
    <div className="admin-users-page">
      <Card title="后台用户管理" extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增管理员
        </Button>
      }>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Statistic title="管理员总数" value={pagination.total} />
          </Col>
          <Col span={6}>
            <Statistic 
              title="超级管理员" 
              value={users.filter(u => u.role === 'super').length} 
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="启用账户" 
              value={users.filter(u => u.status === 1).length} 
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="禁用账户" 
              value={users.filter(u => u.status === 0).length} 
            />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`
          }}
          onChange={fetchUsers}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {!editingId && (
            <>
              <Form.Item
                name="username"
                label="用户名"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3个字符' }
                ]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
              <Form.Item
                name="password"
                label="密码"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6个字符' }
                ]}
              >
                <Input.Password placeholder="请输入密码" />
              </Form.Item>
            </>
          )}
          <Form.Item
            name="name"
            label="姓名"
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            initialValue="admin"
          >
            <Select>
              <Option value="admin">普通管理员</Option>
              <Option value="super">超级管理员</Option>
            </Select>
          </Form.Item>
          {editingId && (
            <Form.Item
              name="status"
              label="状态"
              initialValue={1}
            >
              <Select>
                <Option value={1}>启用</Option>
                <Option value={0}>禁用</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* 重置密码弹窗 */}
      <Modal
        title="重置密码"
        open={resetPwdModalVisible}
        onOk={() => resetPwdForm.submit()}
        onCancel={() => setResetPwdModalVisible(false)}
      >
        <Form
          form={resetPwdForm}
          layout="vertical"
          onFinish={handleResetPwdSubmit}
        >
          <Form.Item
            name="password"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
