import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'

const PhotoTile = ({ photo, showProject = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="photo-tile"
    >
      <Link to={`/photos/${photo.Id}`}>
        <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden">
          {photo.thumbnailUrl ? (
            <img
              src={photo.thumbnailUrl}
              alt={photo.description || 'Project photo'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ApperIcon name="Camera" size={32} className="text-gray-400" />
            </div>
          )}
          
          {/* Overlay with metadata */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="text-white text-sm font-medium mb-1">
                {format(new Date(photo.timestamp), 'MMM dd, HH:mm')}
              </div>
              {photo.description && (
                <div className="text-white/80 text-xs truncate">
                  {photo.description}
                </div>
              )}
              {photo.annotations && photo.annotations.length > 0 && (
                <div className="flex items-center mt-2">
                  <ApperIcon name="MessageSquare" size={14} className="text-white/80 mr-1" />
                  <span className="text-white/80 text-xs">
                    {photo.annotations.length} annotations
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default PhotoTile