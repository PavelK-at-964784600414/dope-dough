'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { TopNav } from '@/components/design-system/TopNav';
import { BottomTab } from '@/components/design-system/BottomTab';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { useRouter } from 'next/navigation';

export default function TimerPage() {
  const router = useRouter();
  const [isRunning, setIsRunning] = React.useState(false);
  const [timeRemaining, setTimeRemaining] = React.useState(4 * 60 * 60); // 4 hours in seconds

  React.useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  const progress = ((4 * 60 * 60 - timeRemaining) / (4 * 60 * 60)) * 100;

  return (
    <div className="min-h-screen bg-warmBg pb-20 md:pb-0">
      <TopNav />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
            Bulk Fermentation
          </h1>
          <p className="text-text-secondary">
            {isRunning ? 'Timer is running' : 'Ready to start'}
          </p>
        </div>

        {/* Timer Display */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <div className="text-center space-y-8">
            {/* Circular progress */}
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-64 h-64 transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-borderColor-light"
                />
                <motion.circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className="text-primary-500"
                  initial={{ strokeDasharray: '0 754' }}
                  animate={{
                    strokeDasharray: `${(progress / 100) * 754} 754`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  className="font-display text-6xl font-bold text-text-primary"
                  animate={isRunning ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {String(hours).padStart(2, '0')}:
                  {String(minutes).padStart(2, '0')}:
                  {String(seconds).padStart(2, '0')}
                </motion.div>
                <p className="text-text-secondary mt-2">
                  {timeRemaining === 0 ? "Time's up!" : 'remaining'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 justify-center">
              {!isRunning ? (
                <Button
                  variant="primary"
                  size="lg"
                  rounded="full"
                  onClick={() => setIsRunning(true)}
                  className="px-12"
                >
                  Start Timer
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    rounded="full"
                    onClick={() => setIsRunning(false)}
                  >
                    Pause
                  </Button>
                  <Button
                    variant="danger"
                    size="lg"
                    rounded="full"
                    onClick={() => {
                      setIsRunning(false);
                      setTimeRemaining(4 * 60 * 60);
                    }}
                  >
                    Reset
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Quick Times */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold text-text-primary">
            Quick Timers
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Card variant="soft" interactive padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-text-primary">
                    Autolyse
                  </h3>
                  <p className="text-sm text-text-secondary">30 minutes</p>
                </div>
                <Button variant="primary" size="sm" rounded="full">
                  Start
                </Button>
              </div>
            </Card>

            <Card variant="soft" interactive padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-text-primary">
                    Coil Fold
                  </h3>
                  <p className="text-sm text-text-secondary">30 minutes</p>
                </div>
                <Button variant="primary" size="sm" rounded="full">
                  Start
                </Button>
              </div>
            </Card>

            <Card variant="soft" interactive padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-text-primary">
                    Proof
                  </h3>
                  <p className="text-sm text-text-secondary">2 hours</p>
                </div>
                <Button variant="primary" size="sm" rounded="full">
                  Start
                </Button>
              </div>
            </Card>

            <Card variant="soft" interactive padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-text-primary">
                    Bake
                  </h3>
                  <p className="text-sm text-text-secondary">45 minutes</p>
                </div>
                <Button variant="primary" size="sm" rounded="full">
                  Start
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <BottomTab />
    </div>
  );
}
