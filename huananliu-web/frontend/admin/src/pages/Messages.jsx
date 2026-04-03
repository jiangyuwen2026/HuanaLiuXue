import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Tag, Card } from 'antd';
import { CheckOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { getAdminMessages, updateMessage, deleteMessage } from '../utils/api';

function Messages() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAdminMessages({ limit: 100 });
      if (res.success) setData(res.data.list);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateMessage(id, { status });
      message.success('更新成功');
      fetchData();
    } catch (error) { message.error('更新失败'); }
  };

  const handleRemark = (record) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      await updateMessage(editingId, { ...values, status: 1 });
      message.success('更新成功');
      setModalVisible(false);
      fetchData();
    } catch (error) { message.error('更新失败'); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMessage(id);
      message.success('删除成功');
      fetchData();
    } catch (error) { message.error('删除失败'); }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 50 },
    { title: '姓名', dataIndex: 'name' },
    { title: '电话', dataIndex: 'phone' },
    { title: '邮箱', dataIndex: 'email' },
    { title: '意向国家', dataIndex: 'country' },
    { title: '留言内容', dataIndex: 'message', ellipsis: true },
    { title: '状态', dataIndex: 'status', render: (v) => v === 1 ? <Tag color="green">已处理</Tag> : <Tag color="orange">待处理</Tag> },
    { title: '时间', dataIndex: 'created_at', render: (v) => new Date(v).toLocaleString() },
    { title: '操作', key: 'action', width: 200, render: (_, record) => (
      <>
        {record.status === 0 && <Button type="link" icon={<CheckOutlined />} onClick={() => handleStatus(record.id, 1)}>处理</Button>}
        <Button type="link" onClick={() => handleRemark(record)}>备注</Button>
        <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>
      </>
    )},
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">留言管理</h1>
        <p className="text-gray-500 mt-1">管理所有用户留言</p>
      </div>
      
      <Card 
        className="shadow-sm"
        extra={
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchData}
          >
            刷新
          </Button>
        }
      >
        <Table columns={columns} dataSource={data} loading={loading} rowKey="id" />
      </Card>
      <Modal title="添加备注" open={modalVisible} onCancel={() => setModalVisible(false)} onOk={form.submit}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="remark" label="备注"><Input.TextArea rows={4} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Messages;
