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
  // Calculate total ingredients from all steps
  const extractIngredients = () => {
    const ingredients = new Map<string, string>();
    
    steps.forEach(step => {
      const instruction = language === 'ru' ? step.instruction_ru : step.instruction_en;
      
      // Extract ingredient mentions (this is a simple extraction)
      const patterns = [
        /(\d+)\s*г\s*([\wа-яА-Я\s]+)/g, // Russian: "200 г муки"
        /(\d+)\s*g\s*(\w+(?:\s+\w+)?)/gi, // English: "200 g flour"
        /(\d+)\s*tbsp\s*(\w+(?:\s+\w+)?)/gi, // "1 tbsp seeds"
        /(\d+)\s*tsp\s*(\w+(?:\s+\w+)?)/gi, // "½ tsp starter"
        /½\s*tsp\s*(\w+)/gi, // "½ tsp starter"
      ];
      
      patterns.forEach(pattern => {
        const matches = instruction.matchAll(pattern);
        for (const match of matches) {
          const amount = match[1] || '½';
          const ingredient = match[2]?.trim();
          if (ingredient && !ingredients.has(ingredient)) {
            ingredients.set(ingredient, amount);
          }
        }
      });
    });
    
    return Array.from(ingredients.entries());
  };

  const ingredients = extractIngredients();
  
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
                {language === 'ru' ? 'Основные ингредиенты' : 'Key Ingredients'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {ingredients.map(([ingredient, amount], idx) => (
                  <div 
                    key={idx}
                    className="text-sm border-2 border-borderColor-light rounded-xl p-2 bg-surface hover:bg-primary-50 hover:border-primary-200 transition-all"
                  >
                    <span className="font-medium text-text-primary">{ingredient}</span>
                    {amount && <span className="text-text-secondary ml-2">({amount})</span>}
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
