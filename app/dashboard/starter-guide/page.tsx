'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopNav } from '@/components/design-system/TopNav';
import { BottomTab } from '@/components/design-system/BottomTab';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { Timeline, TimelineStep } from '@/components/design-system/Timeline';
import { StarterJar } from '@/components/design-system/StarterJar';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Check, Sprout, Droplet, Wheat } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const getStarterGuideDays = (language: 'en' | 'ru') => {
  const days = {
    en: [
      {
        day: 1,
        title: 'Day 1: Begin Your Starter',
        steps: [
          '50g whole wheat or rye flour',
          '50g lukewarm water (75-80°F)',
          'Mix in a clean jar',
          'Cover loosely with cloth',
          'Store at room temperature (70-75°F)'
        ],
        tip: 'Use filtered or spring water. Chlorine in tap water can inhibit fermentation.',
        expectedActivity: 'Little to no activity visible',
        jarLevel: 20,
      },
      {
        day: 2,
        title: 'Day 2: First Feeding',
        steps: [
          'Discard half of the mixture (25g)',
          'Add 25g flour (white or whole wheat)',
          'Add 25g lukewarm water',
          'Mix well and cover loosely',
        ],
        tip: 'You might see some bubbles forming. This is a good sign!',
        expectedActivity: 'Small bubbles may appear',
        jarLevel: 30,
      },
      {
        day: 3,
        title: 'Day 3: Building Activity',
        steps: [
          'Discard all but 25g of starter',
          'Add 50g flour',
          'Add 50g water',
          'Mix thoroughly',
          'Cover and wait'
        ],
        tip: 'The starter may smell funky (like nail polish or gym socks). This is normal and will pass!',
        expectedActivity: 'More bubbles, slight rise',
        jarLevel: 40,
      },
      {
        day: 4,
        title: 'Day 4: Increasing Activity',
        steps: [
          'Discard all but 25g',
          'Feed with 50g flour',
          'Feed with 50g water',
          'Mix and observe growth'
        ],
        tip: 'Start to notice the rise and fall cycle. It should double in 4-8 hours.',
        expectedActivity: 'Consistent bubbling, doubling in size',
        jarLevel: 55,
      },
      {
        day: 5,
        title: 'Day 5: Gaining Strength',
        steps: [
          'Continue daily feedings',
          'Discard all but 25g',
          'Add 50g flour + 50g water',
          'Look for predictable rise'
        ],
        tip: 'Your starter should smell pleasantly sour and yeasty, not unpleasant.',
        expectedActivity: 'Doubles within 4-6 hours',
        jarLevel: 70,
      },
      {
        day: 6,
        title: 'Day 6-7: Ready to Bake!',
        steps: [
          'Starter should double within 4-6 hours',
          'Pass the float test (drop spoonful in water)',
          'Smell should be pleasantly tangy',
          'Ready for your first bake!'
        ],
        tip: 'Congratulations! Your starter is mature and ready for baking.',
        expectedActivity: 'Consistent doubling, lots of bubbles',
        jarLevel: 85,
        isActive: true,
      },
    ],
    ru: [
      {
        day: 1,
        title: 'День 1: Начните Закваску',
        steps: [
          '50г цельнозерновой или ржаной муки',
          '50г теплой воды (24-27°C)',
          'Смешайте в чистой банке',
          'Неплотно накройте тканью',
          'Храните при комнатной температуре (21-24°C)'
        ],
        tip: 'Используйте фильтрованную или родниковую воду. Хлор в водопроводной воде может замедлить ферментацию.',
        expectedActivity: 'Почти нет видимой активности',
        jarLevel: 20,
      },
      {
        day: 2,
        title: 'День 2: Первое Кормление',
        steps: [
          'Удалите половину смеси (25г)',
          'Добавьте 25г муки (белой или цельнозерновой)',
          'Добавьте 25г теплой воды',
          'Хорошо перемешайте и неплотно накройте',
        ],
        tip: 'Вы можете увидеть пузырьки. Это хороший знак!',
        expectedActivity: 'Могут появиться маленькие пузырьки',
        jarLevel: 30,
      },
      {
        day: 3,
        title: 'День 3: Рост Активности',
        steps: [
          'Удалите всё, кроме 25г закваски',
          'Добавьте 50г муки',
          'Добавьте 50г воды',
          'Тщательно перемешайте',
          'Накройте и подождите'
        ],
        tip: 'Закваска может странно пахнуть (как жидкость для снятия лака или носки). Это нормально и пройдет!',
        expectedActivity: 'Больше пузырьков, небольшой подъем',
        jarLevel: 40,
      },
      {
        day: 4,
        title: 'День 4: Увеличение Активности',
        steps: [
          'Удалите всё, кроме 25г',
          'Покормите 50г муки',
          'Покормите 50г воды',
          'Перемешайте и наблюдайте за ростом'
        ],
        tip: 'Начните замечать цикл подъема и опадания. Должна удвоиться за 4-8 часов.',
        expectedActivity: 'Постоянное пузырение, удвоение размера',
        jarLevel: 55,
      },
      {
        day: 5,
        title: 'День 5: Набор Силы',
        steps: [
          'Продолжайте ежедневные кормления',
          'Удалите всё, кроме 25г',
          'Добавьте 50г муки + 50г воды',
          'Следите за предсказуемым подъемом'
        ],
        tip: 'Закваска должна приятно пахнуть кисло и дрожжами, не неприятно.',
        expectedActivity: 'Удваивается за 4-6 часов',
        jarLevel: 70,
      },
      {
        day: 6,
        title: 'День 6-7: Готова к Выпечке!',
        steps: [
          'Закваска должна удваиваться за 4-6 часов',
          'Пройдите тест плавучести (бросьте ложку в воду)',
          'Запах должен быть приятно кислым',
          'Готова для первой выпечки!'
        ],
        tip: 'Поздравляем! Ваша закваска зрелая и готова к выпечке.',
        expectedActivity: 'Постоянное удвоение, много пузырьков',
        jarLevel: 85,
        isActive: true,
      },
    ]
  };
  return days[language];
};

