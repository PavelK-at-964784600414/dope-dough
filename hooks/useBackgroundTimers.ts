'use client';

import { useEffect } from 'react';
import { useRecipeStore } from '@/store/useRecipeStore';

interface UseBackgroundTimersProps {
  onTimerComplete: (stepId: number) => void;
}

/**
 * Hook to handle timers that complete while tab is inactive
 * Checks all running timers when page becomes visible and triggers notifications
 */
export function useBackgroundTimers({ onTimerComplete }: UseBackgroundTimersProps) {
  const { timers, completeTimer, tickTimer } = useRecipeStore();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Page became visible - check all running timers
        Object.values(timers).forEach((timer) => {
          if (timer.isRunning && !timer.isCompleted && timer.startTime) {
            const elapsed = Math.floor((Date.now() - timer.startTime) / 1000);
            const remaining = timer.remainingSeconds - elapsed;

            if (remaining <= 0) {
              // Timer completed while we were away!
              console.log(`Timer ${timer.stepId} completed while tab was inactive`);
              completeTimer(timer.stepId);
              onTimerComplete(timer.stepId);
            } else {
              // Update the timer to reflect elapsed time
              tickTimer(timer.stepId);
            }
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timers, completeTimer, tickTimer, onTimerComplete]);
}
