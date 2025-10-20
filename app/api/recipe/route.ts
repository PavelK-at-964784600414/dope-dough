import { NextResponse } from 'next/server';
import recipeData from '../../../public/recipe.json';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json(recipeData);
}
