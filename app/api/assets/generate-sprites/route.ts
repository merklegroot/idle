import { NextResponse } from 'next/server';
import { generateSpriteDefinitionsFile } from '@/utils/spriteGenerator';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    const content = await generateSpriteDefinitionsFile();
    
    // Save the file directly to the project
    const outputPath = path.join(process.cwd(), 'generated', 'spriteDefinitions.ts');
    
    // Ensure the generated directory exists
    const generatedDir = path.dirname(outputPath);
    if (!fs.existsSync(generatedDir)) {
      fs.mkdirSync(generatedDir, { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(outputPath, content, 'utf8');
    
    return NextResponse.json({
      success: true,
      message: 'Sprite definitions generated and saved to generated/spriteDefinitions.ts',
      filePath: 'generated/spriteDefinitions.ts'
    });
  } catch (error) {
    console.error('Error generating sprite definitions:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate sprite definitions'
    }, { status: 500 });
  }
}
