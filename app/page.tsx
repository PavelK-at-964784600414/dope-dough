'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer, Cookie, CheckCircle2, Sprout } from 'lucide-react';
import { TopNav } from '@/components/design-system/TopNav';
import { useLanguage } from '@/hooks/useLanguage';

const translations = {
  en: {
    subtitle: "A step-by-step guide to baking sourdough bread with intelligent timers, progress tracking, and bilingual support (English/Russian).",
    smartTimers: "Smart Timers",
    smartTimersDesc: "Automatic timers for each step with min/max duration ranges. Start, pause, and reset individual or all timers at once.",
    progressTracking: "Progress Tracking",
    progressTrackingDesc: "Your progress is automatically saved to localStorage. Continue where you left off even after closing your browser.",
    notifications: "Notifications",
    notificationsDesc: "Get toast popups, browser notifications, and a bell sound when timers complete so you never miss a step.",
    startBaking: "Start Baking",
    starterGuide: "Starter Guide",
    viewDashboard: "View Dashboard",
    tip: "Tip:",
    tipText: "Enable browser notifications for the best experience. You'll be prompted when you start your first timer."
  },
  ru: {
    subtitle: "Пошаговое руководство по выпечке хлеба на закваске с умными таймерами, отслеживанием прогресса и двуязычной поддержкой (английский/русский).",
    smartTimers: "Умные Таймеры",
    smartTimersDesc: "Автоматические таймеры для каждого шага с минимальной/максимальной продолжительностью. Запускайте, ставьте на паузу и сбрасывайте отдельные или все таймеры сразу.",
    progressTracking: "Отслеживание Прогресса",
    progressTrackingDesc: "Ваш прогресс автоматически сохраняется в localStorage. Продолжайте с того места, где остановились, даже после закрытия браузера.",
    notifications: "Уведомления",
    notificationsDesc: "Получайте всплывающие уведомления, уведомления браузера и звуковой сигнал при завершении таймеров, чтобы не пропустить ни одного шага.",
    startBaking: "Начать Выпечку",
    starterGuide: "Гид по Закваске",
    viewDashboard: "Панель Управления",
    tip: "Совет:",
    tipText: "Включите уведомления браузера для лучшего опыта. Вам будет предложено это при запуске первого таймера."
  }
};

/**
 * Landing page - welcome screen with recipe overview
 */
export default function HomePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <TopNav />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-amber-100 p-6">
              <Cookie className="h-16 w-16 text-amber-700" />
            </div>
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-gray-900 animate-fade-in">
              Dope Dough
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Timer className="h-5 w-5 text-blue-600" />
                {t.smartTimers}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {t.smartTimersDesc}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {t.progressTracking}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {t.progressTrackingDesc}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-xl">🔔</span>
                {t.notifications}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {t.notificationsDesc}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4">
          <Link href="/recipe">
            <Button size="lg" className="text-lg px-8 py-6">
              {t.startBaking}
              <Cookie className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard/starter-guide">
              <Button variant="outline" size="lg" className="gap-2 text-base px-6 py-4 rounded-xl border-2 border-secondary-300 hover:bg-secondary-50 hover:border-secondary-400 hover:scale-[1.02] active:scale-[0.98] transition-all">
                <Sprout className="h-5 w-5" />
                {t.starterGuide}
              </Button>
            </Link>
            
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="text-base px-6 py-4 rounded-xl border-2 border-primary-300 hover:bg-primary-50 hover:border-primary-400 hover:scale-[1.02] active:scale-[0.98] transition-all">
                {t.viewDashboard}
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            <strong>{t.tip}</strong> {t.tipText}
          </p>
        </div>
      </div>
    </div>
  );
}
