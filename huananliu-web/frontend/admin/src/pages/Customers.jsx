/**
 * ============================================================================
 * 注册客户管理页面 (v2.1.0)
 * ============================================================================
 * 功能：前端注册用户管理（微信小程序用户）
 * 包括：列表展示、详情查看、启用/禁用、数据统计
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Tag, Space, Card, Row, Col, 
  Statistic, DatePicker, Input, Select, Avatar, 
  Descriptions, Timeline, message, Tooltip, Badge
} from 'antd';
import { 
  UserOutlined, PhoneOutlined, SearchOutlined,
  EyeOutlined, StopOutlined, CheckCircleOutlined,
  DownloadOutlined, ManOutlined, WomanOutlined,
  QuestionOutlined, TeamOutlined, MobileOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

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

const { RangePicker } = DatePicker;
const { Option } = Select;

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [statistics, setStatistics] = useState({
    overview: {
      totalUsers: 0,
      todayNew: 0,
      weekNew: 0,
      monthNew: 0,
      phoneBound: 0,
      activeUsers: 0,
      phoneBoundRate: 0
    },
    genderStats: [],
    trend: []
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    keyword: '',
    status: undefined,
    hasPhone: undefined,
    dateRange: null
  });

  // 获取客户列表
  const fetchCustomers = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = {
        page: params.current || pagination.current,
        limit: params.pageSize || pagination.pageSize,
        keyword: filters.keyword,
        status: filters.status,
        hasPhone: filters.hasPhone,
        startDate: filters.dateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: filters.dateRange?.[1]?.format('YYYY-MM-DD'),
        ...params
      };

      const response = await apiClient.get('/admin/customers', { params: queryParams });
      if (response.data.success) {
        setCustomers(response.data.data);
        setPagination({
          ...pagination,
          total: response.data.pagination.total,
          current: response.data.pagination.page
        });
      }
    } catch (error) {
      message.error('获取客户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const response = await apiClient.get('/admin/customers/statistics/overview');
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchStatistics();
  }, []);

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80
    },
    {
      title: '用户',
      dataIndex: 'nickname',
      render: (_, record) => (
        <Space>
          <Avatar 
            src={record.avatar} 
            icon={<UserOutlined />}
            size="small"
          />
          <span>{record.nickname || '微信用户'}</span>
          {record.gender === 1 ? (
            <ManOutlined style={{ color: '#1890ff' }} />
          ) : record.gender === 2 ? (
            <WomanOutlined style={{ color: '#eb2f96' }} />
          ) : (
            <QuestionOutlined style={{ color: '#999' }} />
          )}
        </Space>
      )
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      render: (phone) => phone ? (
        <Space>
          <MobileOutlined />
          {phone}
        </Space>
      ) : (
        <Tag color="default">未绑定</Tag>
      )
    },
    {
      title: '地区',
      dataIndex: 'province',
      render: (province, record) => {
        const location = [record.country, record.province, record.city]
          .filter(Boolean)
          .join(' ');
        return location || '-';
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => (
        <Badge 
          status={status === 1 ? 'success' : 'default'} 
          text={status === 1 ? '正常' : '禁用'}
        />
      )
    },
    {
      title: '最后登录',
      dataIndex: 'last_login',
      render: (date) => date ? (
        <Tooltip title={new Date(date).toLocaleString()}>
          <Space>
            <ClockCircleOutlined />
            {dayjs(date).fromNow()}
          </Space>
        </Tooltip>
      ) : '-'
    },
    {
      title: '注册时间',
      dataIndex: 'created_at',
      render: (date) => new Date(date).toLocaleString(),
      sorter: true
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          {record.status === 1 ? (
            <Button 
              type="link" 
              danger
              icon={<StopOutlined />}
              onClick={() => handleToggleStatus(record.id, 0)}
            >
              禁用
            </Button>
          ) : (
            <Button 
              type="link" 
              icon={<CheckCircleOutlined />}
              onClick={() => handleToggleStatus(record.id, 1)}
            >
              启用
            </Button>
          )}
        </Space>
      )
    }
  ];

  // 查看详情
  const handleViewDetail = async (record) => {
    try {
      const response = await apiClient.get(`/admin/customers/${record.id}`);
      if (response.data.success) {
        setSelectedCustomer(response.data.data);
        setDetailModalVisible(true);
      }
    } catch (error) {
      message.error('获取详情失败');
    }
  };

  // 切换状态
  const handleToggleStatus = async (id, status) => {
    try {
      await apiClient.put(`/admin/customers/${id}/status`, { status });
      message.success(status === 1 ? '启用成功' : '禁用成功');
      fetchCustomers();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 导出数据
  const handleExport = () => {
    window.open('http://localhost:3001/api/admin/customers/export/all');
  };

  // 搜索
  const handleSearch = () => {
    fetchCustomers({ current: 1 });
  };

  // 重置筛选
  const handleReset = () => {
    setFilters({
      keyword: '',
      status: undefined,
      hasPhone: undefined,
      dateRange: null
    });
    fetchCustomers({ current: 1 });
  };

  return (
    <div className="customers-page">
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card>
            <Statistic 
              title="总用户数" 
              value={statistics.overview.totalUsers}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic 
              title="今日新增" 
              value={statistics.overview.todayNew}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic 
              title="本周新增" 
              value={statistics.overview.weekNew}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic 
              title="本月新增" 
              value={statistics.overview.monthNew}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic 
              title="已绑手机" 
              value={statistics.overview.phoneBound}
              suffix={`(${statistics.overview.phoneBoundRate}%)`}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic 
              title="活跃用户" 
              value={statistics.overview.activeUsers}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选栏 */}
      <Card style={{ marginBottom: 24 }}>
        <Space wrap>
          <Input
            placeholder="搜索昵称/手机号/openid"
            value={filters.keyword}
            onChange={(e) => setFilters({...filters, keyword: e.target.value})}
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="状态"
            value={filters.status}
            onChange={(value) => setFilters({...filters, status: value})}
            style={{ width: 120 }}
            allowClear
          >
            <Option value={1}>正常</Option>
            <Option value={0}>禁用</Option>
          </Select>
          <Select
            placeholder="手机号绑定"
            value={filters.hasPhone}
            onChange={(value) => setFilters({...filters, hasPhone: value})}
            style={{ width: 140 }}
            allowClear
          >
            <Option value="1">已绑定</Option>
            <Option value="0">未绑定</Option>
          </Select>
          <RangePicker
            placeholder={['开始日期', '结束日期']}
            value={filters.dateRange}
            onChange={(dates) => setFilters({...filters, dateRange: dates})}
          />
          <Button type="primary" onClick={handleSearch}>搜索</Button>
          <Button onClick={handleReset}>重置</Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            导出
          </Button>
        </Space>
      </Card>

      {/* 数据表格 */}
      <Card title="客户列表">
        <Table
          columns={columns}
          dataSource={customers}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`
          }}
          onChange={fetchCustomers}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title="客户详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {selectedCustomer && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                src={selectedCustomer.avatar} 
                icon={<UserOutlined />}
                size={80}
              />
              <h3 style={{ marginTop: 12, marginBottom: 4 }}>
                {selectedCustomer.nickname || '微信用户'}
              </h3>
              <Space>
                <Tag color={selectedCustomer.status === 1 ? 'success' : 'default'}>
                  {selectedCustomer.status === 1 ? '正常' : '禁用'}
                </Tag>
                {selectedCustomer.phone && (
                  <Tag icon={<PhoneOutlined />} color="blue">
                    已绑手机
                  </Tag>
                )}
              </Space>
            </div>

            <Descriptions bordered column={2}>
              <Descriptions.Item label="ID">{selectedCustomer.id}</Descriptions.Item>
              <Descriptions.Item label="OpenID">
                <span style={{ fontSize: 12 }}>{selectedCustomer.openid}</span>
              </Descriptions.Item>
              <Descriptions.Item label="手机号">
                {selectedCustomer.phone || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="性别">
                {selectedCustomer.gender === 1 ? '男' : 
                 selectedCustomer.gender === 2 ? '女' : '未知'}
              </Descriptions.Item>
              <Descriptions.Item label="国家">{selectedCustomer.country || '-'}</Descriptions.Item>
              <Descriptions.Item label="省份">{selectedCustomer.province || '-'}</Descriptions.Item>
              <Descriptions.Item label="城市">{selectedCustomer.city || '-'}</Descriptions.Item>
              <Descriptions.Item label="语言">{selectedCustomer.language || '-'}</Descriptions.Item>
              <Descriptions.Item label="注册时间" span={2}>
                {new Date(selectedCustomer.created_at).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="最后登录" span={2}>
                {selectedCustomer.last_login ? 
                  new Date(selectedCustomer.last_login).toLocaleString() : '-'}
              </Descriptions.Item>
            </Descriptions>

            {selectedCustomer.appointments && selectedCustomer.appointments.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <h4>最近预约记录</h4>
                <Timeline mode="left">
                  {selectedCustomer.appointments.map((apt, index) => (
                    <Timeline.Item key={index}>
                      <p>{apt.purpose}</p>
                      <p style={{ color: '#999', fontSize: 12 }}>
                        {new Date(apt.visit_date).toLocaleDateString()} {apt.visit_time}
                      </p>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default Customers;