const translations = {
  en: {
    title: "Sourdough Starter Guide",
    subtitle: "Create your own sourdough starter from scratch in 5-7 days. Follow along day by day!",
    yourProgress: "Your Progress",
    trackProgress: "Track your starter's journey day by day",
    previousDay: "Previous Day",
    nextDay: "Next Day",
    dayOf: (current: number, total: number) => `Day ${current} of ${total}`,
    day: (n: number) => `Day ${n}`,
    expectedActivity: "Expected Activity:",
    steps: "Steps",
    proTip: "Pro Tip",
    flour: "Flour",
    water: "Water",
    viewVisual: "Visual Guide",
    whatToExpect: "What to Expect",
    bubbles: "Bubbles",
    activity: "Activity",
    growth: "Growth",
    currentTimeCurrent: "Current",
    currentTimeCompleted: "Completed",
    currentTimeUpcoming: "Upcoming"
  },
  ru: {
    title: "Гид по Закваске",
    subtitle: "Создайте свою закваску с нуля за 5-7 дней. Следуйте день за днем!",
    yourProgress: "Ваш Прогресс",
    trackProgress: "Отслеживайте путь вашей закваски день за днем",
    previousDay: "Предыдущий День",
    nextDay: "Следующий День",
    dayOf: (current: number, total: number) => `День ${current} из ${total}`,
    day: (n: number) => `День ${n}`,
    expectedActivity: "Ожидаемая Активность:",
    steps: "Шаги",
    proTip: "Совет",
    flour: "Мука",
    water: "Вода",
    viewVisual: "Визуальный Гид",
    whatToExpect: "Чего Ожидать",
    bubbles: "Пузырьки",
    activity: "Активность",
    growth: "Рост",
    currentTimeCurrent: "Текущий",
    currentTimeCompleted: "Завершен",
    currentTimeUpcoming: "Предстоящий"
  }
};

