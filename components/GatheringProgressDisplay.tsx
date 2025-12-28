import GatherProgressComponent from '@/components/GatherProgressComponent';
import { ActionId } from '@/constants/ActionDefs';
import { resourceUtil } from '@/utils/resourceUtil';

export interface GatheringProgressProps {
  isActive: boolean
  progress: number
  tile: { x: number; y: number }
  actionId: ActionId
}

interface GatheringProgressDisplayProps {
  gatheringProgress: GatheringProgressProps | undefined
}

export default function GatheringProgressDisplay({ gatheringProgress }: GatheringProgressDisplayProps) {
  // Always render the container to maintain consistent layout
  const isActive = gatheringProgress !== null && gatheringProgress !== undefined;

  const getResourceTypeStyles = (actionId: ActionId | undefined) => {
    const defafultStyles = {
      container: 'bg-gray-50 border border-gray-200',
      text: 'text-gray-600',
      progressBg: 'bg-gray-200',
      progressBar: 'bg-gray-600'
    }

    if (!actionId) return defafultStyles;

    
    const resourceId = resourceUtil.getResultingResourceIdFromActionId(actionId);
    if (!resourceId) return defafultStyles;

    // TODO: the varations from the standard display should be
    // part of the resource defs, not part of a method.
    switch (resourceId) {
      case 'stick':
        return {
          container: 'bg-green-50 border border-green-200',
          text: 'text-green-600',
          progressBg: 'bg-green-200',
          progressBar: 'bg-green-600'
        }
      case 'thatch':
        return {
          container: 'bg-yellow-50 border border-yellow-200',
          text: 'text-yellow-600',
          progressBg: 'bg-yellow-200',
          progressBar: 'bg-yellow-600'
        }
      case 'berry':
        return {
          container: 'bg-purple-50 border border-purple-200',
          text: 'text-purple-600',
          progressBg: 'bg-purple-200',
          progressBar: 'bg-purple-600'
        }
      case 'twine':
        return {
          container: 'bg-amber-50 border border-amber-200',
          text: 'text-amber-600',
          progressBg: 'bg-amber-200',
          progressBar: 'bg-amber-600'
        }
      case 'knapped-axe-head':
        return {
          container: 'bg-gray-50 border border-gray-200',
          text: 'text-gray-700',
          progressBg: 'bg-gray-200',
          progressBar: 'bg-gray-700'
        }
      default:
        return {
          container: 'bg-gray-50 border border-gray-200',
          text: 'text-gray-600',
          progressBg: 'bg-gray-200',
          progressBar: 'bg-gray-600'
        }
    }
  }

  const styles = isActive ? getResourceTypeStyles(gatheringProgress?.actionId) : {
    container: 'bg-gray-50 border border-gray-200',
    text: 'text-gray-600',
    progressBg: 'bg-gray-200',
    progressBar: 'bg-gray-600'
  }

  return (
    <div className={`mb-4 p-4 rounded-lg ${styles.container}`}>
      <div className="flex items-center justify-between mb-2">
        {isActive ? (
          <>
            <GatherProgressComponent gatheringProgress={gatheringProgress} />
            <span className={`text-sm font-medium ${styles.text}`}>
              {gatheringProgress?.progress}%
            </span>
          </>
        ) : (
          <>
            <div className="text-sm text-gray-500">No gathering in progress</div>
            <span className="text-sm font-medium text-gray-500">0%</span>
          </>
        )}
      </div>
      <div className={`w-full rounded-full h-3 ${styles.progressBg}`}>
        <div
          className={`h-3 rounded-full transition-all duration-300 ease-out ${styles.progressBar}`}
          style={{ width: isActive ? `${gatheringProgress?.progress}%` : '0%' }}
        ></div>
      </div>
    </div>
  )
}
