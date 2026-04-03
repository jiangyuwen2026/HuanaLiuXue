/**
 * WordImportButton - Word 文档导入按钮组件
 * 
 * 功能:
 * - 上传 Word 文档 (.docx)
 * - 显示导入预览（支持分页显示）
 * - 支持插入到编辑器
 */
import { useState } from 'react';
import { Button, Modal, message, Upload, Spin, Tag, Space, Radio } from 'antd';
import { FileWordOutlined } from '@ant-design/icons';
import EditableContent from './EditableContent';
import { API_BASE_URL } from './config';

/**
 * Word 导入服务
 */
export const wordImportService = {
  async importDocument(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/api/import/docx`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || '导入失败');
    }
    
    return response.json();
  },
  
  async getSupportedFormats() {
    const response = await fetch(`${API_BASE_URL}/api/import/formats`);
    if (!response.ok) {
      throw new Error('获取支持格式失败');
    }
    return response.json();
  }
};

/**
 * Word 导入按钮组件
 * @param {Object} props
 * @param {Function} props.onImport - 导入成功回调，接收 Slate 内容数组
 * @param {string} props.buttonText - 按钮文字
 * @param {string} props.buttonType - 按钮类型
 * @param {string} props.defaultDisplayMode - 默认显示模式: 'continuous' | 'pages'
 */
function WordImportButton({ 
  onImport, 
  buttonText = '导入 Word', 
  buttonType = 'default',
  defaultDisplayMode = 'pages'
}) {
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [displayMode, setDisplayMode] = useState(defaultDisplayMode);
  
  // 处理文件选择
  const handleFileSelect = async (file) => {
    if (!file.name.endsWith('.docx')) {
      message.error('只支持 .docx 格式的 Word 文档');
      return false;
    }
    
    setLoading(true);
    
    try {
      const result = await wordImportService.importDocument(file);
      
      if (result.success) {
        setPreviewData(result);
        setPreviewVisible(true);
        message.success('文档导入成功');
      } else {
        message.error(result.message || '导入失败');
      }
    } catch (error) {
      console.error('导入错误:', error);
      message.error(error.message || '导入失败，请检查服务是否运行 (python-service/start.py)');
    } finally {
      setLoading(false);
    }
    
    return false;
  };
  
  // 确认导入
  const handleConfirmImport = () => {
    if (previewData?.content && onImport) {
      onImport(previewData.content);
      message.success('内容已插入编辑器');
    }
    setPreviewVisible(false);
    setPreviewData(null);
  };
  
  // 渲染统计信息
  const renderStatistics = () => {
    if (!previewData?.statistics) return null;
    
    const stats = previewData.statistics;
    
    return (
      <Space wrap>
        <Tag color="blue">段落: {stats.paragraphs}</Tag>
        <Tag color="green">标题: {stats.headings}</Tag>
        <Tag color="orange">图片: {stats.images}</Tag>
        <Tag color="purple">表格: {stats.tables}</Tag>
        <Tag color="cyan">分页符: {stats.page_breaks}</Tag>
        <Tag color="magenta">公式: {stats.formulas}</Tag>
        <Tag color="default">总计: {stats.total}</Tag>
      </Space>
    );
  };
  
  return (
    <>
      <Upload
        accept=".docx"
        beforeUpload={handleFileSelect}
        showUploadList={false}
        disabled={loading}
      >
        <Button 
          type={buttonType}
          icon={loading ? <Spin size="small" /> : <FileWordOutlined />}
          loading={loading}
        >
          {buttonText}
        </Button>
      </Upload>
      
      {/* 预览弹窗 */}
      <Modal
        title="Word 导入预览"
        open={previewVisible}
        onOk={handleConfirmImport}
        onCancel={() => setPreviewVisible(false)}
        width={1000}
        okText="插入到编辑器"
        cancelText="取消"
        styles={{ body: { padding: '20px 0' } }}
      >
        {previewData && (
          <div>
            {/* 文档信息 */}
            <div style={{ 
              marginBottom: 16, 
              padding: '16px 20px', 
              backgroundColor: '#f6ffed', 
              borderRadius: 8,
              border: '1px solid #b7eb8f'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ margin: '0 0 12px 0' }}>
                    <FileWordOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                    {previewData.title || '未命名文档'}
                  </h4>
                  {renderStatistics()}
                </div>
                
                {/* 显示模式切换 */}
                <Radio.Group 
                  value={displayMode} 
                  onChange={(e) => setDisplayMode(e.target.value)}
                  size="small"
                >
                  <Radio.Button value="continuous">连续显示</Radio.Button>
                  <Radio.Button value="pages">分页显示</Radio.Button>
                </Radio.Group>
              </div>
            </div>
            
            {/* 内容预览 */}
            <EditableContent 
              value={previewData.content} 
              readOnly 
              displayMode={displayMode}
            />
            
            {/* 字体信息 */}
            {previewData.fonts && previewData.fonts.length > 0 && (
              <div style={{ marginTop: 16, padding: '0 20px' }}>
                <h5 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>检测到的字体:</h5>
                <Space wrap>
                  {previewData.fonts.map((font, index) => (
                    <Tag key={index} size="small">{font}</Tag>
                  ))}
                </Space>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}

export default WordImportButton;
