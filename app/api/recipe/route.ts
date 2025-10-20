import { NextResponse } from 'next/server';
import { RecipeStep } from '@/lib/parseRecipe';
import fs from 'fs';
import path from 'path';

/**
 * API route to fetch parsed recipe data
 * This runs on the server, so we can use fs here
 */
export async function GET() {
  try {
    const recipePath = path.join(process.cwd(), 'sourdough-data', 'recipe.md');
    
    console.log('Looking for recipe at:', recipePath);
    console.log('File exists:', fs.existsSync(recipePath));
    
    if (!fs.existsSync(recipePath)) {
      console.error('Recipe file not found at:', recipePath);
      return NextResponse.json({ error: 'Recipe file not found', path: recipePath }, { status: 404 });
    }

    const content = fs.readFileSync(recipePath, 'utf-8');
    console.log('File content length:', content.length);

    // Try to extract JSON block - handle both markdown-wrapped and direct JSON
    let jsonString = content;
    
    // Check if it's wrapped in markdown code fence
    const jsonMatch = content.match(/```json\s*\n([\s\S]+?)\n```/);
    if (jsonMatch) {
      jsonString = jsonMatch[1];
      console.log('Found markdown-wrapped JSON');
    } else {
      console.log('Attempting to parse as direct JSON');
    }
    
    const parsed = JSON.parse(jsonString);
    const steps: RecipeStep[] = parsed.steps || [];

    console.log('Parsed steps count:', steps.length);

    // Compute suggestedTimerSeconds for each step
    const processedSteps = steps.map(step => {
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

    return NextResponse.json({ steps: processedSteps });
  } catch (error) {
    console.error('Error parsing recipe:', error);
    return NextResponse.json({ 
      error: 'Failed to load recipe', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
