import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const Root = () => {
  const path = window.location.pathname;

  if (path.startsWith('/view/')) {
    const id = path.replace('/view/', '');
    return <App mode="view" secretId={id} />;
  }

  return <App mode="create" />;
};

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
