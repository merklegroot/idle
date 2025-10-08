import { pathUtil } from '../../utils/pathUtil';
import type { MapTile } from '@/models/MapTile';

describe('pathUtil', () => {
  describe('getPathTile3x3Grid', () => {
    it('should return a 3x3 grid for a path tile surrounded by grass', () => {
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
  });
});
