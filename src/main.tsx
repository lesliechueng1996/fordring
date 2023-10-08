import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { PrimeReactProvider } from 'primereact/api';
import Tailwind from 'primereact/passthrough/tailwind';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrimeReactProvider value={{ unstyled: true, pt: Tailwind, ripple: true }}>
      <App />
    </PrimeReactProvider>
  </React.StrictMode>
);
