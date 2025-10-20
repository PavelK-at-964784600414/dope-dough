import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TimerState {
  isActive: boolean;
  startTime: number | null; // Unix timestamp when timer started
  totalDuration: number; // Total duration in seconds
  pausedTime: number | null; // Unix timestamp when paused
  remainingAtPause: number | null; // Remaining seconds when paused
  
  // Actions
  startTimer: (durationSeconds: number) => void;
  pauseTimer: (remainingSeconds: number) => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  getRemainingSeconds: () => number;
}

export const useTimer = create<TimerState>()(
  persist(
    (set, get) => ({
      isActive: false,
      startTime: null,
      totalDuration: 0,
      pausedTime: null,
      remainingAtPause: null,

      startTimer: (durationSeconds: number) => {
        set({
          isActive: true,
          startTime: Date.now(),
          totalDuration: durationSeconds,
          pausedTime: null,
          remainingAtPause: null,
        });
      },

      pauseTimer: (remainingSeconds: number) => {
        set({
          isActive: false,
          pausedTime: Date.now(),
          remainingAtPause: remainingSeconds,
        });
      },

      resumeTimer: () => {
        const state = get();
        if (state.remainingAtPause !== null) {
          set({
            isActive: true,
            startTime: Date.now(),
            totalDuration: state.remainingAtPause,
            pausedTime: null,
            remainingAtPause: null,
          });
        }
      },

      resetTimer: () => {
        set({
          isActive: false,
          startTime: null,
          totalDuration: 0,
          pausedTime: null,
          remainingAtPause: null,
        });
      },

      getRemainingSeconds: () => {
        const state = get();
        
        // If paused, return the remaining time at pause
        if (state.pausedTime !== null && state.remainingAtPause !== null) {
          return Math.max(0, state.remainingAtPause);
        }
        
        // If not active or no start time, return 0
        if (!state.isActive || state.startTime === null) {
          return 0;
        }
        
        // Calculate remaining time
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        const remaining = state.totalDuration - elapsed;
        
        return Math.max(0, remaining);
      },
    }),
    {
      name: 'dope-dough:timer',
    }
  )
);