export default function StarterGuidePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const [currentDay, setCurrentDay] = React.useState(0);

  const STARTER_GUIDE_DAYS = getStarterGuideDays(language);
  const day = STARTER_GUIDE_DAYS[currentDay];
  const isFirstDay = currentDay === 0;
  const isLastDay = currentDay === STARTER_GUIDE_DAYS.length - 1;

  const timelineSteps: TimelineStep[] = STARTER_GUIDE_DAYS.map((d, idx) => ({
    id: `day-${d.day}`,
    title: t.day(d.day),
    description: d.title.split(': ')[1],
    time: idx === currentDay ? t.currentTimeCurrent : idx < currentDay ? t.currentTimeCompleted : t.currentTimeUpcoming,
    status: idx === currentDay ? 'active' : idx < currentDay ? 'completed' : 'upcoming',
  }));

  return (
    <div className="min-h-screen bg-warmBg pb-20 md:pb-0">
      <TopNav />

      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Back Button */}
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
              <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
                {t.title}
              </h1>
            </div>
          </div>
          
          {/* Icon and Subtitle */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 mb-4 shadow-md">
              <Sprout className="h-8 w-8 text-white" />
            </div>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>
        </motion.div>

        {/* Timeline Progress */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-xl">{t.yourProgress}</CardTitle>
            <CardDescription>{t.trackProgress}</CardDescription>
          </CardHeader>
          <CardContent>
            <Timeline steps={timelineSteps} orientation="horizontal" />
          </CardContent>
        </Card>

        {/* Day Navigation */}
        <div className="flex items-center justify-between bg-surface rounded-2xl shadow-md p-6 border border-borderColor-light">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setCurrentDay(Math.max(0, currentDay - 1))}
            disabled={isFirstDay}
            className="gap-2"
          >
            <ChevronLeft className="h-5 w-5" />
            {t.previousDay}
          </Button>

          <div className="text-center">
            <p className="text-sm text-text-secondary font-medium">
              {t.dayOf(currentDay + 1, STARTER_GUIDE_DAYS.length)}
            </p>
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={() => setCurrentDay(Math.min(STARTER_GUIDE_DAYS.length - 1, currentDay + 1))}
            disabled={isLastDay}
            className="gap-2"
          >
            {t.nextDay}
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Current Day Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Instructions Card */}
            <Card variant={isLastDay ? 'success' : 'default'} className="h-fit">
              <CardHeader>
                <CardTitle className="text-2xl font-display">{day.title}</CardTitle>
                <CardDescription>
                  {t.expectedActivity} <span className="font-medium text-text-primary">{day.expectedActivity}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Steps */}
                <div>
                  <h3 className="font-semibold text-base mb-3 font-display text-text-primary flex items-center gap-2">
                    <Check className="h-5 w-5 text-success" />
                    {t.steps}
                  </h3>
                  <ul className="space-y-2">
                    {day.steps.map((step: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-text-secondary">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 text-sm font-semibold">
                          {idx + 1}
                        </span>
                        <span className="flex-1 pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pro Tip */}
                <Card variant="soft">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="text-2xl">💡</div>
                      <div>
                        <p className="font-semibold text-sm mb-1 text-text-primary">{t.proTip}</p>
                        <p className="text-sm text-text-secondary">{day.tip}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Reference */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-primary-50 rounded-xl border border-primary-200">
                    <Wheat className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-xs text-text-secondary">{t.flour}</p>
                      <p className="font-semibold text-primary-700">50g</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-secondary-50 rounded-xl border border-secondary-200">
                    <Droplet className="h-5 w-5 text-secondary-600" />
                    <div>
                      <p className="text-xs text-text-secondary">{t.water}</p>
                      <p className="font-semibold text-secondary-700">50g</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visual Card */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-xl">{language === 'en' ? 'Starter Visualization' : 'Визуализация Закваски'}</CardTitle>
                <CardDescription>{language === 'en' ? 'How your starter should look today' : 'Как должна выглядеть ваша закваска сегодня'}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-6">
                <StarterJar 
                  size="lg" 
                  level={day.jarLevel} 
                  isActive={day.isActive || false}
                />
                
                <div className="text-center">
                  <p className="text-sm text-text-secondary mb-2">{language === 'en' ? 'Activity Level' : 'Уровень Активности'}</p>
                  <div className="flex gap-1 justify-center">
                    {[...Array(6)].map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 w-8 rounded-full transition-all ${
                          idx < Math.ceil((day.jarLevel / 100) * 6)
                            ? 'bg-success'
                            : 'bg-borderColor'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {isLastDay && (
                  <Card variant="success" className="w-full">
                    <CardContent className="p-4 text-center">
                      <div className="text-4xl mb-2">🎉</div>
                      <p className="font-semibold text-success mb-1">{language === 'en' ? 'Ready to Bake!' : 'Готова к Выпечке!'}</p>
                      <p className="text-sm text-text-secondary">
                        {language === 'en' ? 'Your starter is mature and ready for your first loaf' : 'Ваша закваска зрелая и готова для первой буханки'}
                      </p>
                      <Button
                        variant="success"
                        size="lg"
                        className="mt-4 w-full"
                        onClick={() => router.push('/recipe')}
                      >
                        {language === 'en' ? 'Start Baking Recipe' : 'Начать Рецепт'}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Quick Jump */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{language === 'en' ? 'Jump to Day' : 'Перейти к Дню'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {STARTER_GUIDE_DAYS.map((d: { day: number }, idx: number) => (
                <Button
                  key={d.day}
                  variant={idx === currentDay ? 'primary' : 'outline'}
                  size="md"
                  onClick={() => setCurrentDay(idx)}
                  className={`transition-all ${idx === currentDay ? 'scale-105' : ''}`}
                >
                  {t.day(d.day)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomTab />
    </div>
  );
}
