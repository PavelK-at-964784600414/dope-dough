'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  duration?: number;
  isOpen: boolean;
  onClose: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const variantStyles = {
  default: {
    bg: 'bg-surface border-borderColor',
    icon: 'text-primary-500',
    iconPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z',
  },
  success: {
    bg: 'bg-success-light border-success',
    icon: 'text-success',
    iconPath: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  },
  warning: {
    bg: 'bg-warning-light border-warning',
    icon: 'text-warning',
    iconPath: 'M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z',
  },
  error: {
    bg: 'bg-error-light border-error',
    icon: 'text-error',
    iconPath: 'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z',
  },
  info: {
    bg: 'bg-info-light border-info',
    icon: 'text-info',
    iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
  },
};

export function Toast({
  title,
  description,
  variant = 'default',
  duration = 4000,
  isOpen,
  onClose,
  action,
}: ToastProps) {
  React.useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50"
          role="alert"
          aria-live="polite"
        >
          <div
            className={cn(
              'rounded-2xl border-2 shadow-xl backdrop-blur-sm p-4',
              styles.bg
            )}
          >
            <div className="flex gap-3">
              {/* Icon */}
              <div className={cn('shrink-0', styles.icon)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d={styles.iconPath} />
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-semibold text-text-primary">
                  {title}
                </h4>
                {description && (
                  <p className="mt-1 text-sm text-text-secondary">{description}</p>
                )}
                {action && (
                  <button
                    onClick={() => {
                      action.onClick();
                      onClose();
                    }}
                    className="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {action.label}
                  </button>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="shrink-0 rounded-lg p-1 text-text-tertiary hover:bg-white/50 hover:text-text-primary transition-colors"
                aria-label="Close notification"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Progress bar */}
            {duration > 0 && (
              <motion.div
                className="mt-3 h-1 rounded-full bg-text-primary/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className={cn('h-full rounded-full', styles.icon.replace('text-', 'bg-'))}
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: duration / 1000, ease: 'linear' }}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook for managing toast notifications
 */
export function useToast() {
  const [toasts, setToasts] = React.useState<Array<ToastProps & { id: string }>>([]);

  const show = React.useCallback((props: Omit<ToastProps, 'isOpen' | 'onClose'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...props, id, isOpen: true, onClose: () => {} }]);

    if (props.duration !== 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, props.duration || 4000);
    }

    return id;
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = React.useCallback(() => {
    setToasts([]);
  }, []);

  return { toasts, show, dismiss, dismissAll };
}

/**
 * Toast Container Component
 */
export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => dismiss(toast.id)}
        />
      ))}
    </>
  );
}

/**
 * USAGE EXAMPLE:
 * 
 * // In your component
 * const { show } = useToast();
 * 
 * // Success notification
 * show({
 *   title: 'Starter fed successfully!',
 *   description: 'Your starter will be ready in ~4 hours',
 *   variant: 'success',
 * });
 * 
 * // Error notification
 * show({
 *   title: 'Timer failed',
 *   description: 'Could not start the timer',
 *   variant: 'error',
 * });
 * 
 * // With action
 * show({
 *   title: 'Timer complete',
 *   description: 'Time to fold the dough',
 *   variant: 'info',
 *   action: {
 *     label: 'View step',
 *     onClick: () => router.push('/recipe/step-3'),
 *   },
 * });
 */
