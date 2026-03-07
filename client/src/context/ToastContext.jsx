import { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'default') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const value = { showToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto px-4 py-3 rounded-lg border shadow-lg transition-all duration-200"
            style={{
              backgroundColor: t.type === 'error' ? 'rgba(239,68,68,0.15)' : t.type === 'success' ? 'rgba(34,197,94,0.15)' : '#1a1a1a',
              borderColor: t.type === 'error' ? 'rgba(239,68,68,0.3)' : t.type === 'success' ? 'rgba(34,197,94,0.3)' : '#2a2a2a',
              color: t.type === 'error' ? '#fca5a5' : t.type === 'success' ? '#86efac' : '#f5f5f5',
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
