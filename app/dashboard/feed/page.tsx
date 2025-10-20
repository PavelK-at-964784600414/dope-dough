'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopNav } from '@/components/design-system/TopNav';
import { BottomTab } from '@/components/design-system/BottomTab';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { Input } from '@/components/design-system/Input';
import { StarterJar } from '@/components/design-system/StarterJar';
import { Timeline, TimelineStep } from '@/components/design-system/Timeline';
import { TimerControl } from '@/components/TimerControl';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { useTimer } from '@/hooks/useTimer';
import { playNotificationSound } from '@/lib/audioUtils';

const getFeedSteps = (language: 'en' | 'ru') => {
  const steps = {
    en: [
      {
        id: 'discard',
        title: 'Discard starter',
        description: 'Remove all but ½ tsp (2-3g) of your starter. Save discards for recipes!',
        icon: '🥄',
      },
      {
        id: 'water',
        title: 'Add water',
        description: 'Add 20g of room temperature filtered water to the jar',
        icon: '💧',
      },
      {
        id: 'flour',
        title: 'Add flour',
        description: 'Add 20g of bread flour (or 10g bread + 10g whole wheat)',
        icon: '🌾',
      },
      {
        id: 'mix',
        title: 'Mix thoroughly',
        description: 'Stir well until completely combined. Scrape down the sides.',
        icon: '🥣',
      },
      {
        id: 'store',
        title: 'Store properly',
        description: 'Cover loosely and store at room temp (~72°F) for 4-8 hours, then refrigerate',
        icon: '🏺',
      },
    ],
    ru: [
      {
        id: 'discard',
        title: 'Удалите закваску',
        description: 'Оставьте только ½ ч.л. (2-3г) закваски. Сохраните остатки для рецептов!',
        icon: '🥄',
      },
      {
        id: 'water',
        title: 'Добавьте воду',
        description: 'Добавьте 20г фильтрованной воды комнатной температуры в банку',
        icon: '💧',
      },
      {
        id: 'flour',
        title: 'Добавьте муку',
        description: 'Добавьте 20г хлебной муки (или 10г хлебной + 10г цельнозерновой)',
        icon: '🌾',
      },
      {
        id: 'mix',
        title: 'Тщательно перемешайте',
        description: 'Хорошо перемешайте до полного объединения. Очистите стенки.',
        icon: '🥣',
      },
      {
        id: 'store',
        title: 'Храните правильно',
        description: 'Неплотно накройте и храните при комнатной температуре (~22°C) 4-8 часов, затем в холодильник',
        icon: '🏺',
      },
    ]
  };
  return steps[language];
};

const translations = {
  en: {
    pageTitle: 'Feed Your Starter',
    pageSubtitle: (name: string) => `Follow these steps to keep ${name} healthy and active`,
    stepOf: (current: number, total: number) => `Step ${current} of ${total}`,
    starterDetails: 'Starter Details',
    starterDetailsDesc: 'Record feeding information',
    starterName: 'Starter Name',
    waterAmount: 'Water Amount (g)',
    flourAmount: 'Flour Amount (g)',
    notes: 'Notes',
    notesPlaceholder: 'Optional notes about this feeding...',
    timeline: 'Feeding Timeline',
    trackProgress: 'Track your feeding progress',
    previous: 'Previous',
    next: 'Next',
    complete: 'Complete Feeding',
    visualGuide: 'Visual Guide',
    yourStarter: 'Your starter after feeding',
    proTip: 'Pro Tip',
    feedingProcess: 'Feeding Process',
    waitTimer: 'Wait Timer',
    waitTimerDesc: 'Track the fermentation time',
    tips: [
      'Use filtered water if your tap water has chlorine - it can slow fermentation.',
      'Room temperature ingredients mix better and are gentler on your starter.',
      'Make sure no dry flour remains. Consistency should be like thick pancake batter.',
      'Starter should double in 4-8 hours at 72°F. If not, try a warmer spot!'
    ]
  },
  ru: {
    pageTitle: 'Покормите Закваску',
    pageSubtitle: (name: string) => `Следуйте этим шагам, чтобы ${name} была здоровой и активной`,
    stepOf: (current: number, total: number) => `Шаг ${current} из ${total}`,
    starterDetails: 'Детали Закваски',
    starterDetailsDesc: 'Запишите информацию о кормлении',
    starterName: 'Имя Закваски',
    waterAmount: 'Количество Воды (г)',
    flourAmount: 'Количество Муки (г)',
    notes: 'Заметки',
    notesPlaceholder: 'Дополнительные заметки об этом кормлении...',
    timeline: 'График Кормления',
    trackProgress: 'Отслеживайте прогресс кормления',
    previous: 'Назад',
    next: 'Далее',
    complete: 'Завершить Кормление',
    visualGuide: 'Визуальный Гид',
    yourStarter: 'Ваша закваска после кормления',
    proTip: 'Совет',
    feedingProcess: 'Процесс Кормления',
    waitTimer: 'Таймер Ожидания',
    waitTimerDesc: 'Отслеживайте время ферментации',
    tips: [
      'Используйте фильтрованную воду, если в водопроводной есть хлор - он может замедлить ферментацию.',
      'Ингредиенты комнатной температуры лучше смешиваются и более щадящи для закваски.',
      'Убедитесь, что не осталось сухой муки. Консистенция должна быть как у густого блинного теста.',
      'Закваска должна удвоиться за 4-8 часов при 22°C. Если нет, попробуйте более теплое место!'
    ]
  }
};

