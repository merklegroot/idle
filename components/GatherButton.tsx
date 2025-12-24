import { ResourceType } from "@/constants/ResourceDefs";
import { resourceUtil } from "@/utils/resourceUtil";

export function GatherButton({ resourceType, isActing, onPress }: { resourceType: ResourceType, isActing: boolean, onPress: () => void }) {
    const resourceDisplayName = resourceUtil.getResourceDisplayName(resourceType);
    const verb = resourceType === 'water' ? 'Drink' : 'Gather';
    const verbPresentParticiple = resourceType === 'water' ? 'Drinking' : 'Gathering';

    const className = `w-full px-4 py-2 font-semibold rounded-lg transition-colors duration-200 ${isActing
        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
        : 'bg-green-600 hover:bg-green-700 text-white'
        }`;
        
    return (
        <button
            onClick={onPress}
            disabled={isActing}
            className={className}
        >
            {isActing ? `${verbPresentParticiple}...` : `${verb} ${resourceDisplayName}`}
        </button>
    )
}