/**
 * EditableContent - 可编辑内容组件（支持分页显示）
 * 
 * 功能:
 * - 根据分页符将内容分割成多个页面显示
 * - 支持两种显示模式: 'continuous' (连续带分隔线) / 'pages' (独立页面)
 * - 支持渲染: 段落、标题、图片、表格、分页符、公式、文本格式
 */
import { useState, useMemo } from 'react';
import FormulaRenderer from './FormulaRenderer';

/**
 * 渲染文本节点 (叶子节点)
 */
function RenderLeaf({ attributes, children, leaf }) {
  let style = {};
  let className = '';
  
  if (leaf.fontFamily) style.fontFamily = leaf.fontFamily;
  if (leaf.fontSize) style.fontSize = `${leaf.fontSize}pt`;
  if (leaf.color) style.color = leaf.color;
  if (leaf.bold) className += ' font-bold';
  if (leaf.italic) className += ' italic';
  if (leaf.underline) className += ' underline';
  if (leaf.strikethrough) className += ' line-through';
  if (leaf.superscript) {
    style.verticalAlign = 'super';
    style.fontSize = 'smaller';
  }
  if (leaf.subscript) {
    style.verticalAlign = 'sub';
    style.fontSize = 'smaller';
  }
  
  return (
    <span {...attributes} style={style} className={className || undefined}>
      {children}
    </span>
  );
}

/**
 * 渲染块级元素
 */
function RenderElement({ attributes, children, element }) {
  const { type } = element;
  
  switch (type) {
    case 'image':
      return (
        <div 
          {...attributes} 
          style={{ textAlign: element.align || 'center', margin: '16px 0' }}
          contentEditable={false}
        >
          <img 
            src={element.src} 
            alt={element.alt || '图片'}
            style={{ maxWidth: '100%', height: 'auto', display: 'inline-block', border: '1px solid #e8e8e8' }}
          />
          {children}
        </div>
      );
    
    // 分页符 - 在连续模式下显示分隔线
    case 'page-break':
      return (
        <div 
          {...attributes} 
          className="page-break-line"
          style={{
            margin: '32px 0',
            position: 'relative',
            height: '2px',
            borderTop: '2px dashed #d9d9d9',
          }}
          contentEditable={false}
        >
          <span 
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#fff',
              padding: '4px 12px',
              fontSize: '12px',
              color: '#999',
              border: '1px solid #d9d9d9',
              borderRadius: '4px'
            }}
          >
            分页符
          </span>
          {children}
        </div>
      );
    
    case 'formula':
      return (
        <div 
          {...attributes} 
          style={{
            margin: '16px 0',
            textAlign: 'center',
            padding: '12px',
            backgroundColor: '#f6ffed',
            border: '1px dashed #b7eb8f',
            borderRadius: '4px'
          }}
          contentEditable={false}
        >
          <FormulaRenderer mathXml={element.mathXml} mode="placeholder" />
          {children}
        </div>
      );
    
    case 'formula-inline':
      return (
        <span {...attributes} contentEditable={false}>
          <FormulaRenderer mathXml={element.mathXml} mode="placeholder" />
          {children}
        </span>
      );
    
    case 'table':
      return (
        <div style={{ margin: '16px 0', overflowX: 'auto' }} {...attributes}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #d9d9d9' }}>
            <tbody>{children}</tbody>
          </table>
        </div>
      );
    
    case 'table-row':
      return <tr>{children}</tr>;
    
    case 'table-cell':
      return (
        <td style={{ border: '1px solid #d9d9d9', padding: '8px 12px', minWidth: '50px' }}>
          {children}
        </td>
      );
    
    case 'heading-one':
      return (
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '24px 0 16px', textAlign: element.align || 'left' }}>
          {children}
        </h1>
      );
    
    case 'heading-two':
      return (
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '20px 0 12px', textAlign: element.align || 'left' }}>
          {children}
        </h2>
      );
    
    case 'heading-three':
      return (
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '16px 0 8px', textAlign: element.align || 'left' }}>
          {children}
        </h3>
      );
    
    case 'paragraph':
    default: {
      const align = element.align || 'left';
      const firstLineIndent = element.firstLineIndent;
      const indent = element.indent;
      
      const style = {
        margin: '8px 0',
        lineHeight: '1.8',
        textAlign: align
      };
      
      if (firstLineIndent !== undefined) {
        style.textIndent = `${firstLineIndent * 2}em`;
      }
      
      if (indent && indent > 0 && firstLineIndent === 0) {
        style.paddingLeft = `${indent * 2}em`;
        style.textIndent = `-${indent * 2}em`;
      }
      
      return <p {...attributes} style={style}>{children}</p>;
    }
  }
}

/**
 * 递归渲染 Slate 节点
 */