export default function FeedStarterPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const globalTimer = useTimer();
  
  const [currentStep, setCurrentStep] = React.useState(0);
  const [starterName, setStarterName] = React.useState('Bubbles');
  const [waterAmount, setWaterAmount] = React.useState('20');
  const [flourAmount, setFlourAmount] = React.useState('20');
  const [notes, setNotes] = React.useState('');
  const [isCompleting, setIsCompleting] = React.useState(false);

  // Timer state for step 5 (4-8 hours wait)
  const WAIT_TIME_MIN = 4 * 60 * 60; // 4 hours in seconds
  const WAIT_TIME_MAX = 8 * 60 * 60; // 8 hours in seconds
  const [useMaxDuration, setUseMaxDuration] = React.useState(false);
  
  // Local state for UI updates
  const [localRemainingSeconds, setLocalRemainingSeconds] = React.useState(WAIT_TIME_MIN);

  // Calculate completion state
  const isTimerCompleted = localRemainingSeconds === 0 && !globalTimer.isActive;

  // Initialize local state from global timer on mount
  React.useEffect(() => {
    const remaining = globalTimer.getRemainingSeconds();
    if (remaining > 0 && globalTimer.isActive) {
      // Resume existing active timer
      setLocalRemainingSeconds(remaining);
    } else if (!globalTimer.isActive && remaining === 0) {
      // Timer was completed, reset to default
      setLocalRemainingSeconds(WAIT_TIME_MIN);
    } else {
      // Reset to default if no active timer
      setLocalRemainingSeconds(WAIT_TIME_MIN);
    }
  }, [globalTimer, WAIT_TIME_MIN]);

  // Sync local state with global timer
  React.useEffect(() => {
    const interval = setInterval(() => {
      const remaining = globalTimer.getRemainingSeconds();
      setLocalRemainingSeconds(remaining);
      
      if (globalTimer.isActive && remaining === 0) {
        globalTimer.pauseTimer(0);
        playNotificationSound().catch(console.error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [globalTimer]);

  const timerTotalSeconds = useMaxDuration ? WAIT_TIME_MAX : WAIT_TIME_MIN;

  const FEED_STEPS = getFeedSteps(language);

  const timelineSteps: TimelineStep[] = FEED_STEPS.map((step, index) => ({
    ...step,
    time: '',
    status:
      index < currentStep
        ? 'completed'
        : index === currentStep
        ? 'active'
        : 'upcoming',
  }));

  const handleNext = () => {
    if (currentStep < FEED_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Would save to database in production
    router.push('/dashboard');
  };

  // Timer handlers
  const handleTimerStart = () => {
    globalTimer.startTimer(timerTotalSeconds);
  };

  const handleTimerPause = () => {
    globalTimer.pauseTimer(localRemainingSeconds);
  };

  const handleTimerReset = () => {
    globalTimer.resetTimer();
    setLocalRemainingSeconds(timerTotalSeconds);
  };

  const handleTimerTick = () => {
    // Handled by the global timer's getRemainingSeconds
  };

  const handleTimerComplete = async () => {
    globalTimer.pauseTimer(0);
    
    // Play bell sound
    try {
      await playNotificationSound();
    } catch (error) {
      console.error('Failed to play notification sound:', error);
    }
  };

  const handleToggleDuration = () => {
    const newUseMax = !useMaxDuration;
    setUseMaxDuration(newUseMax);
    const newDuration = newUseMax ? WAIT_TIME_MAX : WAIT_TIME_MIN;
    globalTimer.resetTimer();
    setLocalRemainingSeconds(newDuration);
  };

  const currentStepData = FEED_STEPS[currentStep];
  const progress = ((currentStep + 1) / FEED_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-warmBg pb-20 md:pb-0">
      <TopNav />

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
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
          <div>
            <h1 className="font-display text-3xl font-bold text-text-primary">
              {t.pageTitle}
            </h1>
            <p className="text-text-secondary mt-1">
              {t.pageSubtitle(starterName)}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">
              {t.stepOf(currentStep + 1, FEED_STEPS.length)}
            </span>
            <span className="font-medium text-primary-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-borderColor-light overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Current Step Details */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="elevated" padding="lg">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{currentStepData.icon}</div>
                    <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
                      {currentStepData.title}
                    </h2>
                    <p className="text-text-secondary text-lg">
                      {currentStepData.description}
                    </p>
                  </div>

                  {/* Input fields for specific steps */}
                  {currentStep === 1 && (
                    <div className="space-y-4 mb-6">
                      <Input
                        label={t.waterAmount}
                        type="number"
                        value={waterAmount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWaterAmount(e.target.value)}
                        helperText={language === 'en' ? 'Recommended: 20g' : 'Рекомендуется: 20г'}
                      />
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4 mb-6">
                      <Input
                        label={t.flourAmount}
                        type="number"
                        value={flourAmount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFlourAmount(e.target.value)}
                        helperText={language === 'en' ? 'Recommended: 20g bread flour' : 'Рекомендуется: 20г хлебной муки'}
                      />
                    </div>
                  )}

                  {currentStep === FEED_STEPS.length - 1 && (
                    <div className="space-y-4 mb-6">
                      <Input
                        label={t.notes}
                        placeholder={t.notesPlaceholder}
                        value={notes}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotes(e.target.value)}
                        helperText={language === 'en' ? 'Note the temperature, smell, or activity level' : 'Запишите температуру, запах или уровень активности'}
                      />
                    </div>
                  )}

                  {/* Timer for step 5 (waiting period) */}
                  {currentStep === FEED_STEPS.length - 1 && (
                    <div className="mb-6">
                      <TimerControl
                        stepId={5}
                        totalSeconds={timerTotalSeconds}
                        remainingSeconds={localRemainingSeconds}
                        isRunning={globalTimer.isActive}
                        isCompleted={isTimerCompleted}
                        onStart={handleTimerStart}
                        onPause={handleTimerPause}
                        onReset={handleTimerReset}
                        onTick={handleTimerTick}
                        onComplete={handleTimerComplete}
                        hasMaxDuration={true}
                        maxSeconds={WAIT_TIME_MAX}
                        useMaxDuration={useMaxDuration}
                        onToggleDuration={handleToggleDuration}
                      />
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      className="flex-1"
                    >
                      {t.previous}
                    </Button>
                    {currentStep < FEED_STEPS.length - 1 ? (
                      <Button
                        variant="primary"
                        onClick={handleNext}
                        className="flex-1"
                      >
                        {t.next}
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={handleComplete}
                        isLoading={isCompleting}
                        className="flex-1"
                      >
                        {t.complete}
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Tips Card */}
            <Card variant="soft">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div>
                    <CardTitle className="text-lg">{t.proTip}</CardTitle>
                    <CardDescription className="mt-2">
                      {currentStep === 0 && t.tips[0]}
                      {currentStep === 1 && t.tips[1]}
                      {currentStep === 2 && t.tips[1]}
                      {currentStep === 3 && t.tips[2]}
                      {currentStep === 4 && t.tips[3]}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Right: Visual & Timeline */}
          <div className="space-y-6">
            {/* Starter visualization */}
            <Card className="flex justify-center py-8">
              <StarterJar
                level={30 + currentStep * 15}
                isActive={currentStep >= 3}
                isFed={currentStep === FEED_STEPS.length - 1}
                size="lg"
              />
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.feedingProcess}</CardTitle>
              </CardHeader>
              <CardContent>
                <Timeline steps={timelineSteps} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <BottomTab />
    </div>
  );
}
