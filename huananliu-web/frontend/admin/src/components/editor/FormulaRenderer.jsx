/**
 * FormulaRenderer - 公式渲染组件
 * 
 * 支持两种模式:
 * 1. MathJax 模式: 使用 MathJax 渲染 OMML/MathML
 * 2. 简单模式: 显示公式占位符
 * 
 * Word 公式使用 OMML (Office Math Markup Language) 格式
 * 需要将 OMML 转换为 MathML 或直接显示
 */
import { useEffect, useRef, useState } from 'react';

// OMML 到 MathML 的简化转换
// 注意: 完整转换需要复杂的解析，这里提供基础支持
function convertOMMLToMathML(ommlXml) {
  if (!ommlXml) return '';
  
  // 简单替换 OMML 命名空间为 MathML
  let mathml = ommlXml
    .replace(/m:/g, 'm:')  // 保留 OMML 前缀
    .replace(/<math/, '<math xmlns="http://www.w3.org/1998/Math/MathML"');
  
  return mathml;
}

/**
 * FormulaRenderer 组件
 * @param {Object} props
 * @param {string} props.mathXml - OMML/MathML XML 字符串
 * @param {string} props.mode - 渲染模式: 'mathjax' | 'placeholder' | 'raw'
 */
function FormulaRenderer({ mathXml, mode = 'placeholder' }) {
  const containerRef = useRef(null);
  const [loadError, setLoadError] = useState(false);
  
  useEffect(() => {
    if (mode === 'mathjax' && mathXml && containerRef.current) {
      // 检查 MathJax 是否已加载
      if (window.MathJax) {
        try {
          window.MathJax.typesetPromise([containerRef.current]).catch((err) => {
            console.error('MathJax 渲染失败:', err);
            setLoadError(true);
          });
        } catch (e) {
          console.error('MathJax 错误:', e);
          setLoadError(true);
        }
      } else {
        // 尝试动态加载 MathJax
        loadMathJax();
      }
    }
  }, [mathXml, mode]);
  
  const loadMathJax = () => {
    if (window.MathJaxLoading) return;
    window.MathJaxLoading = true;
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    script.onload = () => {
      window.MathJax = {
        tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
        svg: { fontCache: 'global' }
      };
      if (containerRef.current) {
        window.MathJax.typesetPromise([containerRef.current]);
      }
    };
    script.onerror = () => {
      setLoadError(true);
      window.MathJaxLoading = false;
    };
    document.head.appendChild(script);
  };
  
  // 渲染模式: placeholder
  if (mode === 'placeholder' || loadError) {
    return (
      <span 
        className="formula-placeholder"
        style={{
          display: 'inline-block',
          padding: '2px 8px',
          margin: '0 4px',
          backgroundColor: '#f0f5ff',
          border: '1px dashed #1890ff',
          borderRadius: '4px',
          color: '#1890ff',
          fontSize: '14px',
          fontStyle: 'italic',
          cursor: 'default',
          userSelect: 'none'
        }}
        title="公式 (Word 导入)"
      >
        [公式]
      </span>
    );
  }
  
  // 渲染模式: raw - 直接显示原始 XML
  if (mode === 'raw') {
    return (
      <pre 
        className="formula-raw"
        style={{
          display: 'inline-block',
          padding: '4px 8px',
          backgroundColor: '#f5f5f5',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#666',
          maxWidth: '200px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {mathXml?.substring(0, 50)}...
      </pre>
    );
  }
  
  // 渲染模式: mathjax
  const mathml = convertOMMLToMathML(mathXml);
  
  return (
    <span 
      ref={containerRef}
      className="formula-mathjax"
      style={{
        display: 'inline-block',
        padding: '4px',
        margin: '0 4px'
      }}
      dangerouslySetInnerHTML={{ __html: mathml }}
    />
  );
}

export default FormulaRenderer;
