# Idle Game

An idle/incremental game built with Next.js, TypeScript, and Zustand.

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
