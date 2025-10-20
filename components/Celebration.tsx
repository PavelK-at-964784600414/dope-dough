'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { PartyPopper, Award } from 'lucide-react';

interface CelebrationProps {
  language?: 'en' | 'ru';
  onDismiss?: () => void;
}

/**
 * Celebration component - shows confetti and congratulations message
 */
export function Celebration({ language = 'en', onDismiss }: CelebrationProps) {
  useEffect(() => {
    // Fire confetti on mount
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      // Fire from left side
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });

      // Fire from right side
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    // Auto dismiss after 5 seconds
    const dismissTimeout = setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(dismissTimeout);
    };
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="bg-gradient-to-br from-primary-50 via-white to-success-light rounded-3xl shadow-2xl p-8 md:p-12 max-w-md mx-4 border-4 border-primary-300 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1, 1.1, 1]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatDelay: 1
          }}
          className="inline-block mb-4"
        >
          <PartyPopper className="h-20 w-20 text-primary-500" />
        </motion.div>

        <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-700 mb-4">
          {language === 'ru' ? 'Поздравляем!' : 'Congratulations!'}
        </h2>

        <div className="flex items-center justify-center gap-3 mb-4">
          <Award className="h-8 w-8 text-success" />
          <p className="font-display text-xl md:text-2xl font-semibold text-text-primary">
            {language === 'ru' 
              ? 'Вы завершили рецепт!' 
              : 'You completed the recipe!'}
          </p>
          <Award className="h-8 w-8 text-success" />
        </div>

        <p className="text-text-secondary text-base md:text-lg font-medium mb-6">
          {language === 'ru'
            ? 'Теперь наслаждайтесь свежеиспечённым хлебом на закваске! 🍞'
            : 'Now enjoy your freshly baked sourdough bread! 🍞'}
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDismiss}
          className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-colors"
        >
          {language === 'ru' ? 'Закрыть' : 'Close'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
