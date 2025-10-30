'use client';

import * as React from 'react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

import { useLanguage } from '@/hooks/useLanguage';

interface TopNavProps {
  className?: string;
}

export function TopNav({ 
  className,
}: TopNavProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-borderColor-light bg-surface/95 backdrop-blur-sm shadow-sm',
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-sm"
                aria-label="La Petite Sourdough logo"
              >
                {/* Bread loaf with bubbles */}
                <ellipse cx="20" cy="28" rx="16" ry="10" fill="#D96D3A" opacity="0.2" />
                <path
                  d="M8 22C8 15 12 10 20 10C28 10 32 15 32 22C32 28 28 32 20 32C12 32 8 28 8 22Z"
                  fill="#D96D3A"
                />
                {/* Scoring marks */}
                <path
                  d="M14 18C14 18 16 20 18 20"
                  stroke="#A57C52"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M20 16C20 16 22 18 24 18"
                  stroke="#A57C52"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                {/* Bubbles */}
                <circle cx="15" cy="24" r="1.5" fill="#FBF6EE" opacity="0.6" className="animate-bubble-rise" />
                <circle cx="22" cy="26" r="1" fill="#FBF6EE" opacity="0.5" style={{ animationDelay: '0.5s' }} className="animate-bubble-rise" />
                <circle cx="18" cy="22" r="1.2" fill="#FBF6EE" opacity="0.7" style={{ animationDelay: '1s' }} className="animate-bubble-rise" />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-primary-600">
                La Petite Sourdough
              </h1>
              <p className="text-xs text-text-secondary hidden sm:block">
                Your baking companion
              </p>
            </div>
          </div>

          {/* Right side: Language toggle */}
          <div className="flex items-center gap-3">
            {/* Language Toggle - Always visible */}
            <div className="flex gap-2">
              <Button
                variant={language === 'en' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setLanguage('en')}
                className="rounded-lg"
              >
                EN
              </Button>
              <Button
                variant={language === 'ru' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setLanguage('ru')}
                className="rounded-lg"
              >
                RU
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * USAGE EXAMPLE:
 * 
 * <TopNav />
 */
