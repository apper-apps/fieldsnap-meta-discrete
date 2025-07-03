import { motion } from 'framer-motion'

const Loading = ({ type = 'dashboard' }) => {
  const renderDashboardSkeleton = () => (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-gray-200 rounded-lg shimmer"></div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg shimmer"></div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="h-4 w-24 bg-gray-200 rounded shimmer mb-2"></div>
            <div className="h-8 w-16 bg-gray-200 rounded shimmer"></div>
          </div>
        ))}
      </div>

      {/* Project grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="h-6 w-3/4 bg-gray-200 rounded shimmer mb-3"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded shimmer mb-4"></div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="aspect-square bg-gray-200 rounded-lg shimmer"></div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 bg-gray-200 rounded shimmer"></div>
              <div className="h-6 w-16 bg-gray-200 rounded-full shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderPhotosSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="aspect-square bg-gray-200 rounded-lg shimmer"></div>
      ))}
    </div>
  )

  const renderProjectDetailSkeleton = () => (
    <div className="space-y-6">
      {/* Project header skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="h-8 w-64 bg-gray-200 rounded shimmer mb-2"></div>
        <div className="h-4 w-48 bg-gray-200 rounded shimmer mb-4"></div>
        <div className="flex items-center gap-4">
          <div className="h-6 w-20 bg-gray-200 rounded-full shimmer"></div>
          <div className="h-4 w-32 bg-gray-200 rounded shimmer"></div>
        </div>
      </div>

      {/* Photo grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded-lg shimmer"></div>
        ))}
      </div>
    </div>
  )

  const renderGenericSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
          <div className="h-4 w-3/4 bg-gray-200 rounded shimmer mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded shimmer"></div>
        </div>
      ))}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="animate-pulse"
    >
      {type === 'dashboard' && renderDashboardSkeleton()}
      {type === 'photos' && renderPhotosSkeleton()}
      {type === 'project-detail' && renderProjectDetailSkeleton()}
      {type === 'generic' && renderGenericSkeleton()}
    </motion.div>
  )
}

export default Loading