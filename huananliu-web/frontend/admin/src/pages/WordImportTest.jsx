/**
 * Word 导入功能测试页面
 */
import { useState } from 'react';
import { Card, Typography, Alert, Space } from 'antd';
import { WordImportButton, EditableContent } from '../components/editor';

const { Title, Text } = Typography;

function WordImportTest() {
  const [content, setContent] = useState([]);
  const [importStats, setImportStats] = useState(null);

  const handleImport = (result) => {
    setContent(result.content);
    setImportStats(result.statistics);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>Word 文档导入测试</Title>
      
      <Alert
        message="使用说明"
        description="点击下方的'导入 Word 文档'按钮，选择 .docx 文件，系统会自动解析分页符并分页显示内容。"
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Card style={{ marginBottom: '24px' }}>
        <Space>
          <WordImportButton 
            onImport={handleImport}
            buttonText="导入 Word 文档"
            buttonType="primary"
          />
          
          {importStats && (
            <Text type="secondary">
              共 {importStats.total} 个节点，{importStats.page_breaks} 个分页符
            </Text>
          )}
        </Space>
      </Card>

      {content.length > 0 && (
        <Card 
          title="导入结果" 
          extra={
            importStats && (
              <Space>
                <span>段落: {importStats.paragraphs}</span>
                <span>图片: {importStats.images}</span>
                <span>表格: {importStats.tables}</span>
              </Space>
            )
          }
        >
          <EditableContent 
            value={content}
            displayMode="pages"
            readOnly
          />
        </Card>
      )}
    </div>
  );
}

export default WordImportTest;
