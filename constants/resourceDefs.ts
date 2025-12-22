import { ResourceDef } from "@/app/models/ResourceDef";

export const DefaultResourceColorClass = 'text-gray-700';

const resourceData: Record<string, ResourceDef> = {
    wood: {
        name: 'Wood',
        resourceKey: 'wood',
        icon: '🪵',
        isGatherable: true,
        colorClass: 'text-green-800',
    },
    berries: {
        name: 'Berries',
        resourceKey: 'berries',
        icon: '🫐',
        isGatherable: true,
        colorClass: 'text-purple-800',
    },
    stone: {
        name: 'Stone',
        resourceKey: 'stone',
        icon: '🪨',
        isGatherable: true,
        colorClass: 'text-gray-800',
    },
    thatch: {
        name: 'Thatch',
        resourceKey: 'thatch',
        icon: '🌾',
        isGatherable: true,
        colorClass: 'text-yellow-800',
    },
    gold: {
        name: 'Gold',
        resourceKey: 'gold',
        icon: '🪙',
        colorClass: 'text-gray-800',
    },
    stick: {
        name: 'Stick',
        resourceKey: 'stick',
        icon: '╱',
        isGatherable: true,
        colorClass: 'text-green-800',
    },
    'tool-handle'   : {
        name: 'Tool Handle',
        resourceKey: 'tool-handle',
        icon: '🪥',
        colorClass: 'text-gray-700',
    },
    'twine': {
        name: 'Twine',
        resourceKey: 'twine',
        icon: '🧵',
        colorClass: 'text-amber-800',
    },
    'knapped-axe-head': {
        name: 'Knapped Axe Head',
        resourceKey: 'knapped-axe-head',
        icon: '🪨',
        colorClass: 'text-gray-700',
    },
    'flimsy-axe': {
        name: 'Flimsy Axe',
        resourceKey: 'flimsy-axe',
        icon: '🪓',
        colorClass: 'text-gray-700',
    },
};

export const WoodDef: ResourceDef = resourceData.wood;
export const BerryDef: ResourceDef = resourceData.berries;
export const StoneDef: ResourceDef = resourceData.stone;
export const ThatchDef: ResourceDef = resourceData.thatch;
export const GoldDef: ResourceDef = resourceData.gold;
export const StickDef: ResourceDef = resourceData.stick;
export const HandleDef: ResourceDef = resourceData['tool-handle'];
export const TwineDef: ResourceDef = resourceData.twine;
export const KnappedAxeHeadDef: ResourceDef = resourceData['knapped-axe-head'];
export const ToolhandleDef: ResourceDef = resourceData['tool-handle'];
export const FlimsyAxeDef: ResourceDef = resourceData['flimsy-axe'];

// Additional resource definitions (stubs for now)
export const HatchetDef: ResourceDef = {
    name: 'Hatchet',
    resourceKey: 'hatchet',
    icon: '🪓',
    colorClass: 'text-gray-700',
};

export const PickaxeDef: ResourceDef = {
    name: 'Pickaxe',
    resourceKey: 'pickaxe',
    icon: '⛏️',
    colorClass: 'text-gray-700',
};

export const HouseDef: ResourceDef = {
    name: 'House',
    resourceKey: 'house',
    icon: '🏠',
    colorClass: 'text-gray-700',
};

// Town Buildings (stubs)
export const TownHallDef: ResourceDef = { name: 'Town Hall', resourceKey: 'town-hall', icon: '🏛️', colorClass: 'text-gray-700' };
export const MarketDef: ResourceDef = { name: 'Market', resourceKey: 'market', icon: '🏪', colorClass: 'text-gray-700' };
export const BankDef: ResourceDef = { name: 'Bank', resourceKey: 'bank', icon: '🏦', colorClass: 'text-gray-700' };
export const ChurchDef: ResourceDef = { name: 'Church', resourceKey: 'church', icon: '⛪', colorClass: 'text-gray-700' };
export const SchoolDef: ResourceDef = { name: 'School', resourceKey: 'school', icon: '🏫', colorClass: 'text-gray-700' };
export const HospitalDef: ResourceDef = { name: 'Hospital', resourceKey: 'hospital', icon: '🏥', colorClass: 'text-gray-700' };
export const LibraryDef: ResourceDef = { name: 'Library', resourceKey: 'library', icon: '📚', colorClass: 'text-gray-700' };
export const BarracksDef: ResourceDef = { name: 'Barracks', resourceKey: 'barracks', icon: '🏰', colorClass: 'text-gray-700' };
export const TavernDef: ResourceDef = { name: 'Tavern', resourceKey: 'tavern', icon: '🍺', colorClass: 'text-gray-700' };
export const WorkshopDef: ResourceDef = { name: 'Workshop', resourceKey: 'workshop', icon: '🔨', colorClass: 'text-gray-700' };
export const MillDef: ResourceDef = { name: 'Mill', resourceKey: 'mill', icon: '🏭', colorClass: 'text-gray-700' };
export const TowerDef: ResourceDef = { name: 'Tower', resourceKey: 'tower', icon: '🗼', colorClass: 'text-gray-700' };
export const CastleDef: ResourceDef = { name: 'Castle', resourceKey: 'castle', icon: '🏰', colorClass: 'text-gray-700' };

