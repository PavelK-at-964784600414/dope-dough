'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { TopNav } from '@/components/design-system/TopNav';
import { BottomTab } from '@/components/design-system/BottomTab';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { ArrowLeft, Lightbulb, AlertCircle, CheckCircle, Thermometer, Droplet, Clock } from 'lucide-react';

const translations = {
  en: {
    title: "Tips & Help",
    subtitle: "Master the art of sourdough baking",
    backToDashboard: "Back to Dashboard",
    quickTips: "Quick Tips",
    troubleshooting: "Troubleshooting",
    proTips: "Pro Tips",
    tips: [
      {
        icon: "thermometer",
        title: "Temperature Matters",
        description: "Keep your starter at 75-80°F (24-27°C) for optimal fermentation. Warmer = faster rise, cooler = slower."
      },
      {
        icon: "droplet",
        title: "Hydration Levels",
        description: "100% hydration (equal parts flour and water by weight) is ideal for beginners. Adjust based on flour type."
      },
      {
        icon: "clock",
        title: "Timing is Key",
        description: "Feed your starter when it's at peak activity (doubled in size with lots of bubbles) for best results."
      },
      {
        icon: "check",
        title: "Float Test",
        description: "Drop a spoonful of starter in water. If it floats, it's ready to use! This means it's full of gas and active."
      },
      {
        icon: "lightbulb",
        title: "Discard Recipes",
        description: "Don't waste discard! Use it for pancakes, crackers, waffles, or pizza dough for delicious zero-waste baking."
      },
      {
        icon: "check",
        title: "Fresh Flour",
        description: "Use fresh, quality flour. Whole grain flours add more flavor and natural yeasts than white flour alone."
      }
    ],
    troubleshootingGuide: [
      {
        problem: "Starter Won't Rise",
        solution: "Try warmer temperature, increase feeding frequency, or use whole wheat flour to boost activity.",
        severity: "medium"
      },
      {
        problem: "Liquid on Top (Hooch)",
        solution: "This is normal! It means your starter is hungry. Pour it off or stir it in, then feed your starter.",
        severity: "low"
      },
      {
        problem: "Smells Like Acetone",
        solution: "Feed more frequently and use a larger feeding ratio (1:2:2 or 1:3:3). Your starter is very hungry!",
        severity: "medium"
      },
      {
        problem: "Mold Appeared",
        solution: "Discard immediately and start fresh. Mold is fuzzy and colored (green, pink, orange). Not safe to use.",
        severity: "high"
      },
      {
        problem: "Dense, Heavy Bread",
        solution: "Under-fermented dough. Extend bulk fermentation time or use more active starter. Check dough temperature.",
        severity: "low"
      },
      {
        problem: "Too Sour Taste",
        solution: "Reduce fermentation time, use less starter (5-10%), or ferment at lower temperature (68-72°F).",
        severity: "low"
      }
    ],
    proTipsTitle: "Pro Baker Secrets",
    proTipsList: [
      "Always use weight measurements (grams) for consistent results, not volume (cups).",
      "Develop gluten through stretch & folds instead of kneading for better structure.",
      "Cold retard your dough in the fridge overnight for deeper flavor and easier scoring.",
      "Score your loaf at a 45° angle for a dramatic 'ear' on your bread.",
      "Steam is crucial! Add ice cubes to a pan in the oven for professional crust.",
      "Let your bread cool completely (2+ hours) before slicing for best texture."
    ],
    problemLabel: "Problem:",
    solutionLabel: "Solution:",
    severity: {
      low: "Minor Issue",
      medium: "Needs Attention",
      high: "Critical"
    }
  },
  ru: {
    title: "Советы и Помощь",
    subtitle: "Освойте искусство выпечки на закваске",
    backToDashboard: "Назад к Панели",
    quickTips: "Быстрые Советы",
    troubleshooting: "Решение Проблем",
    proTips: "Профессиональные Советы",
    tips: [
      {
        icon: "thermometer",
        title: "Температура Важна",
        description: "Держите закваску при 24-27°C для оптимальной ферментации. Теплее = быстрее, холоднее = медленнее."
      },
      {
        icon: "droplet",
        title: "Уровень Гидратации",
        description: "100% гидратация (равные части муки и воды по весу) идеальна для новичков. Корректируйте по типу муки."
      },
      {
        icon: "clock",
        title: "Время — Ключ",
        description: "Кормите закваску на пике активности (удвоилась с множеством пузырьков) для лучших результатов."
      },
      {
        icon: "check",
        title: "Тест Плавучести",
        description: "Бросьте ложку закваски в воду. Если плавает — готова! Значит полна газа и активна."
      },
      {
        icon: "lightbulb",
        title: "Рецепты из Остатков",
        description: "Не выбрасывайте остатки! Используйте для блинов, крекеров, вафель или пиццы."
      },
      {
        icon: "check",
        title: "Свежая Мука",
        description: "Используйте свежую качественную муку. Цельнозерновая добавляет больше вкуса и натуральных дрожжей."
      }
    ],
    troubleshootingGuide: [
      {
        problem: "Закваска Не Поднимается",
        solution: "Попробуйте теплее температуру, увеличьте частоту кормления или используйте цельнозерновую муку.",
        severity: "medium"
      },
      {
        problem: "Жидкость Сверху (Хуч)",
        solution: "Это нормально! Закваска голодна. Слейте или размешайте, затем покормите.",
        severity: "low"
      },
      {
        problem: "Запах Ацетона",
        solution: "Кормите чаще и используйте большее соотношение (1:2:2 или 1:3:3). Закваска очень голодна!",
        severity: "medium"
      },
      {
        problem: "Появилась Плесень",
        solution: "Выбросьте немедленно и начните заново. Плесень пушистая и цветная. Небезопасна!",
        severity: "high"
      },
      {
        problem: "Плотный, Тяжелый Хлеб",
        solution: "Недостаточная ферментация. Продлите время брожения или используйте более активную закваску.",
        severity: "low"
      },
      {
        problem: "Слишком Кислый Вкус",
        solution: "Сократите время ферментации, используйте меньше закваски (5-10%) или ферментируйте при 20-22°C.",
        severity: "low"
      }
    ],
    proTipsTitle: "Секреты Профи",
    proTipsList: [
      "Всегда используйте весовые измерения (граммы) для стабильных результатов, а не объем.",
      "Развивайте глютен через растяжки и складки вместо замеса для лучшей структуры.",
      "Замедляйте тесто в холодильнике на ночь для глубокого вкуса и легкой надрезки.",
      "Надрезайте буханку под углом 45° для драматичного 'уха' на хлебе.",
      "Пар критичен! Добавьте кубики льда в противень в духовке для профессиональной корки.",
      "Дайте хлебу полностью остыть (2+ часа) перед нарезкой для лучшей текстуры."
    ],
    problemLabel: "Проблема:",
    solutionLabel: "Решение:",
    severity: {
      low: "Небольшая Проблема",
      medium: "Требует Внимания",
      high: "Критично"
    }
  }
};

