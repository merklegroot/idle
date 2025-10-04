# Idle Game

An idle/incremental game built with Next.js, TypeScript, and Zustand.

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd idle
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up assets** (optional but recommended):
   - See [ASSET_INSTRUCTIONS.md](./ASSET_INSTRUCTIONS.md) for detailed setup
   - Download the free Cute Fantasy RPG assets from itch.io
   - Place the zip file in `public/assets/cute-fantasy-rpg/`
   - Run: `npm run setup-assets`

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and visit `http://localhost:3000`

## 🎨 Assets

This project uses the **Cute Fantasy RPG** asset pack by Kenmi for pixel art graphics. The assets are free for non-commercial use and are excluded from the repository.

- **Setup Guide**: See [ASSET_INSTRUCTIONS.md](./ASSET_INSTRUCTIONS.md) for detailed instructions
- **Asset Showcase**: Visit `/icons` to see available assets
- **Credits**: Visit `/credits` for full attribution information

## Game Overview

A resource gathering idle game where players collect materials, hire workers, and craft tools.

## Core Resources

- **Wood** 🪵 - Basic resource, sells for 20 gold
- **Berries** 🫐 - Food resource, sells for 30 gold  
- **Stone** 🪨 - Building material, sells for 50 gold
- **Hatchet** 🪓 - Crafted tool (2 wood + 1 stone), sells for 75 gold
- **Pickaxe** ⛏️ - Advanced tool (3 wood + 2 stone), sells for 100 gold
- **Gold** 🪙 - Currency for hiring workers

## Game Mechanics

### Resource Gathering
- Manual gathering: Click to gather resources over time
- Worker system: Hire workers with gold to automate gathering
- Workers require ongoing salary payments
- Craftable items require materials before gathering

### Worker System
- Each resource type has different worker costs and salaries
- Workers produce resources automatically
- Only paid workers are productive
- Worker costs increase with each hire (1.15x multiplier)

### Equipment System
- **Tool Equipping**: Equip hatchet or pickaxe for gathering bonuses
- **Tool Effectiveness**: 
  - Hatchet 🪓 → +50% wood gathering speed
  - Pickaxe ⛏️ → +50% stone gathering speed
- **Inventory Management**: Equipped tools are removed from inventory (prevents selling)
- **Worker Benefits**: Workers automatically get tool bonuses without equipping
- **Strategic Choice**: Equip for bonuses vs keep in inventory for selling

### Selling System
- All resources can be sold for gold
- Auto-sell feature with configurable thresholds
- Gold is used to hire workers
