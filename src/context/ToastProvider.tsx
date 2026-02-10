import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import style from "./toast.module.css";
import { Icon } from "../components/Icon/Icon";

type ToastType = "success" | "error" | "warning" | "info";

type Toast = {
  id: number;
  message: string;
  type?: ToastType;
  duration?: number;
};

type ToastContextType = {
  addToast: (message: string, options?: { type?: ToastType; duration?: number }) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

let toastIdCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, options: { type?: ToastType; duration?: number } = {}) => {
      const { type = "success", duration = 6000 } = options;
      const id = toastIdCounter++;
      setToasts((prev) => [...prev, { id, message, type, duration }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastContainer = (
    <div className={style.toastContainer}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${style.toast} ${style[`toast${toast.type ? toast.type.charAt(0).toUpperCase() + toast.type.slice(1) : "Success"}`]}`}
        >
          <p className={style.toastText}>{toast.message}</p>
          <button
            className={style.closeButton}
            onClick={() => removeToast(toast.id)}
          >
            <Icon name="cross" />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {createPortal(toastContainer, document.body)}
    </ToastContext.Provider>
  );
}