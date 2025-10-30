'use client';

import { RecipeStep } from '@/lib/parseRecipe';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Circle, ImageIcon } from 'lucide-react';
import { formatDuration } from '@/lib/parseRecipe';
import { ZoomableImage } from './ImageZoom';
import { useState } from 'react';

interface StepCardProps {
  step: RecipeStep;
  stepNumber: number;
  isCompleted: boolean;
  isActive: boolean;
  language?: 'en' | 'ru';
  onStepClick?: () => void;
  onToggleComplete?: () => void;
}

/**
 * StepCard component - displays a single recipe step with metadata, tags, and completion status
 */
export function StepCard({
  step,
  stepNumber,
  isCompleted,
  isActive,
  language = 'en',
  onStepClick,
  onToggleComplete
}: StepCardProps) {
  const [imageError, setImageError] = useState(false);
  const title = language === 'ru' ? step.title_ru : step.title_en;
  const instruction = language === 'ru' ? step.instruction_ru : step.instruction_en;

  // Check if step has a timer
  const hasTimer = step.suggestedTimerSeconds != null;
  const showRange = 
    step.duration_min_seconds != null && 
    step.duration_max_seconds != null &&
    step.duration_min_seconds !== step.duration_max_seconds;

  // Generate image path based on step ID (optional - images can be added later)
  const imagePath = `/images/steps/step-${step.id}.jpg`;
  const imageAlt = language === 'ru' 
    ? `Шаг ${stepNumber}: ${title}` 
    : `Step ${stepNumber}: ${title}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: stepNumber * 0.05 }}
    >
      <Card
        className={`
          cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-2xl
          ${isActive ? 'ring-2 ring-primary-500 shadow-glow' : ''}
          ${isCompleted ? 'bg-success-light border-success/30' : 'bg-surface border-borderColor-light'}
        `}
        onClick={onStepClick}
        itemScope
        itemType="https://schema.org/HowToStep"
      >
        <meta itemProp="position" content={stepNumber.toString()} />
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-base font-display font-bold text-white shadow-md">
                {stepNumber}
              </span>
              <CardTitle 
                className="text-xl leading-tight font-display text-text-primary"
                itemProp="name"
              >
                {title}
              </CardTitle>
            </div>
            {onToggleComplete && (
              <Button
                variant={isCompleted ? "default" : "outline"}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete();
                }}
                className={`shrink-0 rounded-xl transition-all ${isCompleted ? 'bg-success hover:bg-success/90 border-success' : 'border-2 hover:bg-primary-50 hover:border-primary-300'}`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Step Image (SEO optimized with zoom) */}
          {!imageError ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary-50 to-accentMuted-light border-2 border-borderColor-light shadow-inner">
              <ZoomableImage
                src={imagePath}
                alt={imageAlt}
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary-50 to-accentMuted-light border-2 border-borderColor-light shadow-inner">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-4">
                  <ImageIcon className="h-14 w-14 text-primary-200 mx-auto mb-2" />
                  <p className="text-xs text-text-tertiary font-medium">
                    {language === 'ru' 
                      ? `Изображение для шага ${stepNumber}` 
                      : `Step ${stepNumber} image placeholder`}
                  </p>
                </div>
              </div>
            </div>
          )}

          <p 
            className="text-base text-text-primary leading-relaxed font-body"
            itemProp="text"
          >
            {instruction}
          </p>

          {/* Duration info */}
          {hasTimer && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-primary-50 rounded-xl border border-primary-200">
              <Clock className="h-5 w-5 text-primary-600" />
              <span className="font-medium text-primary-700">
                {showRange ? (
                  <>
                    {formatDuration(step.duration_min_seconds!)} – {formatDuration(step.duration_max_seconds!)}
                  </>
                ) : (
                  formatDuration(step.suggestedTimerSeconds!)
                )}
              </span>
            </div>
          )}

          {/* Tags */}
          {step.tags && step.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {step.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs px-3 py-1 rounded-full bg-secondary-100 text-secondary-700 border border-secondary-200 font-medium">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
