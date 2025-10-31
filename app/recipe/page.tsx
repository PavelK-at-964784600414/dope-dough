'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useRecipeStore } from '@/store/useRecipeStore';
import { RecipeStep, parseRecipeFromString } from '@/lib/parseRecipe';
import { StepCard } from '@/components/StepCard';
import { TimerControl } from '@/components/TimerControl';
import { NotificationManager } from '@/components/Notification';
import { RecipeOverview } from '@/components/RecipeOverview';
import { IngredientsChecklist } from '@/components/IngredientsChecklist';
import { Celebration } from '@/components/Celebration';
import { TopNav } from '@/components/design-system/TopNav';
import { Footer } from '@/components/Footer';
import { useBackgroundTimers } from '@/hooks/useBackgroundTimers';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { RotateCcw, ArrowLeft, ChevronLeft, ChevronRight, Check, LayoutDashboard, Sprout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/**
 * Recipe page - main UI for step-by-step sourdough recipe with timers
 */
export default function RecipePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [steps, setSteps] = useState<RecipeStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedNotifications, setCompletedNotifications] = useState<Array<{ stepId: number; stepTitle: string }>>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const {
    progress,
    timers,
    setCurrentStep,
    markStepCompleted,
    markStepIncomplete,
    initTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    tickTimer,
    toggleDuration,
    completeTimer,
    resetAllTimers,
    resetProgress
  } = useRecipeStore();

  // Track if store has been hydrated from localStorage
  const [hasHydrated, setHasHydrated] = useState(false);

  // Wait for store hydration
  useEffect(() => {
    // Small delay to ensure Zustand persist has loaded from localStorage
    const timer = setTimeout(() => {
      setHasHydrated(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Load recipe data
  useEffect(() => {
    // Don't initialize timers until store has hydrated from localStorage
    if (!hasHydrated) return;

    async function loadRecipe() {
      try {
        setLoading(true);
        const response = await fetch('/recipe.json');
        const data = await response.json();
        
        if (data.steps && Array.isArray(data.steps)) {
          setSteps(data.steps);

          // Initialize timers for steps with durations ONLY if not already in store
          data.steps.forEach((step: RecipeStep) => {
            if (step.suggestedTimerSeconds && !timers[step.id]) {
              initTimer(step.id, step.suggestedTimerSeconds, step.duration_max_seconds);
            }
          });
        }
      } catch (error) {
        console.error('Failed to load recipe:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRecipe();
  }, [hasHydrated]);

  // Handle timer completion
  const handleTimerComplete = useCallback((stepId: number) => {
    console.log('handleTimerComplete called for step:', stepId);
    completeTimer(stepId);
    markStepCompleted(stepId);

    const step = steps.find(s => s.id === stepId);
    if (step) {
      const title = language === 'ru' ? step.title_ru : step.title_en;
      console.log('Adding notification for step:', stepId, title);
      setCompletedNotifications(prev => [...prev, { stepId, stepTitle: title }]);
    }
  }, [completeTimer, markStepCompleted, steps, language]);

  const dismissNotification = useCallback((stepId: number) => {
    setCompletedNotifications(prev => prev.filter(n => n.stepId !== stepId));
  }, []);

  // Handle background timers (timers that complete while tab is inactive)
  useBackgroundTimers({ onTimerComplete: handleTimerComplete });

  const handleReset = () => {
    if (confirm('Reset all progress and timers?')) {
      resetProgress();
      resetAllTimers();
      setCompletedNotifications([]);
    }
  };

  // Navigation handlers
  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setCurrentStep(currentStepIndex + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setCurrentStep(currentStepIndex - 1);
    }
  };

  const handleToggleComplete = (stepId: number) => {
    const isCompleted = progress.completedSteps.includes(stepId);
    if (isCompleted) {
      markStepIncomplete(stepId);
      // Also dismiss any active notifications for this step
      setCompletedNotifications(prev => prev.filter(n => n.stepId !== stepId));
    } else {
      markStepCompleted(stepId);
      // Don't add notification when manually marking complete
      
      // Check if this is the final step
      const isFinalStep = steps.length > 0 && stepId === steps[steps.length - 1].id;
      if (isFinalStep) {
        // Show celebration after a brief delay
        setTimeout(() => setShowCelebration(true), 500);
      }
    }
  };

  // Current step
  const currentStep = steps[currentStepIndex];
  const isCurrentStepCompleted = currentStep ? progress.completedSteps.includes(currentStep.id) : false;
  const currentTimer = currentStep ? timers[currentStep.id] : null;
  const hasTimer = currentStep?.suggestedTimerSeconds != null;

  return (
    <div className="min-h-screen bg-warmBg pb-20 md:pb-0">
      <TopNav />
      
      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <Celebration 
            language={language} 
            onDismiss={() => setShowCelebration(false)} 
          />
        )}
      </AnimatePresence>
      
      {/* Notifications */}
      <NotificationManager
        completedTimers={completedNotifications}
        onDismiss={dismissNotification}
      />

      {/* Header with warm design */}
      <div className="w-full border-b border-borderColor-light bg-surface shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
              {language === 'ru' ? 'Заквасочный хлеб' : 'Sourdough Bread Recipe'}
            </h1>
          </div>
          <p className="text-text-secondary ml-14">
            {language === 'ru' 
              ? 'Полный рецепт с таймерами для каждого этапа' 
              : 'Complete recipe with timers for each step'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Global controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-wrap gap-3 items-center"
        >
          <IngredientsChecklist language={language} />
          
          <RecipeOverview steps={steps} language={language} />
          
          <Button onClick={handleReset} variant="outline" size="lg" className="gap-2 rounded-xl border-2 border-primary-300 hover:bg-primary-50 hover:border-primary-400 hover:scale-[1.02] active:scale-[0.98] transition-all">
            <RotateCcw className="h-5 w-5" />
            {language === 'ru' ? 'Сбросить всё' : 'Reset All'}
          </Button>

          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="gap-2 rounded-xl border-2 border-primary-300 hover:bg-primary-50 hover:border-primary-400 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <LayoutDashboard className="h-5 w-5" />
              {language === 'ru' ? 'Панель' : 'Dashboard'}
            </Button>
          </Link>

          <div className="ml-auto text-sm text-text-secondary flex items-center gap-4">
            <span className="font-medium font-display text-primary-600">
              {language === 'ru' ? 'Прогресс:' : 'Progress:'} {progress.completedSteps.length} / {steps.length}
            </span>
          </div>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-text-secondary font-body">Loading recipe...</p>
          </div>
        )}

        {/* Single Step View */}
        {!loading && currentStep && (
          <div className="space-y-6">
            {/* Step Navigation Header */}
            <div className="flex flex-col sm:flex-row items-center sm:justify-between bg-surface rounded-2xl shadow-md p-4 sm:p-6 border border-borderColor-light gap-3">
              {/* Prev button: icon only on small screens to save space */}
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousStep}
                disabled={currentStepIndex === 0}
                aria-label={language === 'ru' ? 'Назад' : 'Previous'}
                className="gap-2 rounded-xl border-2 px-3 py-2 sm:px-4 sm:py-2 hover:bg-primary-50 hover:border-primary-300 active:scale-[0.98] transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{language === 'ru' ? 'Назад' : 'Previous'}</span>
              </Button>

              {/* Center area: allow wrapping and center alignment on small screens */}
              <div className="flex-1 text-center flex flex-col items-center">
                <p className="text-sm text-text-secondary font-medium">
                  {language === 'ru' ? 'Шаг' : 'Step'} {currentStepIndex + 1} {language === 'ru' ? 'из' : 'of'} {steps.length}
                </p>
                <div className="flex gap-1 mt-3 flex-wrap justify-center">
                  {steps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentStepIndex(idx);
                        setCurrentStep(idx);
                      }}
                      aria-label={`${language === 'ru' ? 'Перейти к шагу' : 'Go to step'} ${idx + 1}`}
                      className={`rounded-full transition-all duration-300 cursor-pointer hover:scale-125 ${
                        idx === currentStepIndex
                          ? 'bg-primary-500 ring-4 ring-primary-100 scale-110 h-2.5 w-2.5 sm:h-2.5 sm:w-2.5'
                          : progress.completedSteps.includes(steps[idx].id)
                          ? 'bg-success h-2.5 w-2.5 sm:h-2.5 sm:w-2.5 hover:bg-success-dark'
                          : 'bg-borderColor h-2 w-2 sm:h-2.5 sm:w-2.5 hover:bg-borderColor-dark'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Next button: icon only on small screens to save space */}
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextStep}
                disabled={currentStepIndex === steps.length - 1}
                aria-label={language === 'ru' ? 'Вперёд' : 'Next'}
                className="gap-2 rounded-xl border-2 px-3 py-2 sm:px-4 sm:py-2 hover:bg-primary-50 hover:border-primary-300 active:scale-[0.98] transition-all"
              >
                <span className="hidden sm:inline">{language === 'ru' ? 'Вперёд' : 'Next'}</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Current Step Content with Swipe Gestures */}
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(event, info) => {
                // Swipe threshold: 50 pixels
                const swipeThreshold = 50;
                const swipeVelocityThreshold = 500;
                
                // Swipe left (next step)
                if (info.offset.x < -swipeThreshold || info.velocity.x < -swipeVelocityThreshold) {
                  if (currentStepIndex < steps.length - 1) {
                    goToNextStep();
                  }
                }
                // Swipe right (previous step)
                else if (info.offset.x > swipeThreshold || info.velocity.x > swipeVelocityThreshold) {
                  if (currentStepIndex > 0) {
                    goToPreviousStep();
                  }
                }
              }}
              style={{ touchAction: 'pan-y' }} // Allow vertical scrolling
            >
              <StepCard
                step={currentStep}
                stepNumber={currentStepIndex + 1}
                isCompleted={isCurrentStepCompleted}
                isActive={true}
                language={language}
                onStepClick={() => {}}
                onToggleComplete={() => handleToggleComplete(currentStep.id)}
              />
              {/* Feed Starter button for Step 1 */}
              {currentStep.id === 1 && (
                <div className="flex justify-center">
                  <Link href="/dashboard/feed" className="inline-block">
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="w-auto min-w-[200px] sm:w-64 md:w-72 gap-2 rounded-xl shadow-md bg-primary-500 hover:bg-primary-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                      aria-label={language === 'ru' ? 'Покормить Закваску' : 'Feed Starter'}
                    >
                      <Sprout className="h-5 w-5" />
                      {language === 'ru' ? 'Покормить Закваску' : 'Feed Starter'}
                    </Button>
                  </Link>
                </div>
              )}

              {/* Timer controls */}
              {hasTimer && currentTimer && (
                <TimerControl
                  stepId={currentStep.id}
                  stepTitle={language === 'ru' ? currentStep.title_ru : currentStep.title_en}
                  stepNumber={currentStepIndex + 1}
                  totalSeconds={currentTimer.totalSeconds}
                  remainingSeconds={currentTimer.remainingSeconds}
                  isRunning={currentTimer.isRunning}
                  isCompleted={currentTimer.isCompleted}
                  onStart={() => startTimer(currentStep.id)}
                  onPause={() => pauseTimer(currentStep.id)}
                  onReset={() => resetTimer(currentStep.id)}
                  onTick={() => tickTimer(currentStep.id)}
                  onComplete={() => handleTimerComplete(currentStep.id)}
                  hasMaxDuration={
                    currentStep.duration_min_seconds != null &&
                    currentStep.duration_max_seconds != null &&
                    currentStep.duration_min_seconds !== currentStep.duration_max_seconds
                  }
                  maxSeconds={currentStep.duration_max_seconds}
                  useMaxDuration={currentTimer.useMaxDuration}
                  onToggleDuration={() => toggleDuration(currentStep.id, currentStep.duration_max_seconds!)}
                  language={language}
                />
              )}

            </motion.div>

            {/* Quick Jump to Steps */}
            <div className="mt-8 bg-surface rounded-2xl shadow-md p-6 border border-borderColor-light">
              <h3 className="font-display font-semibold mb-4 text-base text-text-primary">
                {language === 'ru' ? 'Быстрый переход' : 'Quick Jump'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {steps.map((step, idx) => {
                  const isCompleted = progress.completedSteps.includes(step.id);
                  const isCurrent = idx === currentStepIndex;
                  
                  return (
                    <Button
                      key={step.id}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentStepIndex(idx);
                        setCurrentStep(idx);
                      }}
                      className={`relative rounded-xl transition-all duration-300 font-medium hover:scale-[1.02] active:scale-[0.98] ${
                        isCurrent 
                          ? 'bg-primary-500 text-white hover:bg-primary-600 border-primary-600 shadow-md scale-105' 
                          : isCompleted 
                          ? 'bg-success-light text-success hover:bg-success-light hover:border-success border-success/30 shadow-sm' 
                          : 'hover:bg-primary-50 hover:border-primary-300 border-borderColor'
                      }`}
                    >
                      {isCompleted && !isCurrent && (
                        <Check className="h-3.5 w-3.5 absolute -top-1 -right-1 text-success bg-success-light rounded-full p-0.5 border border-success" />
                      )}
                      <span className="font-display">{language === 'ru' ? 'Шаг' : 'Step'} {idx + 1}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
