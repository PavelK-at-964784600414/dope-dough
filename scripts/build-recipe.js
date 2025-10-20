#!/usr/bin/env node

/**
 * Build script to generate static recipe.json from recipe.md
 * This runs during build time to avoid file system access at runtime
 */

const fs = require('fs');
const path = require('path');

function generateRecipeJson() {
  const recipePath = path.join(__dirname, '..', 'sourdough-data', 'recipe.md');
  const outputPath = path.join(__dirname, '..', 'public', 'recipe.json');

  console.log('📖 Reading recipe from:', recipePath);

  if (!fs.existsSync(recipePath)) {
    console.error('❌ Recipe file not found!');
    process.exit(1);
  }

  const content = fs.readFileSync(recipePath, 'utf-8');
  
  // Try to extract JSON block - handle both markdown-wrapped and direct JSON
  let jsonString = content;
  
  // Check if it's wrapped in markdown code fence
  const jsonMatch = content.match(/```json\s*\n([\s\S]+?)\n```/);
  if (jsonMatch) {
    jsonString = jsonMatch[1];
    console.log('✓ Found markdown-wrapped JSON');
  } else {
    console.log('✓ Parsing as direct JSON');
  }
  
  // Parse and validate
  const parsed = JSON.parse(jsonString);
  const steps = parsed.steps || [];

  console.log(`✓ Parsed ${steps.length} recipe steps`);

  // Process steps to add computed fields
  const processedSteps = steps.map(step => {
    let suggestedTimerSeconds;

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

  // Ensure public directory exists
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write to public directory
  fs.writeFileSync(outputPath, JSON.stringify({ steps: processedSteps }, null, 2), 'utf-8');
  
  console.log('✓ Generated recipe.json at:', outputPath);
  console.log('✨ Recipe build complete!');
}

// Run the script
try {
  generateRecipeJson();
} catch (error) {
  console.error('❌ Error generating recipe:', error);
  process.exit(1);
}
