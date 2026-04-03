import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { BankOutlined, TeamOutlined, FileTextOutlined, MessageOutlined, ReadOutlined } from '@ant-design/icons';
import { getStats } from '../utils/api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getStats();
        if (res.success) setStats(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>数据概览</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="学校数量" value={stats?.schools || 0} prefix={<BankOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="顾问数量" value={stats?.consultants || 0} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="成功案例" value={stats?.cases || 0} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="新闻资讯" value={stats?.news || 0} prefix={<ReadOutlined />} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card>
            <Statistic title="留言总数" value={stats?.messages || 0} prefix={<MessageOutlined />} />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic title="待处理留言" value={stats?.pendingMessages || 0} valueStyle={{ color: '#faad14' }} prefix={<MessageOutlined />} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
