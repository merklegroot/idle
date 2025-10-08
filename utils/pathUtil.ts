import type { MapTile } from "@/models/MapTile";

// Helper function to get tile at specific coordinates
function getTileAt(x: number, y: number, mapData: MapTile[]): MapTile | null {
    return mapData.find(tile => tile.x === x && tile.y === y) || null
  }

// Function to get 3x3 grid of mnemonics for path tiles
function getPathTile3x3Grid(tile: MapTile, mapData: MapTile[]): string[][] {
    // Get neighboring tiles
    const neighbors = {
        top: getTileAt(tile.x, tile.y - 1, mapData),
        bottom: getTileAt(tile.x, tile.y + 1, mapData),
        left: getTileAt(tile.x - 1, tile.y, mapData),
        right: getTileAt(tile.x + 1, tile.y, mapData),
        topLeft: getTileAt(tile.x - 1, tile.y - 1, mapData),
        topRight: getTileAt(tile.x + 1, tile.y - 1, mapData),
        bottomLeft: getTileAt(tile.x - 1, tile.y + 1, mapData),
        bottomRight: getTileAt(tile.x + 1, tile.y + 1, mapData),
    }

    // Create a 3x3 grid with the correct pattern
    // The pattern should be based on the tile's neighbors, not individual sub-tile neighbors
    const grid = [
        ['tl', 'tm', 'tr'],
        ['ml', 'm', 'mr'],
        ['bl', 'bm', 'br']
    ]

    // For a center tile surrounded by grass, all sub-tiles should be middle path except edges
    // Top row: corners and edges based on neighbors
    if (neighbors.top?.type === 'g' || neighbors.top === null) {
        grid[0][1] = 'tm' // Top middle
    }
    if (neighbors.left?.type === 'g' || neighbors.left === null) {
        grid[1][0] = 'ml' // Middle left
    }
    if (neighbors.right?.type === 'g' || neighbors.right === null) {
        grid[1][2] = 'mr' // Middle right
    }
    if (neighbors.bottom?.type === 'g' || neighbors.bottom === null) {
        grid[2][1] = 'bm' // Bottom middle
    }

    // Corners based on diagonal neighbors
    if ((neighbors.top?.type === 'g' || neighbors.top === null) && (neighbors.left?.type === 'g' || neighbors.left === null)) {
        grid[0][0] = 'tl' // Top left
    }
    if ((neighbors.top?.type === 'g' || neighbors.top === null) && (neighbors.right?.type === 'g' || neighbors.right === null)) {
        grid[0][2] = 'tr' // Top right
    }
    if ((neighbors.bottom?.type === 'g' || neighbors.bottom === null) && (neighbors.left?.type === 'g' || neighbors.left === null)) {
        grid[2][0] = 'bl' // Bottom left
    }
    if ((neighbors.bottom?.type === 'g' || neighbors.bottom === null) && (neighbors.right?.type === 'g' || neighbors.right === null)) {
        grid[2][2] = 'br' // Bottom right
    }

    return grid
}

export const pathUtil = {
    getTileAt,
    getPathTile3x3Grid
};
