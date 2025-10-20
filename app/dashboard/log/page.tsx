'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { TopNav } from '@/components/design-system/TopNav';
import { BottomTab } from '@/components/design-system/BottomTab';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/design-system/Card';
import { Button } from '@/components/design-system/Button';
import { useRouter } from 'next/navigation';

interface LogEntry {
  id: string;
  date: string;
  type: 'feed' | 'bake' | 'note';
  title: string;
  details: string;
  ratio?: string;
  temperature?: string;
}

const SAMPLE_LOGS: LogEntry[] = [
  {
    id: '1',
    date: '2025-10-19T14:30:00',
    type: 'feed',
    title: 'Fed starter',
    details: 'Discarded all but 20g, added 40g water + 40g flour',
    ratio: '1:2:2',
    temperature: '72°F',
  },
  {
    id: '2',
    date: '2025-10-18T08:15:00',
    type: 'bake',
    title: 'Baked classic sourdough',
    details: 'Perfect rise and crust! Doubled in proof',
    temperature: '450°F',
  },
  {
    id: '3',
    date: '2025-10-17T19:00:00',
    type: 'feed',
    title: 'Fed starter',
    details: 'Regular feeding before refrigeration',
    ratio: '1:2:2',
    temperature: '70°F',
  },
  {
    id: '4',
    date: '2025-10-16T16:45:00',
    type: 'note',
    title: 'Starter very active',
    details: 'Lots of bubbles, peaked at 6 hours. Smells pleasantly tangy',
  },
  {
    id: '5',
    date: '2025-10-15T09:00:00',
    type: 'feed',
    title: 'Fed starter',
    details: 'After taking out of fridge, refreshed',
    ratio: '1:3:3',
    temperature: '68°F',
  },
];

const typeColors = {
  feed: {
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    text: 'text-primary-600',
    icon: '🥄',
  },
  bake: {
    bg: 'bg-secondary-50',
    border: 'border-secondary-200',
    text: 'text-secondary-600',
    icon: '🍞',
  },
  note: {
    bg: 'bg-warning-light',
    border: 'border-warning',
    text: 'text-warning',
    icon: '📝',
  },
};

export default function LogPage() {
  const router = useRouter();
  const [filter, setFilter] = React.useState<'all' | 'feed' | 'bake' | 'note'>('all');

  const filteredLogs = filter === 'all' 
    ? SAMPLE_LOGS 
    : SAMPLE_LOGS.filter(log => log.type === filter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen bg-warmBg pb-20 md:pb-0">
      <TopNav />

      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-text-primary">
              Starter Log
            </h1>
            <p className="text-text-secondary mt-1">
              Track your sourdough journey
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => router.push('/dashboard/feed')}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Entry
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'feed' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('feed')}
          >
            🥄 Feedings
          </Button>
          <Button
            variant={filter === 'bake' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('bake')}
          >
            🍞 Bakes
          </Button>
          <Button
            variant={filter === 'note' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('note')}
          >
            📝 Notes
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card variant="soft" padding="md">
            <div className="text-center">
              <p className="text-sm text-text-secondary mb-1">Total Feedings</p>
              <p className="text-3xl font-display font-bold text-primary-600">23</p>
            </div>
          </Card>
          <Card variant="soft" padding="md">
            <div className="text-center">
              <p className="text-sm text-text-secondary mb-1">Bakes</p>
              <p className="text-3xl font-display font-bold text-secondary-600">8</p>
            </div>
          </Card>
          <Card variant="soft" padding="md">
            <div className="text-center">
              <p className="text-sm text-text-secondary mb-1">Streak</p>
              <p className="text-3xl font-display font-bold text-success">12 days</p>
            </div>
          </Card>
        </div>

        {/* Log entries */}
        <div className="space-y-4">
          {filteredLogs.map((log, index) => {
            const colors = typeColors[log.type];
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card variant="elevated" padding="md" interactive>
                  <div className="flex gap-4">
                    <div
                      className={`shrink-0 w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center text-2xl`}
                    >
                      {colors.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className="font-display font-semibold text-text-primary">
                            {log.title}
                          </h3>
                          <p className="text-sm text-text-tertiary">
                            {formatDate(log.date)}
                          </p>
                        </div>
                        <button
                          className="text-text-tertiary hover:text-text-primary transition-colors"
                          aria-label="More options"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-text-secondary mb-3">
                        {log.details}
                      </p>
                      {(log.ratio || log.temperature) && (
                        <div className="flex gap-3 text-xs">
                          {log.ratio && (
                            <span className={`px-2 py-1 rounded-md ${colors.bg} ${colors.text} font-medium`}>
                              Ratio: {log.ratio}
                            </span>
                          )}
                          {log.temperature && (
                            <span className="px-2 py-1 rounded-md bg-borderColor-light text-text-secondary font-medium">
                              {log.temperature}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state (when filtered) */}
        {filteredLogs.length === 0 && (
          <Card className="py-16">
            <div className="text-center">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
                No entries yet
              </h3>
              <p className="text-text-secondary mb-6">
                Start logging your sourdough journey
              </p>
              <Button variant="primary" onClick={() => router.push('/dashboard/feed')}>
                Add First Entry
              </Button>
            </div>
          </Card>
        )}
      </main>

      <BottomTab />
    </div>
  );
}
