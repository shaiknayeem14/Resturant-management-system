import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '380px',
        width: '100%',
      }}
    >
      {toasts.map((toast) => {
        let icon = <Info size={20} color="#60a5fa" />;
        let borderColor = 'rgba(59, 130, 246, 0.4)';
        let bgColor = '#131b2e';

        if (toast.type === 'success') {
          icon = <CheckCircle size={20} color="#34d399" />;
          borderColor = 'rgba(16, 185, 129, 0.4)';
        } else if (toast.type === 'error') {
          icon = <AlertCircle size={20} color="#f87171" />;
          borderColor = 'rgba(239, 68, 68, 0.4)';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle size={20} color="#fbbf24" />;
          borderColor = 'rgba(245, 158, 11, 0.4)';
        }

        return (
          <div
            key={toast.id}
            style={{
              background: bgColor,
              border: `1px solid ${borderColor}`,
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              color: '#f8fafc',
              fontSize: '0.9rem',
              animation: 'slideUp 0.25s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {icon}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
