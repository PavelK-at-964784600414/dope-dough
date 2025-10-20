'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TopNav } from '@/components/design-system/TopNav';
import { BottomTab } from '@/components/design-system/BottomTab';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { Input } from '@/components/design-system/Input';
import { StarterJar } from '@/components/design-system/StarterJar';
import { Timeline, TimelineStep } from '@/components/design-system/Timeline';
import { useRouter } from 'next/navigation';

const FEED_STEPS = [
  {
    id: 'discard',
    title: 'Discard starter',
    description: 'Remove all but ½ tsp (2-3g) of your starter. Save discards for recipes!',
    icon: '🥄',
  },
  {
    id: 'water',
    title: 'Add water',
    description: 'Add 20g of room temperature filtered water to the jar',
    icon: '💧',
  },
  {
    id: 'flour',
    title: 'Add flour',
    description: 'Add 20g of bread flour (or 10g bread + 10g whole wheat)',
    icon: '🌾',
  },
  {
    id: 'mix',
    title: 'Mix thoroughly',
    description: 'Stir well until completely combined. Scrape down the sides.',
    icon: '🥣',
  },
  {
    id: 'store',
    title: 'Store properly',
    description: 'Cover loosely and store at room temp (~72°F) for 4-8 hours, then refrigerate',
    icon: '🏺',
  },
];

export default function FeedStarterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [starterName, setStarterName] = React.useState('Bubbles');
  const [waterAmount, setWaterAmount] = React.useState('20');
  const [flourAmount, setFlourAmount] = React.useState('20');
  const [notes, setNotes] = React.useState('');
  const [isCompleting, setIsCompleting] = React.useState(false);

  const timelineSteps: TimelineStep[] = FEED_STEPS.map((step, index) => ({
    ...step,
    time: '',
    status:
      index < currentStep
        ? 'completed'
        : index === currentStep
        ? 'active'
        : 'upcoming',
  }));

  const handleNext = () => {
    if (currentStep < FEED_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push('/design');
  };

  const currentStepData = FEED_STEPS[currentStep];
  const progress = ((currentStep + 1) / FEED_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-warmBg pb-20 md:pb-0">
      <TopNav />

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Button>
          <div>
            <h1 className="font-display text-3xl font-bold text-text-primary">
              Feed Your Starter
            </h1>
            <p className="text-text-secondary mt-1">
              Follow these steps to keep {starterName} healthy and active
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">
              Step {currentStep + 1} of {FEED_STEPS.length}
            </span>
            <span className="font-medium text-primary-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-borderColor-light overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Current Step Details */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="elevated" padding="lg">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{currentStepData.icon}</div>
                    <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
                      {currentStepData.title}
                    </h2>
                    <p className="text-text-secondary text-lg">
                      {currentStepData.description}
                    </p>
                  </div>

                  {/* Input fields for specific steps */}
                  {currentStep === 1 && (
                    <div className="space-y-4 mb-6">
                      <Input
                        label="Water amount (g)"
                        type="number"
                        value={waterAmount}
                        onChange={(e) => setWaterAmount(e.target.value)}
                        helperText="Recommended: 20g"
                      />
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4 mb-6">
                      <Input
                        label="Flour amount (g)"
                        type="number"
                        value={flourAmount}
                        onChange={(e) => setFlourAmount(e.target.value)}
                        helperText="Recommended: 20g bread flour"
                      />
                    </div>
                  )}

                  {currentStep === FEED_STEPS.length - 1 && (
                    <div className="space-y-4 mb-6">
                      <Input
                        label="Notes (optional)"
                        placeholder="Any observations about your starter..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        helperText="Note the temperature, smell, or activity level"
                      />
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      className="flex-1"
                    >
                      Previous
                    </Button>
                    {currentStep < FEED_STEPS.length - 1 ? (
                      <Button
                        variant="primary"
                        onClick={handleNext}
                        className="flex-1"
                      >
                        Next Step
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={handleComplete}
                        isLoading={isCompleting}
                        className="flex-1"
                      >
                        Complete Feeding
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Tips Card */}
            <Card variant="soft">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div>
                    <CardTitle className="text-lg">Pro Tip</CardTitle>
                    <CardDescription className="mt-2">
                      {currentStep === 0 &&
                        "Don't throw away your discard! Use it for pancakes, crackers, or pizza dough."}
                      {currentStep === 1 &&
                        'Room temperature water (68-72°F) is ideal. Too hot can kill the yeast!'}
                      {currentStep === 2 &&
                        'A 50/50 mix of bread flour and whole wheat can boost activity.'}
                      {currentStep === 3 &&
                        'Make sure no dry flour remains. Consistency should be like thick pancake batter.'}
                      {currentStep === 4 &&
                        'Starter should double in 4-8 hours at 72°F. If not, try a warmer spot!'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Right: Visual & Timeline */}
          <div className="space-y-6">
            {/* Starter visualization */}
            <Card className="flex justify-center py-8">
              <StarterJar
                level={30 + currentStep * 15}
                isActive={currentStep >= 3}
                isFed={currentStep === FEED_STEPS.length - 1}
                size="lg"
              />
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Feeding Process</CardTitle>
              </CardHeader>
              <CardContent>
                <Timeline steps={timelineSteps} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <BottomTab />
    </div>
  );
}
