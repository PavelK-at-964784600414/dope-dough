import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  safeGetItem,
  safeSetItem,
  isValidTimerData,
  storageRateLimiter
} from '@/lib/security';

/**
 * Timer state for a single step
 */
export interface TimerState {
  stepId: number;
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  isCompleted: boolean;
  useMaxDuration: boolean; // Toggle between min/max duration
  startTime?: number; // Timestamp when timer started (for accurate tracking)
}

/**
 * Recipe progress tracking
 */
export interface RecipeProgress {
  currentStepIndex: number;
  completedSteps: number[];
}

interface RecipeStore {
  // Recipe progress
  progress: RecipeProgress;
  setCurrentStep: (index: number) => void;
  markStepCompleted: (stepId: number) => void;
  markStepIncomplete: (stepId: number) => void;
  resetProgress: () => void;

  // Timers state
  timers: Record<number, TimerState>;
  initTimer: (stepId: number, totalSeconds: number, maxSeconds?: number) => void;
  startTimer: (stepId: number) => void;
  pauseTimer: (stepId: number) => void;
  resetTimer: (stepId: number) => void;
  tickTimer: (stepId: number) => void;
  toggleDuration: (stepId: number, maxSeconds: number) => void;
  completeTimer: (stepId: number) => void;

  // Bulk controls
  startAllTimers: () => void;
  pauseAllTimers: () => void;
  resetAllTimers: () => void;
}

/**
 * Zustand store with localStorage persistence and security validation
 * Keys: sourdough:progress, sourdough:timers (from ramp.json)
 */
