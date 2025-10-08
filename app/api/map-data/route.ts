import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface MapTile {
  type: 'g' | 'p'
  x: number
  y: number
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'town-map.txt')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    
    const lines = fileContents.trim().split('\n')
    const tiles: MapTile[] = []
    
    lines.forEach((line, y) => {
      line.split('').forEach((char, x) => {
        if (char === 'g' || char === 'p') {
          tiles.push({
            type: char as 'g' | 'p',
            x,
            y
          })
        }
      })
    })
    
    return NextResponse.json(tiles)
  } catch (error) {
    console.error('Failed to load map data:', error)
    return NextResponse.json({ error: 'Failed to load map data' }, { status: 500 })
  }
}
