/**
 * WordImportDemo - Word 导入分页显示示例
 * 
 * 演示功能:
 * - 导入 Word 文档
 * - 分页显示内容
 * - 切换显示模式
 */
import { useState } from 'react';
import { Card, Space, Radio, Button, Typography, Divider } from 'antd';
import { FileWordOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import WordImportButton from './WordImportButton';
import EditableContent from './EditableContent';

const { Title, Text } = Typography;

/**
 * 示例数据 - 包含分页符的内容
 */
const sampleContent = [
  {
    type: 'heading-one',
    align: 'center',
    children: [{ text: 'Word 文档导入示例', bold: true }]
  },
  {
    type: 'paragraph',
    align: 'center',
    children: [{ text: '这是一个展示分页显示功能的示例文档', italic: true }]
  },
  {
    type: 'paragraph',
    children: [{ text: '第一页的内容从这里开始。Word 导入功能支持分页符检测，可以将文档按照分页符分割成多个页面显示。' }]
  },
  {
    type: 'paragraph',
    children: [{ text: '以下是一些测试内容：' }]
  },
  {
    type: 'heading-two',
    children: [{ text: '第一章 概述' }]
  },
  {
    type: 'paragraph',
    firstLineIndent: 2,
    children: [{ text: '这是一个首行缩进的段落。在 Word 中设置的首行缩进会被正确导入并显示。文档还支持多种格式，包括粗体、斜体、下划线等。' }]
  },
  {
    type: 'paragraph',
    children: [
      { text: '粗体文本', bold: true },
      { text: '、' },
      { text: '斜体文本', italic: true },
      { text: '、' },
      { text: '下划线文本', underline: true },
      { text: '都可以正确显示。' }
    ]
  },
  // 分页符
  { type: 'page-break', children: [{ text: '' }] },
  {
    type: 'heading-two',
    children: [{ text: '第二章 详细内容' }]
  },
  {
    type: 'paragraph',
    children: [{ text: '这是第二页的内容。分页符将文档分割成多个页面，每页独立显示，类似 Word 的阅读体验。' }]
  },
  {
    type: 'paragraph',
    children: [{ text: '分页显示模式适合查看正式的文档，可以清楚地看到每页的边界。连续显示模式则适合编辑和快速浏览。' }]
  },
  {
    type: 'paragraph',
    children: [{ text: '两种显示模式可以根据需要随时切换。' }]
  },
  // 分页符
  { type: 'page-break', children: [{ text: '' }] },
  {
    type: 'heading-two',
    children: [{ text: '第三章 总结' }]
  },
  {
    type: 'paragraph',
    children: [{ text: '这是第三页的内容。Word 导入功能支持：' }]
  },
  {
    type: 'paragraph',
    children: [{ text: '1. 分页符检测和显示', bold: true }]
  },
  {
    type: 'paragraph',
    children: [{ text: '2. 文本格式（粗体、斜体、下划线等）', bold: true }]
  },
  {
    type: 'paragraph',
    children: [{ text: '3. 段落格式（对齐、缩进）', bold: true }]
  },
  {
    type: 'paragraph',
    children: [{ text: '4. 图片、表格、公式', bold: true }]
  },
  {
    type: 'paragraph',
    children: [{ text: '5. 中文字体正确识别', bold: true }]
  }
];

function WordImportDemo() {
  const [content, setContent] = useState(sampleContent);
  const [displayMode, setDisplayMode] = useState('pages'); // 'continuous' 或 'pages'
  const [isEditing, setIsEditing] = useState(false);
  
  const handleImport = (importedContent) => {
    setContent(importedContent);
    setIsEditing(true);
  };
  
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>
        <FileWordOutlined style={{ marginRight: 12 }} />
        Word 文档导入与分页显示
      </Title>
      
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        支持导入 Word 文档 (.docx)，自动检测分页符，提供连续显示和分页显示两种模式。
      </Text>
      
      {/* 工具栏 */}
      <Card style={{ marginBottom: 24 }}>
        <Space size="large" wrap>
          {/* 导入按钮 */}
          <WordImportButton 
            onImport={handleImport} 
            buttonText="导入 Word 文档"
            buttonType="primary"
            defaultDisplayMode={displayMode}
          />
          
          <Divider type="vertical" />
          
          {/* 显示模式切换 */}
          <div>
            <Text style={{ marginRight: 12 }}>显示模式:</Text>
            <Radio.Group 
              value={displayMode} 
              onChange={(e) => setDisplayMode(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="continuous">
                <EditOutlined /> 连续显示
              </Radio.Button>
              <Radio.Button value="pages">
                <EyeOutlined /> 分页显示
              </Radio.Button>
            </Radio.Group>
          </div>
          
          <Divider type="vertical" />
          
          {/* 示例按钮 */}
          <Button onClick={() => setContent(sampleContent)}>
            加载示例
          </Button>
        </Space>
      </Card>
      
      {/* 统计信息 */}
      <Card size="small" style={{ marginBottom: 24, backgroundColor: '#f6ffed' }}>
        <Space>
          <Text strong>当前文档:</Text>
          <Text>{content.filter(n => n.type === 'page-break').length + 1} 页</Text>
          <Divider type="vertical" />
          <Text>{content.filter(n => n.type === 'paragraph' || n.type?.startsWith('heading-')).length} 个段落</Text>
          <Divider type="vertical" />
          <Text>{content.filter(n => n.type === 'page-break').length} 个分页符</Text>
        </Space>
      </Card>
      
      {/* 内容显示区 */}
      <Card 
        title={
          <Space>
            <span>文档内容</span>
            <Tag color={displayMode === 'pages' ? 'blue' : 'green'}>
              {displayMode === 'pages' ? '分页显示' : '连续显示'}
            </Tag>
          </Space>
        }
        bodyStyle={{ padding: 0, backgroundColor: displayMode === 'pages' ? '#e8e8e8' : '#f5f5f5' }}
      >
        <EditableContent 
          value={content} 
          displayMode={displayMode}
          readOnly={!isEditing}
        />
      </Card>
      
      {/* 使用说明 */}
      <Card title="使用说明" style={{ marginTop: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text><Text strong>1. 导入 Word:</Text> 点击"导入 Word 文档"按钮，选择 .docx 文件</Text>
          <Text><Text strong>2. 分页显示:</Text> 文档中的分页符会将内容分割成多个页面</Text>
          <Text><Text strong>3. 切换模式:</Text> 连续显示适合编辑，分页显示适合查看</Text>
          <Text><Text strong>4. 格式支持:</Text> 支持字体、缩进、对齐、图片、表格、公式等</Text>
          <Text type="warning">
            注意: 导入前请确保后端服务已启动 (python-service/start.py)
          </Text>
        </Space>
      </Card>
    </div>
  );
}

// 简单 Tag 组件
function Tag({ children, color }) {
  const colorMap = {
    blue: '#1890ff',
    green: '#52c41a',
    red: '#f5222d',
    orange: '#fa8c16',
    purple: '#722ed1'
  };
  
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      fontSize: '12px',
      borderRadius: '4px',
      backgroundColor: colorMap[color] + '20',
      color: colorMap[color],
      border: `1px solid ${colorMap[color]}40`
    }}>
      {children}
    </span>
  );
}

export default WordImportDemo;
