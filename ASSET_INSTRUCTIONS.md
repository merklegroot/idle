# Asset Setup Instructions

## Download the Cute Fantasy RPG Assets

1. **Visit the asset pack page**: https://kenmi-art.itch.io/cute-fantasy-rpg

2. **Download the free version**:
   - Click "Download Now"
   - Enter $0 for the free version (or any amount you'd like to support the artist)
   - Download the file: `Cute_Fantasy_Free.zip`

3. **Place the zip file**:
   - Place the zip file at: `downloads/Cute_Fantasy_Free.zip`

4. **Run the setup script**:
   ```bash
   npm run setup-assets
   ```
   This will automatically extract and organize all the assets for you.

## File Structure

After setup, your assets should be organized like this:
```
public/assets/cute-fantasy-rpg/
├── .gitignore              # Excludes assets from git
├── README.md               # Asset information and licensing
├── [Character sprites]     # Player, NPCs, animations
├── [Environment tiles]     # Grass, water, paths, etc.
├── [Building sprites]      # Houses, furniture, etc.
├── [Item sprites]          # Tools, resources, UI elements
└── [Other assets]          # Animals, enemies, etc.
```

## Verification

Once you've placed the assets:
1. Start your development server: `npm run dev`
2. Visit `/assets` to see the asset showcase
3. The assets will be available for use in your game

## License

- **Artist**: Kenmi
- **Source**: https://kenmi-art.itch.io/cute-fantasy-rpg
- **License**: Free Version (Non-commercial use only)
- **Attribution**: Required (handled automatically in the game)

## Download the Grass+ Assets

1. **Visit the asset pack page**: https://ninjikin.itch.io/grass

2. **Download the asset pack**:
   - Click "Download Now"
   - Enter $0 for the free version (or any amount you'd like to support the artist)
   - Download the file: `GRASS+.png`

3. **Place the file**:
   - Place the PNG file at: `downloads/GRASS+.png`

4. **Run the setup script**:
   ```bash
   npm run setup-assets
   ```
   This will automatically copy and organize the Grass+ assets for you.

## File Structure

After setup, your assets should be organized like this:
```
public/assets/
├── cute-fantasy-rpg/
│   ├── .gitignore              # Excludes assets from git
│   ├── README.md               # Asset information and licensing
│   ├── [Character sprites]     # Player, NPCs, animations
│   ├── [Environment tiles]     # Grass, water, paths, etc.
│   ├── [Building sprites]      # Houses, furniture, etc.
│   ├── [Item sprites]          # Tools, resources, UI elements
│   └── [Other assets]          # Animals, enemies, etc.
└── grass-plus/
    ├── GRASS+.png              # Complete grass tileset
    └── README.md               # Asset information and licensing
```

## Verification

Once you've placed the assets:
1. Start your development server: `npm run dev`
2. Visit `/assets` to see the asset showcase
3. The assets will be available for use in your game

## License

### Cute Fantasy RPG
- **Artist**: Kenmi
- **Source**: https://kenmi-art.itch.io/cute-fantasy-rpg
- **License**: Free Version (Non-commercial use only)
- **Attribution**: Required (handled automatically in the game)

### Grass+
- **Artist**: SciGho
- **Source**: https://ninjikin.itch.io/grass
- **License**: CC0 (Public Domain)
- **Attribution**: Credit appreciated but not required

## Notes

- Assets are excluded from git via `.gitignore`
- Other developers can follow these same instructions
- For commercial use of Cute Fantasy RPG, consider purchasing the premium version
- Grass+ assets are CC0 and can be used for any purpose, including commercial use
