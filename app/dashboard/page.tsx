'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { TopNav } from '@/components/design-system/TopNav';
import { BottomTab } from '@/components/design-system/BottomTab';
import { RecipeCard } from '@/components/design-system/RecipeCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/design-system/Card';
import { StarterJar } from '@/components/design-system/StarterJar';
import { Button } from '@/components/design-system/Button';
import { Timeline, TimelineStep } from '@/components/design-system/Timeline';
import { Footer } from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { useTimer } from '@/hooks/useTimer';
import { useRecipeStore } from '@/store/useRecipeStore';
import { RecipeStep } from '@/lib/parseRecipe';
import { formatDuration } from '@/lib/parseRecipe';
import { playNotificationSound } from '@/lib/audioUtils';

const translations = {
  en: {
    welcomeBack: "Welcome back, Sarah! 👋",
    welcomeDesc: "Your sourdough starter is active and ready. Time to bake something delicious!",
    continueRecipe: "Continue Recipe",
    viewLog: "View Log",
    yourStarter: "Your Starter",
    starterName: "Bubbles (your starter)",
    lastFed: "Last fed 6 hours ago • Feeding ratio 1:2:2",
    activity: "Activity",
    activityHigh: "High",
    readyIn: "Ready in",
    readyTime: "~2 hrs",
    feedNow: "Feed Now",
    viewHistory: "View History",
    activeRecipe: "Active Recipe",
    activeTimer: "Active Timer",
    timerRunning: "Starter fermentation in progress",
    timeRemaining: "Time remaining",
    viewTimer: "View Timer",
    noActiveTimer: "No active timer",
    viewAll: "View All →",
    recentActivity: "Recent Activity",
    quickActions: "Quick Actions",
    recipeTitle: "Classic Sourdough Bread",
    recipeDescription: "A traditional sourdough loaf with a crispy crust and tangy flavor",
    recipePrepTime: "~33 hours",
    recentSteps: {
      step1Title: "Mixed ingredients",
      step1Desc: "Combined flour, water, and starter",
      step1Time: "2 hours ago",
      step2Title: "Autolyse complete",
      step2Desc: "Dough has rested",
      step2Time: "30 min ago",
      step3Title: "First fold",
      step3Desc: "Performing coil folds",
      step3Time: "In progress"
    }
  },
  ru: {
    welcomeBack: "С возвращением, Сара! 👋",
    welcomeDesc: "Ваша закваска активна и готова. Время испечь что-нибудь вкусное!",
    continueRecipe: "Продолжить Рецепт",
    viewLog: "Посмотреть Журнал",
    yourStarter: "Ваша Закваска",
    starterName: "Пузырьки (ваша закваска)",
    lastFed: "Последнее кормление 6 часов назад • Соотношение 1:2:2",
    activity: "Активность",
    activityHigh: "Высокая",
    readyIn: "Готова через",
    readyTime: "~2 часа",
    feedNow: "Покормить",
    viewHistory: "История",
    activeRecipe: "Активный Рецепт",
    activeTimer: "Активный Таймер",
    timerRunning: "Идет ферментация закваски",
    timeRemaining: "Осталось времени",
    viewTimer: "Посмотреть Таймер",
    noActiveTimer: "Нет активного таймера",
    viewAll: "Все →",
    recentActivity: "Последняя Активность",
    quickActions: "Быстрые Действия",
    recipeTitle: "Классический Хлеб на Закваске",
    recipeDescription: "Традиционный хлеб на закваске с хрустящей корочкой и пикантным вкусом",
    recipePrepTime: "~33 часа",
    recentSteps: {
      step1Title: "Смешаны ингредиенты",
      step1Desc: "Соединены мука, вода и закваска",
      step1Time: "2 часа назад",
      step2Title: "Автолиз завершен",
      step2Desc: "Тесто отдохнуло",
      step2Time: "30 мин назад",
      step3Title: "Первая складка",
      step3Desc: "Выполняются спиральные складки",
      step3Time: "В процессе"
    }
  }
};

