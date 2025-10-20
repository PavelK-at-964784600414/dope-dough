'use client';

import * as React from 'react';
import { TopNav } from '@/components/design-system/TopNav';
import { BottomTab } from '@/components/design-system/BottomTab';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { Input } from '@/components/design-system/Input';
import { Toggle } from '@/components/design-system/Toggle';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [starterName, setStarterName] = React.useState('Bubbles');
  const [notifications, setNotifications] = React.useState(true);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [temperatureUnit, setTemperatureUnit] = React.useState<'F' | 'C'>('F');

  return (
    <div className="min-h-screen bg-warmBg pb-20 md:pb-0">
      <TopNav />

      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-8">
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
              Settings
            </h1>
            <p className="text-text-secondary mt-1">
              Customize your baking experience
            </p>
          </div>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Personalize your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Your Name"
              value="Sarah Baker"
              placeholder="Enter your name"
            />
            <Input
              label="Starter Name"
              value={starterName}
              onChange={(e) => setStarterName(e.target.value)}
              placeholder="Give your starter a name"
              helperText="A friendly name helps you bond with your starter!"
            />
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage how you receive alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Toggle
              pressed={notifications}
              onPressedChange={setNotifications}
              label="Push Notifications"
              description="Get notified when timers complete"
            />
            <Toggle
              pressed={soundEnabled}
              onPressedChange={setSoundEnabled}
              label="Sound Alerts"
              description="Play a sound when timers finish"
            />
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Toggle
              pressed={darkMode}
              onPressedChange={setDarkMode}
              label="Dark Mode"
              description="Use a darker color scheme"
            />
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Temperature Unit
              </label>
              <div className="flex gap-3">
                <Button
                  variant={temperatureUnit === 'F' ? 'primary' : 'outline'}
                  onClick={() => setTemperatureUnit('F')}
                  className="flex-1"
                >
                  Fahrenheit (°F)
                </Button>
                <Button
                  variant={temperatureUnit === 'C' ? 'primary' : 'outline'}
                  onClick={() => setTemperatureUnit('C')}
                  className="flex-1"
                >
                  Celsius (°C)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
            <CardDescription>Manage your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              Export My Data
            </Button>
            <Button variant="outline" className="w-full justify-start text-error">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
              Clear All Data
            </Button>
          </CardContent>
        </Card>

        {/* About */}
        <Card variant="soft">
          <CardContent className="text-center space-y-2">
            <h3 className="font-display font-semibold text-lg text-text-primary">
              Dope Dough
            </h3>
            <p className="text-sm text-text-secondary">
              Your friendly companion for sourdough baking. Made with love for bakers everywhere. 🍞
            </p>
          </CardContent>
        </Card>
      </main>

      <BottomTab />
    </div>
  );
}
