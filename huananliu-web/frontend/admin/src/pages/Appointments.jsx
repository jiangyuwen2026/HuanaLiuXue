import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Tag, DatePicker, Card, Row, Col, Statistic } from 'antd';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import api from '../utils/api';
import moment from 'moment';

const { RangePicker } = DatePicker;

function Appointments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    today: 0
  });
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    status: undefined,
    dateRange: null
  });

  const statusMap = {
    0: { text: '待确认', color: 'orange' },
    1: { text: '已确认', color: 'blue' },
    2: { text: '已完成', color: 'green' },
    3: { text: '已取消', color: 'red' }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/appointments/admin/stats');
      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error('获取统计失败:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (filters.status !== undefined) {
        params.status = filters.status;
      }
      if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
        params.startDate = filters.dateRange[0].format('YYYY-MM-DD');
        params.endDate = filters.dateRange[1].format('YYYY-MM-DD');
      }
      
      const res = await api.get('/appointments/admin', { params });
      if (res.success) {
        setData(res.data.list);
      }
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchStats();
  }, [filters]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await api.put(`/appointments/admin/${id}`, { status });
      if (res.success) {
        message.success('状态更新成功');
        fetchData();
        fetchStats();
      }
    } catch (error) {
      message.error('更新失败');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/appointments/admin/${id}`);
      message.success('删除成功');
      fetchData();
      fetchStats();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleRemark = async (values) => {
    try {
      const res = await api.put(`/appointments/admin/${selectedRecord.id}`, { 
        remark: values.remark,
        status: values.status 
      });
      if (res.success) {
        message.success('保存成功');
        setModalVisible(false);
        fetchData();
      }
    } catch (error) {
      message.error('保存失败');
    }
  };

  const showDetail = (record) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  const showEditModal = (record) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      status: record.status,
      remark: record.remark || ''
    });
    setModalVisible(true);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 100
    },
    {
      title: '电话',
      dataIndex: 'phone',
      width: 120
    },
    {
      title: '到访日期',
      dataIndex: 'visit_date',
      width: 110,
      render: (date) => moment(date).format('MM-DD'),
      sorter: (a, b) => moment(a.visit_date).unix() - moment(b.visit_date).unix()
    },
    {
      title: '时间',
      dataIndex: 'visit_time',
      width: 80
    },
    {
      title: '咨询目的',
      dataIndex: 'purpose',
      width: 120,
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (status) => (
        <Tag color={statusMap[status]?.color}>
          {statusMap[status]?.text}
        </Tag>
      ),
      filters: [
        { text: '待确认', value: 0 },
        { text: '已确认', value: 1 },
        { text: '已完成', value: 2 },
        { text: '已取消', value: 3 }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: '提交时间',
      dataIndex: 'created_at',
      width: 150,
      render: (date) => moment(date).format('MM-DD HH:mm')
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => showDetail(record)}
          >
            详情
          </Button>
          
          {record.status === 0 && (
            <Button
              type="link"
              icon={<CheckOutlined />}
              style={{ color: '#52c41a' }}
              onClick={() => handleUpdateStatus(record.id, 1)}
            >
              确认
            </Button>
          )}
          
          {record.status === 1 && (
            <Button
              type="link"
              icon={<CheckOutlined />}
              style={{ color: '#1890ff' }}
              onClick={() => handleUpdateStatus(record.id, 2)}
            >
              完成
            </Button>
          )}
          
          {(record.status === 0 || record.status === 1) && (
            <Button
              type="link"
              icon={<CloseOutlined />}
              danger
              onClick={() => handleUpdateStatus(record.id, 3)}
            >
              取消
            </Button>
          )}
          
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showEditModal(record)}
          >
            备注
          </Button>
          
          <Popconfirm 
            title="确认删除?" 
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="总预约"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="今日预约"
              value={stats.today}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="待确认"
              value={stats.pending}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="已确认"
              value={stats.confirmed}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="已完成"
              value={stats.completed}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="已取消"
              value={stats.cancelled}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card 
        className="shadow-sm"
        extra={
          <div style={{ display: 'flex', gap: 16 }}>
            <Select
              placeholder="筛选状态"
              allowClear
              style={{ width: 120 }}
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
            >
              <Select.Option value={0}>待确认</Select.Option>
              <Select.Option value={1}>已确认</Select.Option>
              <Select.Option value={2}>已完成</Select.Option>
              <Select.Option value={3}>已取消</Select.Option>
            </Select>
            
            <RangePicker
              placeholder={['开始日期', '结束日期']}
              value={filters.dateRange}
              onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
            />
            
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => {
                setFilters({ status: undefined, dateRange: null });
                fetchData();
                fetchStats();
              }}
            >
              刷新
            </Button>
          </div>
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

      {/* Edit Modal */}
      <Modal
        title="编辑预约"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={form.submit}
      >
        <Form form={form} layout="vertical" onFinish={handleRemark}>
          <Form.Item name="status" label="状态">
            <Select>
              <Select.Option value={0}>待确认</Select.Option>
              <Select.Option value={1}>已确认</Select.Option>
              <Select.Option value={2}>已完成</Select.Option>
              <Select.Option value={3}>已取消</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input.TextArea rows={4} placeholder="添加备注信息..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="预约详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {selectedRecord && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ color: '#999', fontSize: 12, marginBottom: 4 }}>姓名</div>
              <div style={{ fontWeight: 'bold' }}>{selectedRecord.name}</div>
            </div>
            <div>
              <div style={{ color: '#999', fontSize: 12, marginBottom: 4 }}>电话</div>
              <div>{selectedRecord.phone}</div>
            </div>
            <div>
              <div style={{ color: '#999', fontSize: 12, marginBottom: 4 }}>邮箱</div>
              <div>{selectedRecord.email || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#999', fontSize: 12, marginBottom: 4 }}>微信</div>
              <div>{selectedRecord.wechat || '-'}</div>
            </div>
            <div>
              <div style={{ color: '#999', fontSize: 12, marginBottom: 4 }}>到访日期</div>
              <div>{selectedRecord.visit_date}</div>
            </div>
            <div>
              <div style={{ color: '#999', fontSize: 12, marginBottom: 4 }}>到访时间</div>
              <div>{selectedRecord.visit_time || '-'}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ color: '#999', fontSize: 12, marginBottom: 4 }}>咨询目的</div>
              <div>{selectedRecord.purpose || '-'}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ color: '#999', fontSize: 12, marginBottom: 4 }}>补充说明</div>
              <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 8 }}>
                {selectedRecord.content || '-'}
              </div>
            </div>
            {selectedRecord.remark && (
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ color: '#999', fontSize: 12, marginBottom: 4 }}>备注</div>
                <div style={{ background: '#fff7e6', padding: 12, borderRadius: 8, color: '#d46b08' }}>
                  {selectedRecord.remark}
                </div>
              </div>
            )}
            <div>
              <div style={{ color: '#999', fontSize: 12, marginBottom: 4 }}>提交时间</div>
              <div>{moment(selectedRecord.created_at).format('YYYY-MM-DD HH:mm')}</div>
            </div>
            <div>
              <div style={{ color: '#999', fontSize: 12, marginBottom: 4 }}>状态</div>
              <Tag color={statusMap[selectedRecord.status]?.color}>
                {statusMap[selectedRecord.status]?.text}
              </Tag>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Appointments;
