import { PrimeReactProvider } from 'primereact/api';
import ToastProvider from './ToastProvider';
import AuthProvider from './AuthProvider';
import { RouterProvider } from 'react-router-dom';
import router from '../router';

const CustomerProvider = () => {
  return (
    <PrimeReactProvider value={{ ripple: true }}>
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ToastProvider>
    </PrimeReactProvider>
  );
};

export default CustomerProvider;
