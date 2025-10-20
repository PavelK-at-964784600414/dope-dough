'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className,
  ...props
}: SkeletonProps) {
  const baseClasses = 'bg-gradient-to-r from-borderColor-light via-borderColor to-borderColor-light bg-[length:200%_100%]';

  const variantClasses = {
    text: 'rounded-md h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-[shimmer_2s_infinite]',
    none: '',
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={{
        width: width || (variant === 'text' ? '100%' : undefined),
        height: height || (variant === 'circular' ? width : undefined),
      }}
      {...props}
    />
  );
}

/**
 * Skeleton components for common use cases
 */

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-borderColor-light bg-surface p-6 shadow-md">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height={24} />
            <Skeleton width="80%" />
          </div>
          <Skeleton variant="rectangular" width={60} height={24} />
        </div>
        <Skeleton variant="rectangular" width="100%" height={120} />
        <div className="flex gap-3">
          <Skeleton variant="rectangular" className="flex-1" height={44} />
          <Skeleton variant="rectangular" className="flex-1" height={44} />
        </div>
      </div>
    </div>
  );
}

export function RecipeCardSkeleton() {
  return (
    <div className="rounded-2xl border border-borderColor-light bg-surface shadow-md overflow-hidden">
      <Skeleton variant="rectangular" width="100%" height={192} animation="wave" />
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <Skeleton width="70%" height={24} />
            <Skeleton width="90%" />
          </div>
          <Skeleton variant="rectangular" width={70} height={28} />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton width={80} />
          <Skeleton width={60} />
        </div>
        <div className="flex gap-3">
          <Skeleton variant="rectangular" className="flex-1" height={44} />
          <Skeleton variant="rectangular" className="flex-1" height={44} />
        </div>
      </div>
    </div>
  );
}

export function TimelineStepSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton variant="circular" width={16} height={16} />
          <div className="flex-1 space-y-2">
            <Skeleton width="40%" height={20} />
            <Skeleton width="80%" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <Skeleton width="30%" height={36} />
        <Skeleton width="50%" />
      </div>

      {/* Cards grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

// Add shimmer animation to globals.css or here via inline keyframes
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * USAGE EXAMPLES:
 * 
 * // Basic skeleton
 * <Skeleton width={200} height={24} />
 * 
 * // Text skeleton
 * <Skeleton variant="text" width="80%" />
 * 
 * // Avatar skeleton
 * <Skeleton variant="circular" width={48} height={48} />
 * 
 * // Card skeleton
 * <CardSkeleton />
 * 
 * // Recipe card skeleton
 * <RecipeCardSkeleton />
 * 
 * // Timeline skeleton
 * <TimelineStepSkeleton count={5} />
 * 
 * // Loading state
 * {isLoading ? <CardSkeleton /> : <RecipeCard {...props} />}
 */
