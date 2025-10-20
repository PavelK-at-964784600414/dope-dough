'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  title: string;
  description?: string;
  prepTime?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  imageUrl?: string;
  steps?: number;
  isActive?: boolean;
  onStart?: () => void;
  onView?: () => void;
  className?: string;
}

const difficultyColors = {
  Easy: 'bg-success-light text-success border-success',
  Medium: 'bg-warning-light text-warning border-warning',
  Hard: 'bg-error-light text-error border-error',
};

export function RecipeCard({
  title,
  description,
  prepTime,
  difficulty = 'Medium',
  imageUrl,
  steps,
  isActive = false,
  onStart,
  onView,
  className,
}: RecipeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card
        variant={isActive ? 'glow' : 'elevated'}
        padding="none"
        className={cn('overflow-hidden', className)}
      >
        {/* Recipe Image */}
        {imageUrl && (
          <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
            />
            {isActive && (
              <div className="absolute inset-0 bg-primary-500/20 backdrop-blur-[1px] flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-full px-4 py-2 shadow-lg"
                >
                  <span className="text-primary-600 font-display font-semibold">
                    In Progress
                  </span>
                </motion.div>
              </div>
            )}
          </div>
        )}

        <CardHeader className="p-6 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <CardTitle className="text-xl">{title}</CardTitle>
              {description && (
                <CardDescription className="mt-2">{description}</CardDescription>
              )}
            </div>
            {difficulty && (
              <span
                className={cn(
                  'shrink-0 rounded-full px-3 py-1 text-xs font-medium border',
                  difficultyColors[difficulty]
                )}
              >
                {difficulty}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
            {prepTime && (
              <div className="flex items-center gap-1.5">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{prepTime}</span>
              </div>
            )}
            {steps && (
              <div className="flex items-center gap-1.5">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" x2="21" y1="6" y2="6" />
                  <line x1="8" x2="21" y1="12" y2="12" />
                  <line x1="8" x2="21" y1="18" y2="18" />
                  <line x1="3" x2="3.01" y1="6" y2="6" />
                  <line x1="3" x2="3.01" y1="12" y2="12" />
                  <line x1="3" x2="3.01" y1="18" y2="18" />
                </svg>
                <span>{steps} steps</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {onStart && (
              <Button
                variant={isActive ? 'success' : 'primary'}
                size="md"
                onClick={onStart}
                className="flex-1"
              >
                {isActive ? 'Continue' : 'Start Baking'}
              </Button>
            )}
            {onView && (
              <Button variant="outline" size="md" onClick={onView} className="flex-1">
                View Recipe
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * USAGE EXAMPLE:
 * 
 * <RecipeCard
 *   title="Classic Sourdough Bread"
 *   description="A traditional sourdough loaf with a crispy crust"
 *   prepTime="~12 hours"
 *   difficulty="Medium"
 *   steps={16}
 *   imageUrl="/images/sourdough-loaf.jpg"
 *   onStart={() => router.push('/recipe')}
 *   onView={() => router.push('/recipe/view')}
 * />
 */
