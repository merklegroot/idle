import { pathUtil } from '../../utils/pathUtil';
import type { MapTile } from '@/models/MapTile';
import os from 'os';

describe('pathUtil', () => {
  describe('getPathTile3x3Grid', () => {
    it('path surroundd by grass', () => {
      const mapData: MapTile[] = [
        { type: 'g', x: 0, y: 0 }, { type: 'g', x: 1, y: 0 }, { type: 'g', x: 2, y: 0 },
        { type: 'g', x: 0, y: 1 }, { type: 'p', x: 1, y: 1 }, { type: 'g', x: 2, y: 1 },
        { type: 'g', x: 0, y: 2 }, { type: 'g', x: 1, y: 2 }, { type: 'g', x: 2, y: 2 },
      ];

      const pathTile: MapTile = { type: 'p', x: 1, y: 1 };
      const result = pathUtil.getPathTile3x3Grid(pathTile, mapData);
      
      expect(result[0][0]).toBe('tl');
      expect(result[0][1]).toBe('tm');
      expect(result[0][2]).toBe('tr');

      expect(result[1][0]).toBe('ml');
      expect(result[1][1]).toBe('m');
      expect(result[1][2]).toBe('mr');

      expect(result[2][0]).toBe('bl');
      expect(result[2][1]).toBe('bm');
      expect(result[2][2]).toBe('br');      
    });
    //   const mapData: MapTile[] = [
    //     { type: 'p', x: 0, y: 0 }, { type: 'p', x: 1, y: 0 }, { type: 'p', x: 2, y: 0 },
    //     { type: 'p', x: 0, y: 1 }, { type: 'p', x: 1, y: 1 }, { type: 'p', x: 2, y: 1 },
    //     { type: 'p', x: 0, y: 2 }, { type: 'p', x: 1, y: 2 }, { type: 'p', x: 2, y: 2 },
    //   ];

    //   const pathTile: MapTile = { type: 'p', x: 1, y: 1 };
    //   const result = pathUtil.getPathTile3x3Grid(pathTile, mapData);
      
    //   expect(result[0][0]).toBe('m');
    //   expect(result[0][1]).toBe('m');
    //   expect(result[0][2]).toBe('m');

    //   expect(result[1][0]).toBe('m');
    //   expect(result[1][1]).toBe('m');
    //   expect(result[1][2]).toBe('m');

    //   expect(result[2][0]).toBe('m');
    //   expect(result[2][1]).toBe('m');
    //   expect(result[2][2]).toBe('m');      
    // });
  });

  describe('getSubTileAt', () => {
    it('path surrounded by grass', () => {
      const mapData = pathUtil.parseMapData([
        'ggg',
        'gpg',
        'ggg'
      ].join(os.EOL));

      expect(pathUtil.getSubTileAt({subTile: {x: 0, y: 0}, tile: {x: 1, y: 1}, mapData})).toBe('tl');
      expect(pathUtil.getSubTileAt({subTile: {x: 1, y: 0}, tile: {x: 1, y: 1}, mapData})).toBe('tm');
      expect(pathUtil.getSubTileAt({subTile: {x: 2, y: 0}, tile: {x: 1, y: 1}, mapData})).toBe('tr');
      expect(pathUtil.getSubTileAt({subTile: {x: 0, y: 1}, tile: {x: 1, y: 1}, mapData})).toBe('ml');
      expect(pathUtil.getSubTileAt({subTile: {x: 1, y: 1}, tile: {x: 1, y: 1}, mapData})).toBe('m');
      expect(pathUtil.getSubTileAt({subTile: {x: 2, y: 1}, tile: {x: 1, y: 1}, mapData})).toBe('mr');
      expect(pathUtil.getSubTileAt({subTile: {x: 0, y: 2}, tile: {x: 1, y: 1}, mapData})).toBe('bl');
      expect(pathUtil.getSubTileAt({subTile: {x: 1, y: 2}, tile: {x: 1, y: 1}, mapData})).toBe('bm');
      expect(pathUtil.getSubTileAt({subTile: {x: 2, y: 2}, tile: {x: 1, y: 1}, mapData})).toBe('br');
    });

    it('two horitontal paths surrounded by grass', () => {
      const mapData = pathUtil.parseMapData([
        'gggg',
        'gppg',
        'gggg'
      ].join(os.EOL));

      expect(pathUtil.getSubTileAt({subTile: {x: 0, y: 0}, tile: {x: 1, y: 1}, mapData})).toBe('tl');
      expect(pathUtil.getSubTileAt({subTile: {x: 1, y: 0}, tile: {x: 1, y: 1}, mapData})).toBe('tm');
      expect(pathUtil.getSubTileAt({subTile: {x: 2, y: 0}, tile: {x: 1, y: 1}, mapData})).toBe('tm');

      expect(pathUtil.getSubTileAt({subTile: {x: 0, y: 1}, tile: {x: 1, y: 1}, mapData})).toBe('ml');
      expect(pathUtil.getSubTileAt({subTile: {x: 1, y: 1}, tile: {x: 1, y: 1}, mapData})).toBe('m');
      expect(pathUtil.getSubTileAt({subTile: {x: 2, y: 1}, tile: {x: 1, y: 1}, mapData})).toBe('m');

      expect(pathUtil.getSubTileAt({subTile: {x: 0, y: 2}, tile: {x: 1, y: 1}, mapData})).toBe('bl');
      expect(pathUtil.getSubTileAt({subTile: {x: 1, y: 2}, tile: {x: 1, y: 1}, mapData})).toBe('bm');
      expect(pathUtil.getSubTileAt({subTile: {x: 2, y: 2}, tile: {x: 1, y: 1}, mapData})).toBe('bm');

      expect(pathUtil.getSubTileAt({subTile: {x: 0, y: 0}, tile: {x: 2, y: 1}, mapData})).toBe('tm');
      expect(pathUtil.getSubTileAt({subTile: {x: 1, y: 0}, tile: {x: 2, y: 1}, mapData})).toBe('tm');
      expect(pathUtil.getSubTileAt({subTile: {x: 2, y: 0}, tile: {x: 2, y: 1}, mapData})).toBe('tr');

      expect(pathUtil.getSubTileAt({subTile: {x: 0, y: 1}, tile: {x: 2, y: 1}, mapData})).toBe('m');
      expect(pathUtil.getSubTileAt({subTile: {x: 1, y: 1}, tile: {x: 2, y: 1}, mapData})).toBe('m');
      expect(pathUtil.getSubTileAt({subTile: {x: 2, y: 1}, tile: {x: 2, y: 1}, mapData})).toBe('mr');

      expect(pathUtil.getSubTileAt({subTile: {x: 0, y: 2}, tile: {x: 2, y: 1}, mapData})).toBe('bm');
      expect(pathUtil.getSubTileAt({subTile: {x: 1, y: 2}, tile: {x: 2, y: 1}, mapData})).toBe('bm');
      expect(pathUtil.getSubTileAt({subTile: {x: 2, y: 2}, tile: {x: 2, y: 1}, mapData})).toBe('br');
    });

    it('3x3 path', () => {
      const mapData = pathUtil.parseMapData([
        'ggggg',
        'gpppg',
        'gpppg',
        'gpppg',
        'ggggg'
      ].join(os.EOL));

      expect(pathUtil.getSubTileAt({subTile: {x: 0, y: 0}, tile: {x: 1, y: 2}, mapData})).toBe('ml');
      expect(pathUtil.getSubTileAt({subTile: {x: 0, y: 1}, tile: {x: 1, y: 2}, mapData})).toBe('ml');
      expect(pathUtil.getSubTileAt({subTile: {x: 0, y: 2}, tile: {x: 1, y: 2}, mapData})).toBe('ml');
    });

    it('2x2 path with top right as grass', () => {
      const mapData = pathUtil.parseMapData([
        'gggg',
        'gpgg',
        'gppg',
        'gggg'
      ].join(os.EOL));

      expect(pathUtil.getSubTileAt({subTile: {x: 2, y: 0}, tile: {x: 1, y: 2}, mapData})).toBe('gbl');
    });
    
    it('2x2 path with bottom right as grass', () => {
      const mapData = pathUtil.parseMapData([
        'gggg',
        'gppg',
        'gpgg',
        'gggg'
      ].join(os.EOL));

      expect(pathUtil.getSubTileAt({subTile: {x: 2, y: 2}, tile: {x: 1, y: 1}, mapData})).toBe('gtl');
    });

    it('2x2 path with top left as grass', () => {
      const mapData = pathUtil.parseMapData([
        'gggg',
        'ggpg',
        'gppg',
        'gggg'
      ].join(os.EOL));

      expect(pathUtil.getSubTileAt({subTile: {x: 0, y: 0}, tile: {x: 2, y: 2}, mapData})).toBe('gbr');
    });

    it('2x2 path with bottom left as grass', () => {
      const mapData = pathUtil.parseMapData([
        'gggg',
        'gppg',
        'ggpg',
        'gggg'
      ].join(os.EOL));

      expect(pathUtil.getSubTileAt({subTile: {x: 0, y: 2}, tile: {x: 2, y: 1}, mapData})).toBe('gtr');
      expect(pathUtil.getSubTileAt({subTile: {x: 2, y: 0}, tile: {x: 2, y: 2}, mapData})).toBe('mr');
    });
  });

  describe('parseMapData', () => {
    it('should parse map data string into MapTile array', () => {
      const mapString = 'gggg\ngppg\ngggg';
      const result = pathUtil.parseMapData(mapString);
      
      expect(result).toHaveLength(12);
      
      // Check first row (y=0)
      expect(result[0]).toEqual({ type: 'g', x: 0, y: 0 });
      expect(result[1]).toEqual({ type: 'g', x: 1, y: 0 });
      expect(result[2]).toEqual({ type: 'g', x: 2, y: 0 });
      expect(result[3]).toEqual({ type: 'g', x: 3, y: 0 });
      
      // Check second row (y=1)
      expect(result[4]).toEqual({ type: 'g', x: 0, y: 1 });
      expect(result[5]).toEqual({ type: 'p', x: 1, y: 1 });
      expect(result[6]).toEqual({ type: 'p', x: 2, y: 1 });
      expect(result[7]).toEqual({ type: 'g', x: 3, y: 1 });
      
      // Check third row (y=2)
      expect(result[8]).toEqual({ type: 'g', x: 0, y: 2 });
      expect(result[9]).toEqual({ type: 'g', x: 1, y: 2 });
      expect(result[10]).toEqual({ type: 'g', x: 2, y: 2 });
      expect(result[11]).toEqual({ type: 'g', x: 3, y: 2 });
    });

    it('should handle empty map data', () => {
      const result = pathUtil.parseMapData('');
      expect(result).toEqual([]);
    });

    it('should ignore invalid characters', () => {
      const mapString = 'gxgp\ngppg\ngggg';
      const result = pathUtil.parseMapData(mapString);
      
      // Should only have 11 tiles (excluding the 'x')
      expect(result).toHaveLength(11);
      
      // Check that 'x' was ignored
      const xTile = result.find(tile => tile.x === 1 && tile.y === 0);
      expect(xTile).toBeUndefined();
    });
  });
});
