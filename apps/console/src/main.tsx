import React from 'react';
import ReactDOM from 'react-dom/client';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import './index.css';
import CustomerProvider from './providers/CustomerProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CustomerProvider />
  </React.StrictMode>
);
