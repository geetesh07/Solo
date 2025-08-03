import { useState, useEffect } from "react";
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info
};

const toastColors = {
  success: 'from-green-500/80 to-emerald-500/80 border-green-500 text-green-100',
  error: 'from-red-500/80 to-pink-500/80 border-red-500 text-red-100',
  warning: 'from-yellow-500/80 to-orange-500/80 border-yellow-500 text-yellow-100',
  info: 'from-cyan-500/80 to-blue-500/80 border-cyan-500 text-cyan-100'
};

function ToastItem({ toast, onClose }: ToastProps) {
  const Icon = toastIcons[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  return (
    <div className={`bg-gradient-to-r ${toastColors[toast.type]} p-4 mb-3 shadow-xl border-2 rounded-lg backdrop-blur-md animate-in slide-in-from-right-full`}>
      <div className="flex items-start space-x-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-bold text-white">{toast.title}</h4>
          {toast.message && (
            <p className="text-sm text-white/90 mt-1">{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => onClose(toast.id)}
          className="text-white/70 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

let toastCallbacks: Array<(toast: Omit<Toast, 'id'>) => void> = [];

export function showToast(toast: Omit<Toast, 'id'>) {
  toastCallbacks.forEach(callback => callback(toast));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const callback = (toast: Omit<Toast, 'id'>) => {
      const newToast: Toast = {
        ...toast,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      };
      setToasts(prev => [...prev, newToast]);
    };

    toastCallbacks.push(callback);

    return () => {
      toastCallbacks = toastCallbacks.filter(cb => cb !== callback);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
}