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
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';

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
    viewAll: "View All →",
    recentActivity: "Recent Activity",
    quickActions: "Quick Actions",
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
    viewAll: "Все →",
    recentActivity: "Последняя Активность",
    quickActions: "Быстрые Действия",
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
  const [starterLevel, setStarterLevel] = React.useState(65);
  const [isStarterActive, setIsStarterActive] = React.useState(true);

  const recentSteps: TimelineStep[] = [
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

  return (
    <div className="min-h-screen bg-warmBg pb-20 md:pb-0">
      <TopNav />

      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-accentMuted p-8 md:p-12 text-white shadow-xl"
        >
          <div className="relative z-10 max-w-2xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              {t.welcomeBack}
            </h1>
            <p className="text-xl text-primary-50 mb-6">
              {t.welcomeDesc}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="soft"
                size="lg"
                onClick={() => router.push('/recipe')}
                className="bg-white text-primary-600 hover:bg-primary-50"
              >
                {t.continueRecipe}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                {t.viewLog}
              </Button>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-accentMuted/20 rounded-full blur-3xl" />
        </motion.section>

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
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-success-light border border-success/20 p-4">
                    <p className="text-sm text-text-secondary">{t.activity}</p>
                    <p className="text-2xl font-display font-semibold text-success">
                      {t.activityHigh}
                    </p>
                  </div>
                  <div className="rounded-xl bg-primary-50 border border-primary-200 p-4">
                    <p className="text-sm text-text-secondary">{t.readyIn}</p>
                    <p className="text-2xl font-display font-semibold text-primary-600">
                      {t.readyTime}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    onClick={() => router.push('/design/feed')}
                  >
                    {t.feedNow}
                  </Button>
                  <Button variant="ghost" onClick={() => router.push('/design/log')}>
                    {t.viewHistory}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

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
            title="Classic Sourdough Bread"
            description="A traditional sourdough loaf with a crispy crust and tangy flavor"
            prepTime="~12 hours"
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

            <Card variant="soft" interactive className="group">
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
              onClick={() => router.push('/design/starter-guide')}
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

      <BottomTab />
    </div>
  );
}
