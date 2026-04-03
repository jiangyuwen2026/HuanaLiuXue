import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return React.createElement('div', { style: { padding: '20px', fontSize: '16px' } }, 
    React.createElement('h1', null, '测试页面'),
    React.createElement('p', null, '如果你能看到这段文字，说明React工作正常')
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
