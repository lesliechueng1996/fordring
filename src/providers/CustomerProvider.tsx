import { PrimeReactProvider } from 'primereact/api';
import ToastProvider from './ToastProvider';

type Props = {
  children: React.ReactNode;
};

const CustomerProvider = ({ children }: Props) => {
  return (
    <PrimeReactProvider value={{ ripple: true }}>
      <ToastProvider>{children}</ToastProvider>
    </PrimeReactProvider>
  );
};

export default CustomerProvider;
