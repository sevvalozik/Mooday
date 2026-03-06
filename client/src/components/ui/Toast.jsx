import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const toastColors = {
  success: 'border-green-500 bg-green-500/10',
  error: 'border-red-500 bg-red-500/10',
  info: 'border-purple-500 bg-purple-500/10',
  warning: 'border-yellow-500 bg-yellow-500/10',
};

let toastId = 0;
let addToastFn = null;

export const toast = (message, type = 'info') => {
  if (addToastFn) addToastFn({ id: ++toastId, message, type });
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    addToastFn = (t) => setToasts((prev) => [...prev, t]);
    return () => { addToastFn = null; };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed right-4 top-20 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem = ({ toast: t, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`rounded-lg border px-4 py-3 text-sm text-white shadow-lg backdrop-blur-sm ${toastColors[t.type]}`}
    >
      {t.message}
    </motion.div>
  );
};
