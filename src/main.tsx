import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import './index.css';
import CustomerProvider from './providers/CustomerProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CustomerProvider>
      <App />
    </CustomerProvider>
  </React.StrictMode>
);
