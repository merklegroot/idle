import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { pathUtil } from '@/utils/pathUtil'

export async function GET() {
  try {
    const mapFilePath = path.join(process.cwd(), 'data', 'town-map.txt')
    const treeMapFilePath = path.join(process.cwd(), 'data', 'town-tree-map.txt')
    
    const mapFileContents = fs.readFileSync(mapFilePath, 'utf8')
    const treeMapFileContents = fs.readFileSync(treeMapFilePath, 'utf8')
    
    const tiles = pathUtil.parseMapData(mapFileContents)
    const treeTiles = pathUtil.parseTreeMapData(treeMapFileContents)
    
    return NextResponse.json({ 
      tiles, 
      treeTiles 
    })
  } catch (error) {
    console.error('Failed to load map data:', error)
    return NextResponse.json({ error: 'Failed to load map data' }, { status: 500 })
  }
}
