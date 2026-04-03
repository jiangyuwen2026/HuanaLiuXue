import { useState, useEffect } from 'react';
import {
  Card, Form, Input, Button, Tabs, message, Upload, Image,
  Table, Space, Popconfirm
} from 'antd';
import {
  SaveOutlined, ReloadOutlined, PlusOutlined, DeleteOutlined,
  UploadOutlined, EditOutlined
} from '@ant-design/icons';
import api from '../utils/api';

const { TabPane } = Tabs;
const { TextArea } = Input;

function About() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [aboutData, setAboutData] = useState(null);
  
  // 图片上传状态
  const [heroBg, setHeroBg] = useState('');
  const [advantagesImg, setAdvantagesImg] = useState('');
  const [uploading, setUploading] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/about/admin');
      if (res.success && res.data) {
        setAboutData(res.data);
        form.setFieldsValue(res.data);
        setHeroBg(res.data.hero_background || '');
        setAdvantagesImg(res.data.advantages_image || '');
      }
    } catch (error) {
      message.error('获取配置失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const data = {
        ...values,
        hero_background: heroBg,
        advantages_image: advantagesImg
      };
      const res = await api.put('/about/admin', data);
      if (res.success) {
        message.success('保存成功');
      }
    } catch (error) {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  // 通用上传函数
  const customUpload = async (file, type) => {
    try {
      setUploading(prev => ({ ...prev, [type]: true }));
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload/school-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.success) {
        if (type === 'hero') setHeroBg(res.data.url);
        if (type === 'advantages') setAdvantagesImg(res.data.url);
        message.success('上传成功');
      }
    } catch (error) {
      message.error('上传失败');
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  // 渲染JSON数组表单
  const renderJsonArrayForm = (name, fields) => (
    <Form.List name={name}>
      {(fieldsList, { add, remove }) => (
        <>
          <Table
            dataSource={fieldsList}
            pagination={false}
            rowKey="key"
            columns={[
              ...fields.map(f => ({
                title: f.label,
                dataIndex: 'name',
                render: (_, record) => (
                  <Form.Item
                    {...record}
                    name={[record.name, f.name]}
                    noStyle
                  >
                    {f.type === 'textarea' ? (
                      <TextArea rows={2} placeholder={f.placeholder} />
                    ) : f.type === 'select' ? (
                      <select className="w-full border rounded px-2 py-1">
                        {f.options.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <Input placeholder={f.placeholder} />
                    )}
                  </Form.Item>
                )
              })),
              {
                title: '操作',
                render: (_, record) => (
                  <Button type="link" danger onClick={() => remove(record.name)}>
                    删除
                  </Button>
                )
              }
            ]}
          />
          <Button
            type="dashed"
            onClick={() => add()}
            block
            icon={<PlusOutlined />}
            className="mt-4"
          >
            添加项目
          </Button>
        </>
      )}
    </Form.List>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">关于我们配置</h1>
        <p className="text-gray-500 mt-1">配置官网关于我们页面的内容</p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        loading={loading}
      >
        <Card
          className="shadow-sm mb-6"
          extra={
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchData}
                loading={loading}
              >
                刷新
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={form.submit}
                loading={saving}
              >
                保存配置
              </Button>
            </Space>
          }
        >
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            {/* Hero 区域 */}
            <TabPane tab="Hero区域" key="hero">
              <Form.Item name="hero_subtitle" label="副标题">
                <Input placeholder="如：关于华南留学" />
              </Form.Item>
              <Form.Item name="hero_title" label="主标题">
                <Input placeholder="如：助力学子实现全球教育梦想" />
              </Form.Item>
              <Form.Item name="hero_description" label="描述">
                <TextArea rows={4} placeholder="公司简介" />
              </Form.Item>
              <Form.Item label="背景图">
                <div className="flex items-center gap-4">
                  {heroBg ? (
                    <div className="relative">
                      <Image
                        src={heroBg}
                        alt="背景图"
                        className="w-40 h-24 object-cover rounded"
                      />
                      <Button
                        size="small"
                        danger
                        className="absolute -top-2 -right-2"
                        onClick={() => setHeroBg('')}
                      >
                        删除
                      </Button>
                    </div>
                  ) : (
                    <Upload
                      customRequest={({ file }) => customUpload(file, 'hero')}
                      showUploadList={false}
                      accept="image/*"
                    >
                      <Button
                        icon={<UploadOutlined />}
                        loading={uploading.hero}
                        className="w-40 h-24"
                      >
                        上传背景图
                      </Button>
                    </Upload>
                  )}
                </div>
              </Form.Item>
            </TabPane>

            {/* 统计数据 */}
            <TabPane tab="统计数据" key="stats">
              {renderJsonArrayForm('stats', [
                { name: 'value', label: '数值', placeholder: '如：15+' },
                { name: 'label', label: '标签', placeholder: '如：年行业经验' },
                { name: 'desc', label: '描述', placeholder: '如：深耕留学服务领域' }
              ])}
            </TabPane>

            {/* 使命愿景 */}
            <TabPane tab="使命愿景" key="mission">
              <Form.Item name="mission_title" label="使命标题">
                <Input />
              </Form.Item>
              <Form.Item name="mission_content" label="使命内容">
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item name="vision_title" label="愿景标题">
                <Input />
              </Form.Item>
              <Form.Item name="vision_content" label="愿景内容">
                <TextArea rows={4} />
              </Form.Item>
            </TabPane>

            {/* 核心价值观 */}
            <TabPane tab="核心价值观" key="values">
              {renderJsonArrayForm('values', [
                { name: 'title', label: '标题', placeholder: '如：专业卓越' },
                { name: 'desc', label: '描述', placeholder: '价值观描述', type: 'textarea' },
                { name: 'color', label: '渐变色', placeholder: '如：from-emerald-500 to-teal-600' },
                { name: 'icon', label: '图标', placeholder: '如：shield' }
              ])}
            </TabPane>

            {/* 发展历程 */}
            <TabPane tab="发展历程" key="timeline">
              {renderJsonArrayForm('timeline', [
                { name: 'year', label: '年份', placeholder: '如：2009' },
                { name: 'title', label: '标题', placeholder: '如：公司成立' },
                { name: 'desc', label: '描述', placeholder: '事件描述', type: 'textarea' }
              ])}
            </TabPane>

            {/* 为什么选择我们 */}
            <TabPane tab="为什么选择我们" key="advantages">
              <Form.Item name="advantages_title" label="标题">
                <Input />
              </Form.Item>
              <Form.Item name="advantages_subtitle" label="副标题">
                <TextArea rows={2} />
              </Form.Item>
              <Form.Item label="区域图片">
                <div className="flex items-center gap-4">
                  {advantagesImg ? (
                    <div className="relative">
                      <Image
                        src={advantagesImg}
                        alt="图片"
                        className="w-40 h-24 object-cover rounded"
                      />
                      <Button
                        size="small"
                        danger
                        className="absolute -top-2 -right-2"
                        onClick={() => setAdvantagesImg('')}
                      >
                        删除
                      </Button>
                    </div>
                  ) : (
                    <Upload
                      customRequest={({ file }) => customUpload(file, 'advantages')}
                      showUploadList={false}
                      accept="image/*"
                    >
                      <Button
                        icon={<UploadOutlined />}
                        loading={uploading.advantages}
                        className="w-40 h-24"
                      >
                        上传图片
                      </Button>
                    </Upload>
                  )}
                </div>
              </Form.Item>
              {renderJsonArrayForm('advantages', [
                { name: 'icon', label: '序号', placeholder: '如：01' },
                { name: 'title', label: '标题', placeholder: '如：个性化方案' },
                { name: 'desc', label: '描述', placeholder: '描述内容', type: 'textarea' }
              ])}
            </TabPane>

            {/* 核心团队 */}
            <TabPane tab="核心团队" key="team">
              <Form.Item name="team_title" label="标题">
                <Input />
              </Form.Item>
              <Form.Item name="team_subtitle" label="副标题">
                <TextArea rows={2} />
              </Form.Item>
              {renderJsonArrayForm('team', [
                { name: 'name', label: '姓名', placeholder: '如：陈博士' },
                { name: 'title', label: '职位', placeholder: '如：创始人兼CEO' },
                { name: 'bio', label: '简介', placeholder: '个人简介', type: 'textarea' },
                { name: 'avatar', label: '头像URL', placeholder: '头像图片地址' }
              ])}
            </TabPane>

            {/* 合作院校 */}
            <TabPane tab="合作院校" key="partners">
              <Form.Item name="partners_title" label="标题">
                <Input />
              </Form.Item>
              <Form.Item name="partners_subtitle" label="副标题">
                <TextArea rows={2} />
              </Form.Item>
              <Form.List name="partners">
                {(fields, { add, remove }) => (
                  <>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {fields.map(({ key, name, ...restField }) => (
                        <div key={key} className="flex items-center gap-2">
                          <Form.Item
                            {...restField}
                            name={name}
                            noStyle
                          >
                            <Input placeholder="院校名称" className="w-40" />
                          </Form.Item>
                          <Button
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                          />
                        </div>
                      ))}
                    </div>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      添加合作院校
                    </Button>
                  </>
                )}
              </Form.List>
            </TabPane>
          </Tabs>
        </Card>
      </Form>
    </div>
  );
}

export default About;
