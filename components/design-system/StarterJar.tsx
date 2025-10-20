'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StarterJarProps {
  level?: number; // 0-100 percentage
  isActive?: boolean;
  isFed?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { width: 80, height: 120 },
  md: { width: 120, height: 180 },
  lg: { width: 160, height: 240 },
};

export function StarterJar({
  level = 60,
  isActive = false,
  isFed = false,
  size = 'md',
  className,
}: StarterJarProps) {
  const { width, height } = sizes[size];
  const fillHeight = (height * 0.7 * level) / 100;

  // Generate bubble positions
  const bubbles = React.useMemo(() => {
    if (!isActive) return [];
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      size: 2 + Math.random() * 4,
    }));
  }, [isActive]);

  return (
    <div className={cn('relative inline-flex flex-col items-center gap-4', className)}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="drop-shadow-lg"
        role="img"
        aria-label={`Sourdough starter jar, ${level}% full${isActive ? ', actively fermenting' : ''}`}
      >
        <defs>
          {/* Gradient for starter */}
          <linearGradient id="starter-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDF3ED" />
            <stop offset="50%" stopColor="#FAE3D4" />
            <stop offset="100%" stopColor="#F5C5A8" />
          </linearGradient>

          {/* Glass effect gradient */}
          <linearGradient id="glass-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Jar body */}
        <motion.path
          d={`M ${width * 0.2} ${height * 0.15} 
              L ${width * 0.8} ${height * 0.15}
              L ${width * 0.85} ${height * 0.85}
              Q ${width * 0.85} ${height * 0.92}, ${width * 0.8} ${height * 0.95}
              L ${width * 0.2} ${height * 0.95}
              Q ${width * 0.15} ${height * 0.92}, ${width * 0.15} ${height * 0.85}
              Z`}
          fill="#FFFFFF"
          fillOpacity="0.3"
          stroke="#E5E0D8"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Starter liquid */}
        <motion.rect
          x={width * 0.18}
          y={height * 0.95 - fillHeight}
          width={width * 0.64}
          height={fillHeight}
          fill="url(#starter-gradient)"
          initial={{ height: 0, y: height * 0.95 }}
          animate={{ height: fillHeight, y: height * 0.95 - fillHeight }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        {/* Surface of starter (wavy if active) */}
        <motion.path
          d={`M ${width * 0.18} ${height * 0.95 - fillHeight}
              Q ${width * 0.35} ${height * 0.95 - fillHeight - (isActive ? 2 : 0)},
                ${width * 0.5} ${height * 0.95 - fillHeight}
              Q ${width * 0.65} ${height * 0.95 - fillHeight + (isActive ? 2 : 0)},
                ${width * 0.82} ${height * 0.95 - fillHeight}`}
          fill="none"
          stroke="#D96D3A"
          strokeWidth="1.5"
          opacity="0.5"
          animate={
            isActive
              ? {
                  d: [
                    `M ${width * 0.18} ${height * 0.95 - fillHeight} Q ${width * 0.35} ${height * 0.95 - fillHeight - 2}, ${width * 0.5} ${height * 0.95 - fillHeight} Q ${width * 0.65} ${height * 0.95 - fillHeight + 2}, ${width * 0.82} ${height * 0.95 - fillHeight}`,
                    `M ${width * 0.18} ${height * 0.95 - fillHeight} Q ${width * 0.35} ${height * 0.95 - fillHeight + 2}, ${width * 0.5} ${height * 0.95 - fillHeight} Q ${width * 0.65} ${height * 0.95 - fillHeight - 2}, ${width * 0.82} ${height * 0.95 - fillHeight}`,
                  ],
                }
              : {}
          }
          transition={
            isActive
              ? { duration: 2, repeat: Infinity, repeatType: 'reverse' }
              : {}
          }
        />

        {/* Animated bubbles */}
        {isActive &&
          bubbles.map((bubble) => (
            <motion.circle
              key={bubble.id}
              cx={`${bubble.x}%`}
              cy={height * 0.95 - fillHeight + 20}
              r={bubble.size}
              fill="#FFFFFF"
              opacity="0.6"
              initial={{ y: 0, opacity: 0.6 }}
              animate={{
                y: [-fillHeight * 0.8, 0],
                opacity: [0.6, 0],
                scale: [1, 1.2],
              }}
              transition={{
                duration: bubble.duration,
                delay: bubble.delay,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          ))}

        {/* Glass shine effect */}
        <rect
          x={width * 0.2}
          y={height * 0.15}
          width={width * 0.15}
          height={height * 0.6}
          fill="url(#glass-gradient)"
          opacity="0.4"
          rx="4"
        />

        {/* Jar lid */}
        <rect
          x={width * 0.15}
          y={height * 0.08}
          width={width * 0.7}
          height={height * 0.08}
          fill="#A57C52"
          rx="4"
          stroke="#85633F"
          strokeWidth="1"
        />

        {/* Lid detail */}
        <circle cx={width * 0.5} cy={height * 0.12} r="3" fill="#85633F" />
      </svg>

      {/* Status indicator */}
      {(isActive || isFed) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium shadow-sm',
            isActive
              ? 'bg-success-light text-success border border-success'
              : 'bg-primary-50 text-primary-600 border border-primary-200'
          )}
        >
          {isActive ? '✓ Active & Bubbly' : '✓ Recently Fed'}
        </motion.div>
      )}
    </div>
  );
}

/**
 * USAGE EXAMPLES:
 * 
 * // Active, fermenting starter
 * <StarterJar level={75} isActive size="md" />
 * 
 * // Recently fed starter
 * <StarterJar level={50} isFed size="lg" />
 * 
 * // Low level starter
 * <StarterJar level={20} size="sm" />
 * 
 * // In a card
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Your Starter</CardTitle>
 *   </CardHeader>
 *   <CardContent className="flex justify-center">
 *     <StarterJar level={60} isActive />
 *   </CardContent>
 * </Card>
 */
