import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface SliceDefinition {
  id: string;
  imagePath: string;
  imageName: string;
  gridWidth: number;
  gridHeight: number;
  offsetX: number;
  offsetY: number;
  spacingX: number;
  spacingY: number;
}

const DEFINITIONS_FILE = path.join(process.cwd(), 'data', 'sprite-slice-definitions.json');

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(DEFINITIONS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load definitions from file
function loadDefinitions(): SliceDefinition[] {
  ensureDataDirectory();
  
  if (!fs.existsSync(DEFINITIONS_FILE)) {
    return [];
  }
  
  try {
    const data = fs.readFileSync(DEFINITIONS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading slice definitions:', error);
    return [];
  }
}

// Save definitions to file
function saveDefinitions(definitions: SliceDefinition[]): void {
  ensureDataDirectory();
  
  try {
    fs.writeFileSync(DEFINITIONS_FILE, JSON.stringify(definitions, null, 2));
  } catch (error) {
    console.error('Error saving slice definitions:', error);
    throw error;
  }
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export async function GET() {
  try {
    const definitions = loadDefinitions();
    
    return NextResponse.json({
      success: true,
      definitions
    });
  } catch (error) {
    console.error('Error loading slice definitions:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to load slice definitions'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      imagePath,
      imageName,
      gridWidth,
      gridHeight,
      offsetX,
      offsetY,
      spacingX,
      spacingY
    } = body;

    // Validate required fields
    if (!imagePath || !imageName || gridWidth === undefined || gridHeight === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    const definitions = loadDefinitions();
    
    // Check if definition already exists for this image
    const existingIndex = definitions.findIndex(def => def.imagePath === imagePath);
    
    const definition: SliceDefinition = {
      id: existingIndex >= 0 ? definitions[existingIndex].id : generateId(),
      imagePath,
      imageName,
      gridWidth: Number(gridWidth),
      gridHeight: Number(gridHeight),
      offsetX: Number(offsetX) || 0,
      offsetY: Number(offsetY) || 0,
      spacingX: Number(spacingX) || 0,
      spacingY: Number(spacingY) || 0
    };

    if (existingIndex >= 0) {
      definitions[existingIndex] = definition;
    } else {
      definitions.push(definition);
    }

    saveDefinitions(definitions);

    return NextResponse.json({
      success: true,
      definition
    });
  } catch (error) {
    console.error('Error saving slice definition:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to save slice definition'
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Missing definition ID'
      }, { status: 400 });
    }

    const definitions = loadDefinitions();
    const filteredDefinitions = definitions.filter(def => def.id !== id);
    
    if (filteredDefinitions.length === definitions.length) {
      return NextResponse.json({
        success: false,
        error: 'Definition not found'
      }, { status: 404 });
    }

    saveDefinitions(filteredDefinitions);

    return NextResponse.json({
      success: true,
      message: 'Definition deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting slice definition:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete slice definition'
    }, { status: 500 });
  }
}
