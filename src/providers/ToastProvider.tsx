import { createContext, useCallback, useRef } from 'react';
import { Toast } from 'primereact/toast';

type ToastContextType = {
  success: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
};

const TOAST_TIMEOUT = 3000;

export const ToastContext = createContext<ToastContextType | null>(null);

type Props = {
  children: React.ReactNode;
};

export default function ToastProvider({ children }: Props) {
  const toastRef = useRef<Toast>(null);

  const showSuccess = useCallback((message: string) => {
    toastRef.current?.show({ severity: 'success', summary: '成功', detail: message, life: TOAST_TIMEOUT });
  }, []);

  const showInfo = useCallback((message: string) => {
    toastRef.current?.show({ severity: 'info', summary: '提示', detail: message, life: TOAST_TIMEOUT });
  }, []);

  const showWarn = useCallback((message: string) => {
    toastRef.current?.show({ severity: 'warn', summary: '警告', detail: message, life: TOAST_TIMEOUT });
  }, []);

  const showError = useCallback((message: string) => {
    toastRef.current?.show({ severity: 'error', summary: '错误', detail: message, life: TOAST_TIMEOUT });
  }, []);

  return (
    <ToastContext.Provider
      value={{
        success: showSuccess,
        info: showInfo,
        warn: showWarn,
        error: showError,
      }}
    >
      {children}
      <Toast ref={toastRef} />
    </ToastContext.Provider>
  );
}
