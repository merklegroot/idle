import GatherProgressComponent from '@/components/GatherProgressComponent'

interface GatheringProgress {
  isActive: boolean
  progress: number
  tile: { x: number; y: number }
  resourceType: 'stick' | 'stone' | 'thatch' | 'water'
}

interface GatheringProgressDisplayProps {
  gatheringProgress: GatheringProgress | null
}

export default function GatheringProgressDisplay({ gatheringProgress }: GatheringProgressDisplayProps) {
  if (!gatheringProgress) {
    return null
  }

  const getResourceTypeStyles = (resourceType: string) => {
    switch (resourceType) {
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
      default:
        return {
          container: 'bg-gray-50 border border-gray-200',
          text: 'text-gray-600',
          progressBg: 'bg-gray-200',
          progressBar: 'bg-gray-600'
        }
    }
  }

  const styles = getResourceTypeStyles(gatheringProgress.resourceType)

  return (
    <div className={`mb-4 p-4 rounded-lg ${styles.container}`}>
      <div className="flex items-center justify-between mb-2">
        <GatherProgressComponent gatheringProgress={gatheringProgress} />
        <span className={`text-sm font-medium ${styles.text}`}>
          {gatheringProgress.progress}%
        </span>
      </div>
      <div className={`w-full rounded-full h-3 ${styles.progressBg}`}>
        <div
          className={`h-3 rounded-full transition-all duration-300 ease-out ${styles.progressBar}`}
          style={{ width: `${gatheringProgress.progress}%` }}
        ></div>
      </div>
    </div>
  )
}