// Land and Terrain (stubs)
export const PlainsDef: ResourceDef = { name: 'Plains', resourceKey: 'plains', icon: '🌾', colorClass: 'text-gray-700' };
export const ForestDef: ResourceDef = { name: 'Forest', resourceKey: 'forest', icon: '🌲', colorClass: 'text-gray-700' };
export const MountainDef: ResourceDef = { name: 'Mountain', resourceKey: 'mountain', icon: '⛰️', colorClass: 'text-gray-700' };
export const HillDef: ResourceDef = { name: 'Hill', resourceKey: 'hill', icon: '🌄', colorClass: 'text-gray-700' };
export const DesertDef: ResourceDef = { name: 'Desert', resourceKey: 'desert', icon: '🏜️', colorClass: 'text-gray-700' };
export const SwampDef: ResourceDef = { name: 'Swamp', resourceKey: 'swamp', icon: '🌊', colorClass: 'text-gray-700' };
export const LakeDef: ResourceDef = { name: 'Lake', resourceKey: 'lake', icon: '🏞️', colorClass: 'text-gray-700' };
export const RiverDef: ResourceDef = { name: 'River', resourceKey: 'river', icon: '🌊', colorClass: 'text-gray-700' };
export const CoastDef: ResourceDef = { name: 'Coast', resourceKey: 'coast', icon: '🏖️', colorClass: 'text-gray-700' };
export const CaveDef: ResourceDef = { name: 'Cave', resourceKey: 'cave', icon: '🕳️', colorClass: 'text-gray-700' };

// Paths and Roads (stubs)
export const RoadDef: ResourceDef = { name: 'Road', resourceKey: 'road', icon: '🛣️', colorClass: 'text-gray-700' };
export const PathDef: ResourceDef = { name: 'Path', resourceKey: 'path', icon: '🛤️', colorClass: 'text-gray-700' };
export const BridgeDef: ResourceDef = { name: 'Bridge', resourceKey: 'bridge', icon: '🌉', colorClass: 'text-gray-700' };
export const GateDef: ResourceDef = { name: 'Gate', resourceKey: 'gate', icon: '🚪', colorClass: 'text-gray-700' };
export const WallDef: ResourceDef = { name: 'Wall', resourceKey: 'wall', icon: '🧱', colorClass: 'text-gray-700' };

// Camps and Settlements (stubs)
export const CampDef: ResourceDef = { name: 'Camp', resourceKey: 'camp', icon: '⛺', colorClass: 'text-gray-700' };
export const TentDef: ResourceDef = { name: 'Tent', resourceKey: 'tent', icon: '🏕️', colorClass: 'text-gray-700' };
export const OutpostDef: ResourceDef = { name: 'Outpost', resourceKey: 'outpost', icon: '🏚️', colorClass: 'text-gray-700' };
export const VillageDef: ResourceDef = { name: 'Village', resourceKey: 'village', icon: '🏘️', colorClass: 'text-gray-700' };
export const FortDef: ResourceDef = { name: 'Fort', resourceKey: 'fort', icon: '🏰', colorClass: 'text-gray-700' };
export const WatchtowerDef: ResourceDef = { name: 'Watchtower', resourceKey: 'watchtower', icon: '🗼', colorClass: 'text-gray-700' };

// Food and Agriculture (stubs)
export const FarmDef: ResourceDef = { name: 'Farm', resourceKey: 'farm', icon: '🚜', colorClass: 'text-gray-700' };
export const FieldDef: ResourceDef = { name: 'Field', resourceKey: 'field', icon: '🌾', colorClass: 'text-gray-700' };
export const OrchardDef: ResourceDef = { name: 'Orchard', resourceKey: 'orchard', icon: '🍎', colorClass: 'text-gray-700' };
export const GardenDef: ResourceDef = { name: 'Garden', resourceKey: 'garden', icon: '🌻', colorClass: 'text-gray-700' };
export const BarnDef: ResourceDef = { name: 'Barn', resourceKey: 'barn', icon: '🚜', colorClass: 'text-gray-700' };
export const SiloDef: ResourceDef = { name: 'Silo', resourceKey: 'silo', icon: '🌾', colorClass: 'text-gray-700' };
export const WellDef: ResourceDef = { name: 'Well', resourceKey: 'well', icon: '🪣', colorClass: 'text-gray-700' };
export const WindmillDef: ResourceDef = { name: 'Windmill', resourceKey: 'windmill', icon: '🌬️', colorClass: 'text-gray-700' };
export const ApiaryDef: ResourceDef = { name: 'Apiary', resourceKey: 'apiary', icon: '🐝', colorClass: 'text-gray-700' };
export const FishPondDef: ResourceDef = { name: 'Fish Pond', resourceKey: 'fish-pond', icon: '🐟', colorClass: 'text-gray-700' };

export const ALL_RESOURCE_DEFS: ResourceDef[] = Object.values(resourceData) as ResourceDef[];

// Export alias for compatibility
export const AllResourceDefs = ALL_RESOURCE_DEFS;
