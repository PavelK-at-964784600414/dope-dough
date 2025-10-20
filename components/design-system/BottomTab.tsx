'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
}

interface BottomTabProps {
  className?: string;
}

const defaultTabs: TabItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'recipe',
    label: 'Recipe',
    href: '/recipe',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3h5v5" />
        <path d="M8 3H3v5" />
        <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" />
        <path d="m15 9 6-6" />
        <path d="M21 8V3h-5" />
      </svg>
    ),
  },
  {
    id: 'timer',
    label: 'Timer',
    href: '/dashboard/timer',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2 2" />
        <path d="m16.2 7.8 1.8-1.8" />
        <path d="M9 2h6" />
      </svg>
    ),
  },
  {
    id: 'log',
    label: 'Log',
    href: '/dashboard/log',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" x2="15" y1="15" y2="15" />
        <line x1="9" x2="15" y1="12" y2="12" />
      </svg>
    ),
  },
];

export function BottomTab({ className }: BottomTabProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 border-t border-borderColor-light bg-surface/95 backdrop-blur-sm shadow-lg md:hidden',
        className
      )}
      aria-label="Bottom navigation"
    >
      <div className="container mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {defaultTabs.map((tab) => {
            const isActive = pathname === tab.href || 
                           (tab.href !== '/' && pathname?.startsWith(tab.href));

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 min-w-[64px]',
                  isActive
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-text-tertiary hover:text-primary-500 hover:bg-primary-50/50'
                )}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className={cn(
                  'transition-transform duration-300',
                  isActive && 'scale-110'
                )}>
                  {tab.activeIcon && isActive ? tab.activeIcon : tab.icon}
                </div>
                <span className={cn(
                  'text-xs font-medium',
                  isActive && 'font-semibold'
                )}>
                  {tab.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary-500" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

/**
 * USAGE EXAMPLE:
 * 
 * // In your root layout or main page
 * <div className="min-h-screen pb-16 md:pb-0">
 *   {children}
 *   <BottomTab />
 * </div>
 * 
 * // The pb-16 padding on mobile accounts for the fixed bottom navigation
 * // md:pb-0 removes it on desktop where bottom nav is hidden
 */