export const useRecipeStore = create<RecipeStore>()(
  persist(
    (set, get) => ({
      // Initial state
      progress: {
        currentStepIndex: 0,
        completedSteps: []
      },
      timers: {},

      // Progress actions
      setCurrentStep: (index) => {
        // Validate index
        if (typeof index !== 'number' || index < 0 || index > 100) {
          console.error('[Security] Invalid step index:', index);
          return;
        }
        
        set((state) => ({
          progress: { ...state.progress, currentStepIndex: index }
        }));
      },

      markStepCompleted: (stepId) => {
        // Validate stepId
        if (typeof stepId !== 'number' || stepId < 1 || stepId > 100) {
          console.error('[Security] Invalid step ID:', stepId);
          return;
        }
        
        set((state) => ({
          progress: {
            ...state.progress,
            completedSteps: [...new Set([...state.progress.completedSteps, stepId])]
          }
        }));
      },

      markStepIncomplete: (stepId) => {
        // Validate stepId
        if (typeof stepId !== 'number' || stepId < 1 || stepId > 100) {
          console.error('[Security] Invalid step ID:', stepId);
          return;
        }
        
        set((state) => ({
          progress: {
            ...state.progress,
            completedSteps: state.progress.completedSteps.filter(id => id !== stepId)
          }
        }));
      },

      resetProgress: () => {
        set({
          progress: {
            currentStepIndex: 0,
            completedSteps: []
          }
        });
      },

      // Timer actions
      initTimer: (stepId, totalSeconds, maxSeconds) => {
        set((state) => ({
          timers: {
            ...state.timers,
            [stepId]: {
              stepId,
              remainingSeconds: totalSeconds,
              totalSeconds,
              isRunning: false,
              isCompleted: false,
              useMaxDuration: false
            }
          }
        }));
      },

      startTimer: (stepId) => {
        set((state) => {
          const timer = state.timers[stepId];
          if (!timer) return state;

          return {
            timers: {
              ...state.timers,
              [stepId]: { 
                ...timer, 
                isRunning: true,
                startTime: Date.now() // Record when timer started
              }
            }
          };
        });
      },

      pauseTimer: (stepId) => {
        set((state) => {
          const timer = state.timers[stepId];
          if (!timer) return state;

          // Calculate actual remaining time based on elapsed time
          let remainingSeconds = timer.remainingSeconds;
          if (timer.isRunning && timer.startTime) {
            const elapsed = Math.floor((Date.now() - timer.startTime) / 1000);
            remainingSeconds = Math.max(0, timer.remainingSeconds - elapsed);
          }

          return {
            timers: {
              ...state.timers,
              [stepId]: { 
                ...timer, 
                isRunning: false,
                remainingSeconds,
                startTime: undefined
              }
            }
          };
        });
      },

      resetTimer: (stepId) => {
        set((state) => {
          const timer = state.timers[stepId];
          if (!timer) return state;

          return {
            timers: {
              ...state.timers,
              [stepId]: {
                ...timer,
                remainingSeconds: timer.totalSeconds,
                isRunning: false,
                isCompleted: false,
                startTime: undefined
              }
            }
          };
        });
      },

      tickTimer: (stepId) => {
        set((state) => {
          const timer = state.timers[stepId];
          if (!timer || !timer.isRunning || timer.isCompleted) return state;

          // Calculate remaining time based on elapsed time since start
          let remainingSeconds = timer.remainingSeconds;
          if (timer.startTime) {
            const elapsed = Math.floor((Date.now() - timer.startTime) / 1000);
            remainingSeconds = Math.max(0, timer.remainingSeconds - elapsed);
            
            // Reset startTime to current for next tick
            const isCompleted = remainingSeconds === 0;
            
            return {
              timers: {
                ...state.timers,
                [stepId]: {
                  ...timer,
                  remainingSeconds,
                  isCompleted,
                  isRunning: !isCompleted,
                  startTime: isCompleted ? undefined : Date.now()
                }
              }
            };
          }

          // Fallback to old behavior if no startTime
          const newRemaining = Math.max(0, timer.remainingSeconds - 1);
          const isCompleted = newRemaining === 0;

          return {
            timers: {
              ...state.timers,
              [stepId]: {
                ...timer,
                remainingSeconds: newRemaining,
                isCompleted,
                isRunning: !isCompleted,
                startTime: isCompleted ? undefined : Date.now()
              }
            }
          };
        });
      },

      toggleDuration: (stepId, maxSeconds) => {
        set((state) => {
          const timer = state.timers[stepId];
          if (!timer) return state;

          const newUseMax = !timer.useMaxDuration;
          const newTotal = newUseMax ? maxSeconds : timer.totalSeconds;

          return {
            timers: {
              ...state.timers,
              [stepId]: {
                ...timer,
                useMaxDuration: newUseMax,
                totalSeconds: newTotal,
                remainingSeconds: newTotal,
                isRunning: false,
                isCompleted: false,
                startTime: undefined
              }
            }
          };
        });
      },

      completeTimer: (stepId) => {
        set((state) => {
          const timer = state.timers[stepId];
          if (!timer) return state;

          return {
            timers: {
              ...state.timers,
              [stepId]: { 
                ...timer, 
                isCompleted: true, 
                isRunning: false,
                startTime: undefined
              }
            }
          };
        });
      },

      // Bulk controls
      startAllTimers: () => {
        set((state) => {
          const updatedTimers = { ...state.timers };
          const now = Date.now();
          Object.keys(updatedTimers).forEach((key) => {
            const stepId = parseInt(key);
            const timer = updatedTimers[stepId];
            if (timer && !timer.isCompleted) {
              updatedTimers[stepId] = { ...timer, isRunning: true, startTime: now };
            }
          });
          return { timers: updatedTimers };
        });
      },

      pauseAllTimers: () => {
        set((state) => {
          const updatedTimers = { ...state.timers };
          const now = Date.now();
          Object.keys(updatedTimers).forEach((key) => {
            const stepId = parseInt(key);
            const timer = updatedTimers[stepId];
            if (timer && timer.isRunning) {
              // Calculate remaining time based on elapsed time
              let remainingSeconds = timer.remainingSeconds;
              if (timer.startTime) {
                const elapsed = Math.floor((now - timer.startTime) / 1000);
                remainingSeconds = Math.max(0, timer.remainingSeconds - elapsed);
              }
              updatedTimers[stepId] = { 
                ...timer, 
                isRunning: false, 
                remainingSeconds,
                startTime: undefined 
              };
            }
          });
          return { timers: updatedTimers };
        });
      },

      resetAllTimers: () => {
        set((state) => {
          const updatedTimers = { ...state.timers };
          Object.keys(updatedTimers).forEach((key) => {
            const stepId = parseInt(key);
            const timer = updatedTimers[stepId];
            if (timer) {
              updatedTimers[stepId] = {
                ...timer,
                remainingSeconds: timer.totalSeconds,
                isRunning: false,
                isCompleted: false,
                startTime: undefined
              };
            }
          });
          return { timers: updatedTimers };
        });
      }
    }),
    {
      name: 'sourdough:timers', // localStorage key from ramp.json
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          // Check if we're in browser environment
          if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
            return null;
          }
          
          // Rate limit storage access
          if (!storageRateLimiter.isAllowed('storage-read')) {
            console.warn('[Security] Storage read rate limit exceeded');
            return null;
          }
          
          try {
            // Get raw string from localStorage (Zustand expects the raw string)
            const item = localStorage.getItem(name);
            return item;
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('[Security] Failed to read from storage:', error);
            }
            return null;
          }
        },
        setItem: (name, value) => {
          // Check if we're in browser environment
          if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
            return;
          }
          
          // Rate limit storage writes
          if (!storageRateLimiter.isAllowed('storage-write')) {
            console.warn('[Security] Storage write rate limit exceeded');
            return;
          }
          
          try {
            // Validate the key format
            if (!/^(sourdough|dope-dough):[a-z0-9-]+$/i.test(name)) {
              console.error('[Security] Invalid localStorage key format:', name);
              return;
            }
            
            // Set the raw string to localStorage (Zustand sends already stringified data)
            localStorage.setItem(name, value);
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('[Security] Failed to save to storage:', error);
            }
          }
        },
        removeItem: (name) => {
          if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
            return;
          }
          
          try {
            localStorage.removeItem(name);
          } catch (error) {
            if (process.env.NODE_ENV === 'development') {
              console.error('[Security] Failed to remove from storage:', error);
            }
          }
        }
      })),
      partialize: (state) => ({
        progress: state.progress,
        timers: state.timers
      }),
      // Merge strategy to handle corrupted data
      merge: (persistedState, currentState) => {
        // Validate persisted state
        if (!persistedState || typeof persistedState !== 'object') {
          // Only log in development, not during build (SSG)
          if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
            console.warn('[Security] Invalid persisted state, using defaults');
          }
          return currentState;
        }
        
        const state = persistedState as Partial<RecipeStore>;
        
        // Validate progress
        const progress = state.progress && 
          typeof state.progress === 'object' &&
          typeof (state.progress as RecipeProgress).currentStepIndex === 'number' &&
          Array.isArray((state.progress as RecipeProgress).completedSteps)
          ? state.progress
          : currentState.progress;
        
        // Validate timers
        const timers = state.timers &&
          typeof state.timers === 'object'
          ? state.timers
          : currentState.timers;
        
        return {
          ...currentState,
          progress,
          timers
        };
      }
    }
  )
);
