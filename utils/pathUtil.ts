import type { MapTile } from "@/models/MapTile";
import type { TreeMapTile } from "@/models/TreeMapTile";

// Helper function to get tile at specific coordinates
function getTileAt(x: number, y: number, mapData: MapTile[]): MapTile | null {
    return mapData.find(tile => tile.x === x && tile.y === y) || null
  }

/** returns the variant mneumonic such as tl, tm, tr, ml, m, mr, bl, bm, br */
function getSubTileAt(
    {subTile: subTileCoord, tile: tileCoord, mapData}: {
        subTile: { x: number, y: number },
        tile: { x: number, y: number },
        mapData: MapTile[]
    }) {

    const neighbors = {
        top: getTileAt(tileCoord.x, tileCoord.y - 1, mapData),
        bottom: getTileAt(tileCoord.x, tileCoord.y + 1, mapData),
        left: getTileAt(tileCoord.x - 1, tileCoord.y, mapData),
        right: getTileAt(tileCoord.x + 1, tileCoord.y, mapData),
        topLeft: getTileAt(tileCoord.x - 1, tileCoord.y - 1, mapData),
        topRight: getTileAt(tileCoord.x + 1, tileCoord.y - 1, mapData),
        bottomLeft: getTileAt(tileCoord.x - 1, tileCoord.y + 1, mapData),
        bottomRight: getTileAt(tileCoord.x + 1, tileCoord.y + 1, mapData),
    }

    // Determine if each direction has a path tile (not grass or null)
    const hasPathTop = neighbors.top?.type === 'p';
    const hasPathBottom = neighbors.bottom?.type === 'p';
    const hasPathLeft = neighbors.left?.type === 'p';
    const hasPathRight = neighbors.right?.type === 'p';
    const hasPathTopLeft = neighbors.topLeft?.type === 'p';
    const hasPathTopRight = neighbors.topRight?.type === 'p';
    const hasPathBottomLeft = neighbors.bottomLeft?.type === 'p';
    const hasPathBottomRight = neighbors.bottomRight?.type === 'p';

    // Determine the sub-tile variant based on position and neighbors
    if (subTileCoord.x === 0 && subTileCoord.y === 0) {
        // Top-left corner
        if (hasPathTop && hasPathLeft && hasPathTopLeft) {
            return 'm'; // All path tiles around including diagonal
        }
        if (hasPathTop && hasPathLeft && !hasPathTopLeft) {
            return 'gbr'; // Path above and left, but grass top-left diagonal
        }
        if (hasPathLeft) {
            return 'tm'; // Path to the left only - prioritize horizontal connection
        }
        if (hasPathTop) {
            return 'ml'; // Path above only - connect to path above, transition to grass left
        }
        return 'tl'; // No path connections
    }
    
    if (subTileCoord.x === 1 && subTileCoord.y === 0) {
        // Top-middle
        if (hasPathTop) {
            return 'm'; // Path above
        }
        return 'tm'; // No path above
    }
    
    if (subTileCoord.x === 2 && subTileCoord.y === 0) {
        // Top-right corner
        if (hasPathTop && hasPathRight && hasPathTopRight) {
            return 'm'; // All path tiles around including diagonal
        }
        if (hasPathTop && hasPathRight && !hasPathTopRight) {
            return 'gbl'; // Path above and right, but grass top-right diagonal
        }
        if (hasPathRight) {
            return 'tm'; // Path to the right only - prioritize horizontal connection
        }
        if (hasPathTop) {
            // Path above only - check diagonal neighbors for more specific transitions
            if (hasPathTopRight) {
                return 'mr'; // Path above and top-right - connect to path above, transition to grass right
            } else {
                return 'mr'; // Path above but grass top-right - still connect to path above, transition to grass right
            }
        }
        return 'tr'; // No path connections
    }
    
    if (subTileCoord.x === 0 && subTileCoord.y === 1) {
        // Middle-left
        if (hasPathLeft) {
            return 'm'; // Path to the left
        }
        return 'ml'; // No path to the left
    }
    
    if (subTileCoord.x === 1 && subTileCoord.y === 1) {
        // Center
        return 'm'; // Always middle for center
    }
    
    if (subTileCoord.x === 2 && subTileCoord.y === 1) {
        // Middle-right
        if (hasPathRight) {
            return 'm'; // Path to the right
        }
        return 'mr'; // No path to the right
    }
    
    if (subTileCoord.x === 0 && subTileCoord.y === 2) {
        // Bottom-left corner
        if (hasPathBottom && hasPathLeft && hasPathBottomLeft) {
            return 'm'; // All path tiles around including diagonal
        }
        if (hasPathBottom && hasPathLeft && !hasPathBottomLeft) {
            return 'gtr'; // Path below and left, but grass bottom-left diagonal
        }
        if (hasPathLeft) {
            return 'bm'; // Path to the left only - prioritize horizontal connection
        }
        if (hasPathBottom) {
            return 'ml'; // Path below only - connect to path below, transition to grass left
        }
        return 'bl'; // No path connections
    }
    
    if (subTileCoord.x === 1 && subTileCoord.y === 2) {
        // Bottom-middle
        if (hasPathBottom) {
            return 'm'; // Path below
        }
        return 'bm'; // No path below
    }
    
    if (subTileCoord.x === 2 && subTileCoord.y === 2) {
        // Bottom-right corner
        if (hasPathBottom && hasPathRight && hasPathBottomRight) {
            return 'm'; // All path tiles around including diagonal
        }
        if (hasPathBottom && hasPathRight && !hasPathBottomRight) {
            return 'gtl'; // Path below and right, but grass bottom-right diagonal
        }
        if (hasPathRight) {
            return 'bm'; // Path to the right only - prioritize horizontal connection
        }
        if (hasPathBottom) {
            return 'mr'; // Path below only - connect to path below, transition to grass right
        }
        return 'br'; // No path connections
    }

    return 'm'; // Default fallback
}

// Function to get 3x3 grid of mnemonics for path tiles
function getPathTile3x3Grid(tile: MapTile, mapData: MapTile[]): string[][] {
    // Create a 3x3 grid using getSubTileAt for each position
    const grid: string[][] = [];
    
    for (let y = 0; y < 3; y++) {
        const row: string[] = [];
        for (let x = 0; x < 3; x++) {
            row.push(getSubTileAt({subTile: {x, y}, tile: tile, mapData}));
        }
        grid.push(row);
    }
    
    return grid;
}

function parseMapData(mapData: string): MapTile[] {
    const lines = mapData.trim().split('\n');
    const tiles: MapTile[] = [];
    
    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            if (char === 'g' || char === 'p' || char === 'l') {
                tiles.push({
                    type: char as 'g' | 'p' | 'l',
                    x,
                    y
                });
            }
        });
    });
    
    return tiles;
}

function parseTreeMapData(treeMapData: string): TreeMapTile[] {
    const lines = treeMapData.trim().split('\n');
    const tiles: TreeMapTile[] = [];
    
    lines.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            if (char === '.' || char === 't') {
                tiles.push({
                    type: char as '.' | 't',
                    x,
                    y
                });
            }
        });
    });
    
    return tiles;
}

export const pathUtil = {
    getTileAt,
    getSubTileAt,
    getPathTile3x3Grid,
    parseMapData,
    parseTreeMapData
};
