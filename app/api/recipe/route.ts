import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export async function GET() {
  try {
    // Read the pre-generated recipe.json from public directory
    const filePath = path.join(process.cwd(), 'public', 'recipe.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error serving recipe:', error);
    return NextResponse.json({ 
      error: 'Failed to load recipe', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