function renderNode(node, index = 0) {
  if (typeof node === 'string') return node;
  if (!node || typeof node !== 'object') return null;
  
  if (node.text !== undefined) {
    let text = node.text || '\u200B';
    return <RenderLeaf key={index} leaf={node} attributes={{}}>{text}</RenderLeaf>;
  }
  
  const children = node.children?.map((child, i) => renderNode(child, i)) || [];
  
  return (
    <RenderElement key={index} element={node} attributes={{}}>
      {children.length > 0 ? children : null}
    </RenderElement>
  );
}

/**
 * 将内容按分页符分割成页面
 */
function splitContentByPageBreaks(nodes) {
  const pages = [];
  let currentPage = [];
  
  for (const node of nodes) {
    if (node.type === 'page-break') {
      // 遇到分页符，保存当前页，开始新页
      if (currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [];
      }
    } else {
      currentPage.push(node);
    }
  }
  
  // 添加最后一页
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }
  
  // 如果没有分页符，所有内容作为一页
  if (pages.length === 0 && nodes.length > 0) {
    pages.push(nodes);
  }
  
  return pages;
}

/**
 * 独立页面组件
 */
function PageContainer({ pageNumber, children, totalPages }) {
  return (
    <div 
      className="document-page"
      style={{
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        margin: '20px auto',
        padding: '60px 80px',
        minHeight: '1123px',  // A4 高度 (297mm at 96dpi)
        width: '794px',       // A4 宽度 (210mm at 96dpi)
        position: 'relative',
        boxSizing: 'border-box'
      }}
    >
      {/* 页面内容 */}
      <div style={{ minHeight: '900px' }}>
        {children}
      </div>
      
      {/* 页码 */}
      <div 
        style={{
          position: 'absolute',
          bottom: '30px',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: '12px',
          color: '#999'
        }}
      >
        {pageNumber} / {totalPages}
      </div>
    </div>
  );
}

/**
 * EditableContent 主组件
 * 
 * @param {Object} props
 * @param {Array} props.value - Slate 节点数组
 * @param {Function} props.onChange - 内容变化回调
 * @param {boolean} props.readOnly - 是否只读
 * @param {string} props.displayMode - 显示模式: 'continuous' | 'pages'
 */
function EditableContent({ 
  value = [], 
  onChange, 
  readOnly = false,
  displayMode = 'pages'  // 'continuous' 或 'pages'
}) {
  const [currentPage, setCurrentPage] = useState(0);
  
  // 按分页符分割内容
  const pages = useMemo(() => {
    return splitContentByPageBreaks(value);
  }, [value]);
  
  if (!Array.isArray(value) || value.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
        暂无内容
      </div>
    );
  }
  
  // 连续模式 - 所有内容在一个滚动区域，分页符显示为分隔线
  if (displayMode === 'continuous') {
    return (
      <div 
        className="editable-content continuous"
        style={{
          padding: '40px',
          backgroundColor: '#f5f5f5',
          minHeight: '600px',
          overflow: 'auto'
        }}
      >
        <div 
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            backgroundColor: '#fff',
            padding: '60px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            minHeight: '600px'
          }}
        >
          {value.map((node, index) => renderNode(node, index))}
        </div>
      </div>
    );
  }
  
  // 分页模式 - 每页独立显示（类似 Word）
  return (
    <div 
      className="editable-content pages"
      style={{
        padding: '20px',
        backgroundColor: '#e8e8e8',
        minHeight: '600px',
        overflow: 'auto'
      }}
    >
      {/* 页面导航栏 */}
      {pages.length > 1 && (
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
            padding: '12px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <button 
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            style={{
              padding: '6px 16px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              backgroundColor: currentPage === 0 ? '#f5f5f5' : '#fff',
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            上一页
          </button>
          
          <span style={{ fontSize: '14px', color: '#666' }}>
            第 {currentPage + 1} 页 / 共 {pages.length} 页
          </span>
          
          <button 
            onClick={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))}
            disabled={currentPage === pages.length - 1}
            style={{
              padding: '6px 16px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              backgroundColor: currentPage === pages.length - 1 ? '#f5f5f5' : '#fff',
              cursor: currentPage === pages.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            下一页
          </button>
          
          <select 
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            style={{
              padding: '6px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px'
            }}
          >
            {pages.map((_, i) => (
              <option key={i} value={i}>第 {i + 1} 页</option>
            ))}
          </select>
        </div>
      )}
      
      {/* 单页显示模式 */}
      <PageContainer pageNumber={currentPage + 1} totalPages={pages.length}>
        {pages[currentPage]?.map((node, index) => renderNode(node, index))}
      </PageContainer>
      
      {/* 所有页面连续显示（可选） */}
      {pages.length > 1 && (
        <div style={{ textAlign: 'center', marginTop: '20px', color: '#999' }}>
          --- 共 {pages.length} 页 ---
        </div>
      )}
    </div>
  );
}

export default EditableContent;
export { RenderElement, RenderLeaf, renderNode, splitContentByPageBreaks };
