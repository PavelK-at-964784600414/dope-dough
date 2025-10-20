/**
 * Structured recipe step with normalized durations
 */
export interface RecipeStep {
  id: number;
  title_ru: string;
  title_en: string;
  instruction_ru: string;
  instruction_en: string;
  duration_min_seconds?: number;
  duration_max_seconds?: number;
  tags?: string[];
  // Computed field: suggested timer (defaults to min, or max if min not present)
  suggestedTimerSeconds?: number;
}

/**
 * Client-side version: accepts raw markdown string (for SSR or API routes)
 */
export function parseRecipeFromString(markdown: string): RecipeStep[] {
  const jsonMatch = markdown.match(/```json\s*\n([\s\S]+?)\n```/);
  
  if (!jsonMatch) {
    return [];
  }

  try {
    const parsed = JSON.parse(jsonMatch[1]);
    const steps: RecipeStep[] = parsed.steps || [];

    return steps.map(step => {
      let suggestedTimerSeconds: number | undefined;

      if (step.duration_min_seconds != null) {
        suggestedTimerSeconds = step.duration_min_seconds;
      } else if (step.duration_max_seconds != null) {
        suggestedTimerSeconds = step.duration_max_seconds;
      }

      return {
        ...step,
        suggestedTimerSeconds
      };
    });
  } catch (error) {
    console.error('Failed to parse recipe JSON:', error);
    return [];
  }
}

/**
 * Helper: Format seconds to human-readable string (e.g., "4h", "40m", "1h 30m")
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Compute suggestedTimerSeconds for a step
 */
export function computeSuggestedTimer(step: RecipeStep): number | undefined {
  if (step.duration_min_seconds != null) {
    return step.duration_min_seconds;
  } else if (step.duration_max_seconds != null) {
    return step.duration_max_seconds;
  }
  return undefined;
}
