import { PrimeReactProvider } from 'primereact/api';
import ToastProvider from './ToastProvider';
import AuthProvider from './AuthProvider';

type Props = {
  children: React.ReactNode;
};

const CustomerProvider = ({ children }: Props) => {
  return (
    <PrimeReactProvider value={{ ripple: true }}>
      <ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </ToastProvider>
    </PrimeReactProvider>
  );
};

export default CustomerProvider;
