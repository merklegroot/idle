import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { pathUtil } from '@/utils/pathUtil'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'town-map.txt')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    
    const tiles = pathUtil.parseMapData(fileContents)
    
    return NextResponse.json(tiles)
  } catch (error) {
    console.error('Failed to load map data:', error)
    return NextResponse.json({ error: 'Failed to load map data' }, { status: 500 })
  }
}
