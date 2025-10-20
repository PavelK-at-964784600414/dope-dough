'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { Button } from './ui/button';
import { playNotificationSound } from '@/lib/audioUtils';

interface NotificationProps {
  stepId: number;
  stepTitle: string;
  onClose: () => void;
  soundEnabled?: boolean;
}

/**
 * Notification component - handles toast popup, browser notification, and bell sound
 */
export function Notification({ stepId, stepTitle, onClose, soundEnabled = true }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const hasPlayedSound = useRef(false);

  useEffect(() => {
    // Play bell sound using utility function (only once)
    if (soundEnabled && !hasPlayedSound.current) {
      hasPlayedSound.current = true;
      playNotificationSound();
    }

    // Request browser notification permission if not granted
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (window.Notification.permission === 'default') {
        window.Notification.requestPermission();
      }

      // Show browser notification
      if (window.Notification.permission === 'granted') {
        const notification = new window.Notification('Timer Completed! 🎉', {
          body: `Step ${stepId}: ${stepTitle}`,
          icon: '/icon.png',
          badge: '/icon.png',
          tag: `timer-${stepId}`,
          requireInteraction: true
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }
    }

    // Auto-dismiss toast after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 10000);

    return () => clearTimeout(timer);
  }, [stepId, stepTitle, onClose, soundEnabled]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]"
        >
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Bell className="h-6 w-6 text-green-600 animate-bounce" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-green-900">
                  Timer Completed! 🎉
                </h3>
                <p className="mt-1 text-sm text-green-800">
                  <span className="font-medium">Step {stepId}:</span> {stepTitle}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="flex-shrink-0 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface NotificationManagerProps {
  completedTimers: Array<{ stepId: number; stepTitle: string }>;
  onDismiss: (stepId: number) => void;
}

/**
 * NotificationManager - manages multiple notification toasts
 */
export function NotificationManager({ completedTimers, onDismiss }: NotificationManagerProps) {
  return (
    <>
      {completedTimers.map((timer, index) => (
        <div key={timer.stepId} style={{ top: `${4 + index * 7}rem` }} className="fixed right-4 z-50">
          <Notification
            stepId={timer.stepId}
            stepTitle={timer.stepTitle}
            onClose={() => onDismiss(timer.stepId)}
          />
        </div>
      ))}
    </>
  );
}