export default function DesignHomePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const globalTimer = useTimer();
  const { progress, timers: recipeTimers, pauseTimer: pauseRecipeTimer } = useRecipeStore();
  
  const [starterLevel, setStarterLevel] = React.useState(65);
  const [isStarterActive, setIsStarterActive] = React.useState(true);
  const [remainingSeconds, setRemainingSeconds] = React.useState(0);
  const [recipeTimerRemaining, setRecipeTimerRemaining] = React.useState(0);
  const [activeRecipeStepId, setActiveRecipeStepId] = React.useState<number | null>(null);
  const [recipeSteps, setRecipeSteps] = React.useState<RecipeStep[]>([]);
  
  // Track which timers we've already notified for (to avoid repeating the sound)
  const [notifiedFeedTimer, setNotifiedFeedTimer] = React.useState(false);
  const [notifiedRecipeTimers, setNotifiedRecipeTimers] = React.useState<Set<number>>(new Set());

  // Load recipe steps to get real activity
  React.useEffect(() => {
    async function loadRecipe() {
      try {
        const response = await fetch('/recipe.json');
        const data = await response.json();
        if (data.steps && Array.isArray(data.steps)) {
          setRecipeSteps(data.steps);
        }
      } catch (error) {
        console.error('Failed to load recipe:', error);
      }
    }
    loadRecipe();
  }, []);

  // Update timer display every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      // Update feed timer
      const feedRemaining = globalTimer.getRemainingSeconds();
      setRemainingSeconds(feedRemaining);
      
      // Check if feed timer just completed
      if (globalTimer.isActive && feedRemaining === 0 && !notifiedFeedTimer) {
        playNotificationSound().catch(console.error);
        setNotifiedFeedTimer(true);
        globalTimer.pauseTimer(0);
      }
      
      // Reset notification flag if timer is reset or not active
      if (!globalTimer.isActive || feedRemaining > 5) {
        setNotifiedFeedTimer(false);
      }
      
      // Check for active recipe timers
      const activeRecipeTimer = Object.values(recipeTimers).find(timer => timer.isRunning);
      if (activeRecipeTimer) {
        setActiveRecipeStepId(activeRecipeTimer.stepId);
        // Calculate remaining time for recipe timer
        if (activeRecipeTimer.startTime) {
          const elapsed = (Date.now() - activeRecipeTimer.startTime) / 1000;
          const remaining = Math.max(0, activeRecipeTimer.totalSeconds - elapsed);
          setRecipeTimerRemaining(remaining);
          
          // Check if recipe timer just completed
          if (remaining === 0 && !notifiedRecipeTimers.has(activeRecipeTimer.stepId)) {
            playNotificationSound().catch(console.error);
            pauseRecipeTimer(activeRecipeTimer.stepId);
            setNotifiedRecipeTimers(prev => new Set(prev).add(activeRecipeTimer.stepId));
          }
          
          // Reset notification flag if timer has significant time remaining
          if (remaining > 5 && notifiedRecipeTimers.has(activeRecipeTimer.stepId)) {
            setNotifiedRecipeTimers(prev => {
              const newSet = new Set(prev);
              newSet.delete(activeRecipeTimer.stepId);
              return newSet;
            });
          }
        } else {
          setRecipeTimerRemaining(activeRecipeTimer.remainingSeconds);
        }
      } else {
        setActiveRecipeStepId(null);
        setRecipeTimerRemaining(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [globalTimer, recipeTimers, notifiedFeedTimer, notifiedRecipeTimers, pauseRecipeTimer]);

  // Generate real recent activity from recipe progress
  const recentSteps: TimelineStep[] = React.useMemo(() => {
    if (recipeSteps.length === 0) {
      // Fallback to placeholder if recipe not loaded yet
      return [
        {
          id: '1',
          title: t.recentSteps.step1Title,
          description: t.recentSteps.step1Desc,
          time: t.recentSteps.step1Time,
          status: 'completed',
        },
        {
          id: '2',
          title: t.recentSteps.step2Title,
          description: t.recentSteps.step2Desc,
          time: t.recentSteps.step2Time,
          status: 'completed',
        },
        {
          id: '3',
          title: t.recentSteps.step3Title,
          description: t.recentSteps.step3Desc,
          time: t.recentSteps.step3Time,
          status: 'active',
        },
      ];
    }

    // Get completed steps
    const completedStepIds = progress.completedSteps;
    const currentStepId = recipeSteps[progress.currentStepIndex]?.id;
    
    // Get the last 3 completed steps + current step
    const recentCompleted = completedStepIds
      .slice(-2) // Last 2 completed
      .map(stepId => {
        const step = recipeSteps.find(s => s.id === stepId);
        if (!step) return null;
        
        const title = language === 'ru' ? step.title_ru : step.title_en;
        const description = language === 'ru' ? step.instruction_ru : step.instruction_en;
        
        return {
          id: step.id.toString(),
          title,
          description: description.substring(0, 60) + '...',
          time: language === 'ru' ? 'Завершено' : 'Completed',
          status: 'completed' as const,
        };
      })
      .filter(Boolean) as TimelineStep[];

    // Add current step if exists
    const currentStep = recipeSteps[progress.currentStepIndex];
    if (currentStep) {
      const title = language === 'ru' ? currentStep.title_ru : currentStep.title_en;
      const description = language === 'ru' ? currentStep.instruction_ru : currentStep.instruction_en;
      
      recentCompleted.push({
        id: currentStep.id.toString(),
        title,
        description: description.substring(0, 60) + '...',
        time: language === 'ru' ? 'В процессе' : 'In progress',
        status: completedStepIds.includes(currentStep.id) ? 'completed' : 'active',
      });
    }

    // If no completed steps yet, show upcoming steps
    if (recentCompleted.length === 0) {
      return recipeSteps.slice(0, 3).map((step, idx) => {
        const title = language === 'ru' ? step.title_ru : step.title_en;
        const description = language === 'ru' ? step.instruction_ru : step.instruction_en;
        
        return {
          id: step.id.toString(),
          title,
          description: description.substring(0, 60) + '...',
          time: idx === 0 ? (language === 'ru' ? 'Следующий' : 'Next') : '',
          status: idx === 0 ? 'active' as const : 'upcoming' as const,
        };
      });
    }

    return recentCompleted;
  }, [recipeSteps, progress, language, t]);

  return (
    <div className="min-h-screen bg-warmBg pb-20 md:pb-0">
      <TopNav />

      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Starter Status */}
        <section>
          <h2 className="font-display text-2xl font-bold text-text-primary mb-6">
            {t.yourStarter}
          </h2>
          <Card variant="glass" padding="lg">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <StarterJar
                level={starterLevel}
                isActive={isStarterActive}
                size="lg"
              />
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-text-primary">
                    {t.starterName}
                  </h3>
                  <p className="text-text-secondary mt-1">
                    {t.lastFed}
                  </p>
                </div>
                <div className={`grid gap-4 ${(globalTimer.isActive || remainingSeconds > 0) || (activeRecipeStepId !== null && recipeTimerRemaining > 0) ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  <div className="rounded-xl bg-success-light border border-success/20 p-4">
                    <p className="text-sm text-text-secondary">{t.activity}</p>
                    <p className="text-2xl font-display font-semibold text-success">
                      {t.activityHigh}
                    </p>
                  </div>
                  {((globalTimer.isActive || remainingSeconds > 0) || (activeRecipeStepId !== null && recipeTimerRemaining > 0)) && (
                    <div className="rounded-xl bg-primary-50 border border-primary-200 p-4">
                      <p className="text-sm text-text-secondary">{t.readyIn}</p>
                      <p className="text-2xl font-display font-semibold text-primary-600">
                        {(() => {
                          // Show the timer with less time remaining (most urgent)
                          const hasRecipeTimer = activeRecipeStepId !== null && recipeTimerRemaining > 0;
                          const hasFeedTimer = (globalTimer.isActive || remainingSeconds > 0);
                          
                          if (hasRecipeTimer && hasFeedTimer) {
                            // Both active - show the one with less time
                            return formatDuration(Math.min(recipeTimerRemaining, remainingSeconds));
                          } else if (hasRecipeTimer) {
                            return formatDuration(recipeTimerRemaining);
                          } else {
                            return formatDuration(remainingSeconds);
                          }
                        })()}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    onClick={() => router.push('/dashboard/feed')}
                  >
                    {t.feedNow}
                  </Button>
                  <Button variant="ghost" onClick={() => router.push('/dashboard/log')}>
                    {t.viewHistory}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Active Timers */}
        {((globalTimer.isActive || remainingSeconds > 0) || (activeRecipeStepId !== null && recipeTimerRemaining > 0)) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="font-display text-2xl font-bold text-text-primary mb-6">
              {(globalTimer.isActive || remainingSeconds > 0) && (activeRecipeStepId !== null && recipeTimerRemaining > 0)
                ? (language === 'en' ? 'Active Timers' : 'Активные Таймеры')
                : t.activeTimer}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Recipe Timer */}
              {activeRecipeStepId !== null && recipeTimerRemaining > 0 && (
                <Card variant="elevated" padding="lg" className="border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-white">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                        <svg
                          className="w-10 h-10 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 text-center">
                      <h3 className="font-display text-lg font-semibold text-text-primary mb-1">
                        {language === 'en' 
                          ? `Recipe Step ${activeRecipeStepId}` 
                          : `Шаг рецепта ${activeRecipeStepId}`}
                      </h3>
                      <p className="text-sm text-text-secondary mb-3">
                        {t.timeRemaining}
                      </p>
                      <div className="text-3xl font-bold text-primary-600 font-display mb-3">
                        {formatDuration(recipeTimerRemaining)}
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => router.push('/recipe')}
                        className="rounded-xl"
                      >
                        {t.viewTimer}
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Feed Timer */}
              {(globalTimer.isActive || remainingSeconds > 0) && (
                <Card variant="elevated" padding="lg" className="border-2 border-secondary-200 bg-gradient-to-br from-secondary-50 to-white">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center shadow-lg">
                        <svg
                          className="w-10 h-10 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 text-center">
                      <h3 className="font-display text-lg font-semibold text-text-primary mb-1">
                        {t.timerRunning}
                      </h3>
                      <p className="text-sm text-text-secondary mb-3">
                        {t.timeRemaining}
                      </p>
                      <div className="text-3xl font-bold text-secondary-600 font-display mb-3">
                        {formatDuration(remainingSeconds)}
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => router.push('/dashboard/feed')}
                        className="rounded-xl"
                      >
                        {t.viewTimer}
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </motion.section>
        )}

        {/* Active Recipe */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-text-primary">
              {t.activeRecipe}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/recipe')}
            >
              {t.viewAll}
            </Button>
          </div>
          <RecipeCard
            title={t.recipeTitle}
            description={t.recipeDescription}
            prepTime={t.recipePrepTime}
            difficulty="Medium"
            steps={16}
            isActive
            onStart={() => router.push('/recipe')}
            onView={() => router.push('/recipe')}
          />
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="font-display text-2xl font-bold text-text-primary mb-6">
            {t.recentActivity}
          </h2>
          <Card>
            <CardContent>
              <Timeline steps={recentSteps} />
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="font-display text-2xl font-bold text-text-primary mb-6">
            {t.quickActions}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card variant="soft" interactive className="group">
              <CardHeader>
                <div className="mb-3 text-primary-600 group-hover:scale-110 transition-transform">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="13" r="8" />
                    <path d="M12 9v4l2 2" />
                    <path d="m16.2 7.8 1.8-1.8" />
                    <path d="M9 2h6" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Set Timer</CardTitle>
                <CardDescription>Start a bulk fermentation timer</CardDescription>
              </CardHeader>
            </Card>

            <Card 
              variant="soft" 
              interactive 
              className="group cursor-pointer"
              onClick={() => router.push('/dashboard/notes')}
            >
              <CardHeader>
                <div className="mb-3 text-secondary-400 group-hover:scale-110 transition-transform">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Add Note</CardTitle>
                <CardDescription>Log feeding or baking notes</CardDescription>
              </CardHeader>
            </Card>

            <Card variant="soft" interactive className="group">
              <CardHeader>
                <div className="mb-3 text-accentMuted group-hover:scale-110 transition-transform">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 3h5v5" />
                    <path d="M8 3H3v5" />
                    <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
                    <path d="m15 9 6-6" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Browse Recipes</CardTitle>
                <CardDescription>Explore new sourdough recipes</CardDescription>
              </CardHeader>
            </Card>

            <Card 
              variant="soft" 
              interactive 
              className="group cursor-pointer"
              onClick={() => router.push('/dashboard/starter-guide')}
            >
              <CardHeader>
                <div className="mb-3 text-secondary-500 group-hover:scale-110 transition-transform">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 20h10" />
                    <path d="M10 20c5.5-2.5.8-6.4 3-10" />
                    <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
                    <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Starter Guide</CardTitle>
                <CardDescription>Learn to create your starter</CardDescription>
              </CardHeader>
            </Card>

            <Card 
              variant="soft" 
              interactive 
              className="group cursor-pointer"
              onClick={() => router.push('/dashboard/tips')}
            >
              <CardHeader>
                <div className="mb-3 text-primary-600 group-hover:scale-110 transition-transform">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Tips & Help</CardTitle>
                <CardDescription>Get sourdough baking tips</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
      <BottomTab />
    </div>
  );
}