export default function TipsPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'thermometer':
        return <Thermometer className="w-8 h-8" />;
      case 'droplet':
        return <Droplet className="w-8 h-8" />;
      case 'clock':
        return <Clock className="w-8 h-8" />;
      case 'check':
        return <CheckCircle className="w-8 h-8" />;
      case 'lightbulb':
        return <Lightbulb className="w-8 h-8" />;
      default:
        return <Lightbulb className="w-8 h-8" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-warmBg">
      <TopNav />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToDashboard}
          </Button>
          
          <h1 className="font-display text-4xl font-bold text-text-primary mb-2">
            {t.title}
          </h1>
          <p className="text-text-secondary text-lg">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Quick Tips Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="font-display text-2xl font-bold text-text-primary mb-6">
            {t.quickTips}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card variant="soft" className="h-full">
                  <CardHeader>
                    <div className="mb-3 text-primary-600">
                      {getIcon(tip.icon)}
                    </div>
                    <CardTitle className="text-lg mb-2">{tip.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {tip.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Troubleshooting Guide */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="font-display text-2xl font-bold text-text-primary mb-6">
            {t.troubleshooting}
          </h2>
          <div className="space-y-4">
            {t.troubleshootingGuide.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <Card className={`border-2 ${getSeverityColor(item.severity)}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <AlertCircle className={`w-6 h-6 ${getSeverityTextColor(item.severity)}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getSeverityTextColor(item.severity)} bg-white`}>
                            {t.severity[item.severity as keyof typeof t.severity]}
                          </span>
                        </div>
                        <h3 className="font-display font-semibold text-text-primary mb-2">
                          <span className="text-sm text-text-secondary">{t.problemLabel}</span> {item.problem}
                        </h3>
                        <p className="text-text-secondary">
                          <span className="font-semibold text-text-primary">{t.solutionLabel}</span> {item.solution}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Pro Tips */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="font-display text-2xl font-bold text-text-primary mb-6">
            {t.proTipsTitle}
          </h2>
          <Card variant="elevated" className="border-2 border-secondary-200 bg-gradient-to-br from-secondary-50 to-white">
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {t.proTipsList.map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-secondary-500 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <p className="text-text-secondary leading-relaxed">{tip}</p>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.section>
      </main>

      <BottomTab />
    </div>
  );
}
