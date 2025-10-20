'use client';

import { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDuration } from '@/lib/parseRecipe';
import { initAudioContext } from '@/lib/audioContext';

interface TimerControlProps {
  stepId: number;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isCompleted: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onTick: () => void;
  onComplete: () => void;
  hasMaxDuration?: boolean;
  maxSeconds?: number;
  useMaxDuration?: boolean;
  onToggleDuration?: () => void;
  language?: 'en' | 'ru';
}

/**
 * TimerControl component - manages timer state, UI, and triggers notifications on completion
 */
export function TimerControl({
  stepId,
  totalSeconds,
  remainingSeconds,
  isRunning,
  isCompleted,
  onStart,
  onPause,
  onReset,
  onTick,
  onComplete,
  hasMaxDuration = false,
  maxSeconds,
  useMaxDuration = false,
  onToggleDuration,
  language = 'en'
}: TimerControlProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasCalledComplete = useRef<boolean>(false);

  // Timer tick effect
  useEffect(() => {
    if (isRunning && !isCompleted) {
      intervalRef.current = setInterval(() => {
        onTick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isCompleted, onTick]);

  // Detect completion and trigger callback
  useEffect(() => {
    console.log(`Timer ${stepId}: remainingSeconds=${remainingSeconds}, isCompleted=${isCompleted}, isRunning=${isRunning}, hasCalledComplete=${hasCalledComplete.current}`);
    if (remainingSeconds === 0 && !hasCalledComplete.current) {
      console.log(`Timer ${stepId} COMPLETED! Calling onComplete()`);
      hasCalledComplete.current = true;
      onComplete();
    }
  }, [remainingSeconds, isCompleted, onComplete, stepId, isRunning]);

  // Reset the completion flag when timer is reset
  useEffect(() => {
    if (remainingSeconds > 0) {
      hasCalledComplete.current = false;
    }
  }, [remainingSeconds]);

  // Check for completion on mount/visibility change (for background timers)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isRunning && remainingSeconds === 0 && !isCompleted) {
        onComplete();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also check immediately on mount
    if (isRunning && remainingSeconds === 0 && !isCompleted) {
      onComplete();
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning, remainingSeconds, isCompleted, onComplete]);

  const progressPercentage = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  return (
    <div className="space-y-4 rounded-2xl border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-primary-100 p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-base font-semibold text-primary-700 font-display">
          <Timer className="h-5 w-5" />
          <span>{language === 'ru' ? 'Таймер' : 'Timer'}</span>
        </div>

        {/* Duration toggle (if step has min/max range) */}
        {hasMaxDuration && maxSeconds && onToggleDuration && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleDuration}
            className="text-xs rounded-lg border-2 border-primary-300 hover:bg-primary-50 hover:border-primary-400 transition-all"
          >
            {useMaxDuration 
              ? `${language === 'ru' ? 'Макс' : 'Max'}: ${formatDuration(maxSeconds)}` 
              : `${language === 'ru' ? 'Мин' : 'Min'}: ${formatDuration(totalSeconds)}`}
          </Button>
        )}
      </div>

      {/* Timer display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={remainingSeconds}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="text-center"
        >
          <div className={`text-5xl md:text-6xl font-bold tabular-nums font-display ${isCompleted ? 'text-success' : 'text-primary-600'}`}>
            {formatDuration(remainingSeconds)}
          </div>
          <div className="text-sm text-text-secondary mt-2 font-medium">
            {isCompleted 
              ? `✓ ${language === 'ru' ? 'Завершено!' : 'Completed!'}` 
              : `${language === 'ru' ? 'из' : 'of'} ${formatDuration(totalSeconds)}`}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <Progress value={progressPercentage} className="h-3 bg-primary-200" />

      {/* Control buttons */}
      <div className="flex gap-3">
        {!isRunning && !isCompleted && (
          <Button 
            onClick={() => {
              initAudioContext(); // Initialize audio on user interaction
              onStart();
            }} 
            className="flex-1 rounded-xl bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg transition-all" 
            size="lg"
          >
            <Play className="mr-2 h-5 w-5" />
            {language === 'ru' ? 'Старт' : 'Start'}
          </Button>
        )}

        {isRunning && (
          <Button onClick={onPause} variant="outline" className="flex-1 rounded-xl border-2 border-primary-300 hover:bg-primary-50 hover:border-primary-400 transition-all" size="lg">
            <Pause className="mr-2 h-5 w-5" />
            {language === 'ru' ? 'Пауза' : 'Pause'}
          </Button>
        )}

        <Button onClick={onReset} variant="outline" size="lg" className="rounded-xl border-2 border-borderColor hover:bg-surface hover:border-primary-300 transition-all px-4">
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
