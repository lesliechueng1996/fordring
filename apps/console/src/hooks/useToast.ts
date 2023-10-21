import { useContext } from 'react';
import { ToastContext } from '../providers/ToastProvider';

const useToast = () => {
  const toastContext = useContext(ToastContext);
  if (!toastContext) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return toastContext;
};

export default useToast;
