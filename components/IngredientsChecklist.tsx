'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { ShoppingCart, Check } from 'lucide-react';

interface Ingredient {
  name: string;
  amount: string;
  optional?: boolean;
}

interface IngredientsChecklistProps {
  language: 'en' | 'ru';
}

export function IngredientsChecklist({ language }: IngredientsChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Load checked items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sourdough:ingredients-checked');
    if (saved) {
      try {
        setCheckedItems(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error('Failed to load checked ingredients:', e);
      }
    }
  }, []);

  // Save checked items to localStorage
  const toggleItem = (itemName: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemName)) {
        newSet.delete(itemName);
      } else {
        newSet.add(itemName);
      }
      localStorage.setItem('sourdough:ingredients-checked', JSON.stringify([...newSet]));
      return newSet;
    });
  };

  const resetChecklist = () => {
    setCheckedItems(new Set());
    localStorage.removeItem('sourdough:ingredients-checked');
  };

  // Define ingredients based on the recipe
  const ingredients: Ingredient[] = language === 'ru' ? [
    // Закваска и опара
    { name: 'Закваска (стартер)', amount: '½ ч.л. начальная + ~40-50 г активная' },
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
    { name: 'Sourdough starter', amount: '½ tsp initial + ~40-50 g active' },
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

  const totalItems = ingredients.length;
  const checkedCount = checkedItems.size;
  const progress = Math.round((checkedCount / totalItems) * 100);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2 relative rounded-xl border-2 border-primary-300 hover:bg-primary-50 hover:border-primary-400 hover:scale-[1.02] active:scale-[0.98] transition-all">
          <ShoppingCart className="h-5 w-5" />
          {language === 'ru' ? 'Ингредиенты' : 'Ingredients'}
          {checkedCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-success text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold shadow-md">
              {checkedCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-warmBg border-2 border-primary-200">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 font-display text-text-primary">
            <ShoppingCart className="h-6 w-6 text-primary-500" />
            {language === 'ru' ? 'Список ингредиентов' : 'Ingredients Checklist'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-text-primary">
                {language === 'ru' ? 'Прогресс' : 'Progress'}
              </span>
              <span className="text-text-secondary font-medium">
                {checkedCount} / {totalItems} ({progress}%)
              </span>
            </div>
            <div className="w-full bg-primary-100 rounded-full h-3 shadow-inner">
              <div
                className="bg-success h-3 rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetChecklist}
              disabled={checkedCount === 0}
              className="rounded-lg hover:bg-primary-50 text-text-secondary hover:text-primary-600 transition-all"
            >
              {language === 'ru' ? 'Сбросить всё' : 'Reset All'}
            </Button>
          </div>

          {/* Ingredients List */}
          <div className="space-y-3">
            {ingredients.map((ingredient, index) => {
              const isChecked = checkedItems.has(ingredient.name);
              
              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all ${
                    isChecked 
                      ? 'bg-success-light border-success/30 shadow-sm' 
                      : 'bg-surface hover:bg-primary-50 border-borderColor-light hover:border-primary-200'
                  }`}
                >
                  <Checkbox
                    id={`ingredient-${index}`}
                    checked={isChecked}
                    onCheckedChange={() => toggleItem(ingredient.name)}
                    className="mt-1"
                  />
                  <label
                    htmlFor={`ingredient-${index}`}
                    className={`flex-1 cursor-pointer transition-all ${
                      isChecked ? 'line-through text-text-tertiary' : 'text-text-primary'
                    }`}
                  >
                    <div className="font-medium flex items-center gap-2 font-body">
                      {ingredient.name}
                      {ingredient.optional && (
                        <span className="text-xs bg-accentMuted-light text-accentMuted px-2 py-0.5 rounded-full font-medium">
                          {language === 'ru' ? 'опционально' : 'optional'}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-text-secondary mt-0.5">
                      {ingredient.amount}
                    </div>
                  </label>
                  {isChecked && (
                    <Check className="h-5 w-5 text-success mt-1" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="text-xs text-text-secondary border-t-2 border-borderColor-light pt-4 bg-primary-50/50 -mx-6 px-6 -mb-6 pb-6 rounded-b-xl">
            {language === 'ru' 
              ? 'Совет: Количества указаны для одного хлеба. Если делаете два, умножьте на 2.'
              : 'Tip: Quantities are for one loaf. If making two, multiply by 2.'}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
