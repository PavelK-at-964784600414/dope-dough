'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TimelineStep {
  id: string;
  title: string;
  description?: string;
  time?: string;
  status: 'completed' | 'active' | 'upcoming';
  icon?: React.ReactNode;
}

interface TimelineProps {
  steps: TimelineStep[];
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

const statusColors = {
  completed: {
    dot: 'bg-success border-success',
    line: 'bg-success',
    text: 'text-text-primary',
    icon: 'text-success',
  },
  active: {
    dot: 'bg-primary-500 border-primary-500 ring-4 ring-primary-100',
    line: 'bg-borderColor',
    text: 'text-text-primary',
    icon: 'text-primary-500',
  },
  upcoming: {
    dot: 'bg-surface border-borderColor',
    line: 'bg-borderColor',
    text: 'text-text-tertiary',
    icon: 'text-text-tertiary',
  },
};

export function Timeline({ steps, orientation = 'vertical', className }: TimelineProps) {
  return (
    <div
      className={cn(
        'relative',
        orientation === 'horizontal' ? 'flex items-start gap-4 overflow-x-auto pb-4' : 'space-y-8',
        className
      )}
      role="list"
      aria-label="Recipe timeline"
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const colors = statusColors[step.status];

        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: orientation === 'horizontal' ? -20 : 0, y: orientation === 'vertical' ? -20 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'relative',
              orientation === 'horizontal' ? 'flex flex-col items-center min-w-[200px]' : 'flex gap-4'
            )}
            role="listitem"
          >
            {/* Dot and Line */}
            <div
              className={cn(
                'relative flex items-center justify-center shrink-0',
                orientation === 'horizontal' ? 'flex-col' : ''
              )}
            >
              {/* Dot */}
              <motion.div
                className={cn(
                  'relative z-10 h-4 w-4 rounded-full border-2 transition-all duration-300',
                  colors.dot
                )}
                animate={
                  step.status === 'active'
                    ? { scale: [1, 1.2, 1] }
                    : { scale: 1 }
                }
                transition={
                  step.status === 'active'
                    ? { duration: 2, repeat: Infinity }
                    : {}
                }
              >
                {step.status === 'completed' && (
                  <svg
                    className="absolute inset-0 h-full w-full text-white"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M4 8l2 2 4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </motion.div>

              {/* Connecting Line */}
              {!isLast && (
                <div
                  className={cn(
                    'transition-all duration-300',
                    orientation === 'horizontal'
                      ? 'h-0.5 w-full min-w-[60px]'
                      : 'absolute left-[7px] top-4 h-full w-0.5',
                    colors.line
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div
              className={cn(
                'flex-1',
                orientation === 'horizontal' ? 'mt-4 text-center' : ''
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <h4
                  className={cn(
                    'font-display font-semibold leading-tight',
                    step.status === 'active' && 'text-lg',
                    colors.text
                  )}
                >
                  {step.title}
                </h4>
                {step.time && (
                  <span className="text-xs text-text-secondary whitespace-nowrap">
                    {step.time}
                  </span>
                )}
              </div>
              {step.description && (
                <p
                  className={cn(
                    'mt-1 text-sm',
                    orientation === 'horizontal' ? 'max-w-[200px]' : '',
                    colors.text === 'text-text-primary' ? 'text-text-secondary' : colors.text
                  )}
                >
                  {step.description}
                </p>
              )}
              {step.icon && (
                <div className={cn('mt-2', colors.icon)}>
                  {step.icon}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/**
 * USAGE EXAMPLE:
 * 
 * const steps: TimelineStep[] = [
 *   {
 *     id: '1',
 *     title: 'Mix ingredients',
 *     description: 'Combine flour, water, and starter',
 *     time: '10 min',
 *     status: 'completed',
 *   },
 *   {
 *     id: '2',
 *     title: 'Autolyse',
 *     description: 'Let dough rest',
 *     time: '30 min',
 *     status: 'active',
 *   },
 *   {
 *     id: '3',
 *     title: 'Add salt',
 *     time: '2 min',
 *     status: 'upcoming',
 *   },
 * ];
 * 
 * <Timeline steps={steps} />
 */
