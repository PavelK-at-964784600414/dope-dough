'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BookOpen, Clock } from 'lucide-react';
import { RecipeStep, formatDuration } from '@/lib/parseRecipe';
import { motion } from 'framer-motion';

interface RecipeOverviewProps {
  steps: RecipeStep[];
  language: 'en' | 'ru';
}

export function RecipeOverview({ steps, language }: RecipeOverviewProps) {
  // Define the correct ingredients list (same as IngredientsChecklist)
  const ingredients = language === 'ru' ? [
    // Закваска и опара
    { name: 'Закваска (стартер)', amount: '~40-50 г активная' },
    { name: 'Вода для закваски/опары', amount: '20 г + 80-85 г' },
    { name: 'Мука для закваски/опары', amount: '20 г + 80-85 г' },
    
    // Основное тесто
    { name: 'Холодная вода', amount: '270 г (на одну порцию)' },
    { name: 'Цельнозерновая мука', amount: '200 г (на одну порцию)' },
    { name: 'Белая мука', amount: '200 г (на одну порцию)' },
    { name: 'Соль', amount: '9 г (на одну порцию)' },
    { name: 'Вода для финального замеса', amount: '28 г (на одну порцию)' },
    { name: 'Семена (чиа/лён/семечки)', amount: '1 ст.л.', optional: true },
    { name: 'Оливки или семечки', amount: 'По желанию', optional: true },
    
    // Для работы
    { name: 'Масло для миски', amount: 'Для смазывания' },
    { name: 'Вода для спрея', amount: 'Для выпечки' },
  ] : [
    // Starter and levain
    { name: 'Sourdough starter', amount: '~40-50 g active' },
    { name: 'Water for starter/levain', amount: '20 g + 80-85 g' },
    { name: 'Flour for starter/levain', amount: '20 g + 80-85 g' },
    
    // Main dough
    { name: 'Cold water', amount: '270 g (per loaf)' },
    { name: 'Whole-grain flour', amount: '200 g (per loaf)' },
    { name: 'White flour', amount: '200 g (per loaf)' },
    { name: 'Salt', amount: '9 g (per loaf)' },
    { name: 'Water for final mixing', amount: '28 g (per loaf)' },
    { name: 'Seeds (chia/flax/mix)', amount: '1 tbsp', optional: true },
    { name: 'Olives or seeds', amount: 'Optional', optional: true },
    
    // For working
    { name: 'Oil for bowl', amount: 'For greasing' },
    { name: 'Water for spray', amount: 'For baking' },
  ];
  
  // Calculate total time
  const totalTime = steps.reduce((sum, step) => {
    if (step.duration_max_seconds) {
      return sum + step.duration_max_seconds;
    }
    return sum;
  }, 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2 rounded-xl border-2 border-primary-300 hover:bg-primary-50 hover:border-primary-400 hover:scale-[1.02] active:scale-[0.98] transition-all">
          <BookOpen className="h-5 w-5" />
          {language === 'ru' ? 'Полный рецепт' : 'Full Recipe'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-warmBg border-2 border-primary-200">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 font-display text-text-primary">
            <BookOpen className="h-6 w-6 text-primary-500" />
            {language === 'ru' ? 'Рецепт хлеба на закваске' : 'Sourdough Bread Recipe'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Summary */}
          <div className="rounded-xl border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-accentMuted-light p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-primary-600" />
              <span className="font-semibold font-display text-text-primary">
                {language === 'ru' ? 'Общее время:' : 'Total time:'}
              </span>
              <span className="text-text-secondary font-medium">{formatDuration(totalTime)}</span>
            </div>
            <div className="text-sm text-text-secondary font-medium">
              {language === 'ru' 
                ? `${steps.length} шагов` 
                : `${steps.length} steps`}
            </div>
          </div>

          {/* Key Ingredients */}
          {ingredients.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 font-display text-text-primary">
                {language === 'ru' ? 'Ингредиенты' : 'Ingredients'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {ingredients.map((ingredient, idx) => (
                  <div 
                    key={idx}
                    className={`text-sm border-2 border-borderColor-light rounded-xl p-3 bg-surface hover:bg-primary-50 hover:border-primary-200 transition-all ${
                      ingredient.optional ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-text-primary">
                        {ingredient.name}
                        {ingredient.optional && (
                          <span className="text-xs text-text-secondary ml-1">
                            ({language === 'ru' ? 'по желанию' : 'optional'})
                          </span>
                        )}
                      </span>
                      <span className="text-text-secondary text-xs whitespace-nowrap">{ingredient.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Steps */}
          <div>
            <h3 className="font-semibold text-lg mb-3 font-display text-text-primary">
              {language === 'ru' ? 'Все шаги' : 'All Steps'}
            </h3>
            <div className="space-y-4">
              {steps.map((step, idx) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-2 border-borderColor-light rounded-xl p-4 bg-surface hover:shadow-md hover:border-primary-200 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center font-semibold text-white shadow-sm">
                      {step.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-1 font-display text-text-primary">
                        {language === 'ru' ? step.title_ru : step.title_en}
                      </h4>
                      <p className="text-sm text-text-secondary mb-2 leading-relaxed">
                        {language === 'ru' ? step.instruction_ru : step.instruction_en}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {step.duration_min_seconds && step.duration_min_seconds > 0 && (
                          <Badge variant="secondary" className="gap-1 bg-primary-50 text-primary-700 border-primary-200 rounded-lg">
                            <Clock className="h-3 w-3" />
                            {formatDuration(step.duration_min_seconds)}
                            {step.duration_max_seconds && 
                             step.duration_max_seconds !== step.duration_min_seconds && 
                             ` - ${formatDuration(step.duration_max_seconds)}`}
                          </Badge>
                        )}
                        {step.tags?.map(tag => (
                          <Badge key={tag} variant="outline" className="rounded-lg bg-secondary-50 text-secondary-700 border-secondary-200">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-xs text-text-secondary border-t-2 border-borderColor-light pt-4 bg-primary-50/50 -mx-6 px-6 -mb-6 pb-6 rounded-b-xl">
            {language === 'ru' 
              ? 'Совет: Используйте таймеры для отслеживания каждого шага. Время может варьироваться в зависимости от температуры и влажности.'
              : 'Tip: Use the timers to track each step. Times may vary based on temperature and humidity.'}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
