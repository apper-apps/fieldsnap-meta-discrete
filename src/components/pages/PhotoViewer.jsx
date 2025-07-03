import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { photoService } from '@/services/api/photoService'
import { projectService } from '@/services/api/projectService'

const PhotoViewer = () => {
  const { photoId } = useParams()
  const navigate = useNavigate()
  const [photo, setPhoto] = useState(null)
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [annotationMode, setAnnotationMode] = useState(false)
  const [annotationText, setAnnotationText] = useState('')
  const [annotations, setAnnotations] = useState([])

  useEffect(() => {
    loadPhotoData()
  }, [photoId])

  const loadPhotoData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const photoData = await photoService.getById(parseInt(photoId))
      setPhoto(photoData)
      setAnnotations(photoData.annotations || [])
      
      // Load project data
      const projectData = await projectService.getById(photoData.projectId)
      setProject(projectData)
    } catch (err) {
      setError('Failed to load photo')
      console.error('Photo viewer error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    loadPhotoData()
  }

  const handleAddAnnotation = (e) => {
    if (!annotationText.trim()) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const newAnnotation = {
      id: Date.now().toString(),
      type: 'text',
      coordinates: { x, y },
      content: annotationText,
      color: '#FF6B35',
      createdBy: 'John Doe'
    }

    setAnnotations([...annotations, newAnnotation])
    setAnnotationText('')
    setAnnotationMode(false)
    toast.success('Annotation added successfully!')
  }

  const handleSaveAnnotations = async () => {
    try {
      const updatedPhoto = {
        ...photo,
        annotations: annotations
      }
      await photoService.update(photo.Id, updatedPhoto)
      toast.success('Annotations saved successfully!')
    } catch (err) {
      console.error('Failed to save annotations:', err)
      toast.error('Failed to save annotations')
    }
  }

  const handleDeletePhoto = async () => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return

    try {
      await photoService.delete(photo.Id)
      toast.success('Photo deleted successfully!')
      navigate(`/projects/${photo.projectId}`)
    } catch (err) {
      console.error('Failed to delete photo:', err)
      toast.error('Failed to delete photo')
    }
  }

  if (loading) {
    return <Loading type="generic" />
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} />
  }

  if (!photo) {
    return <Error message="Photo not found" type="not-found" />
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/projects/${photo.projectId}`)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
            Back to Project
          </Button>
          {project && (
            <div>
              <h1 className="text-2xl font-bold text-secondary font-display">
                {project.name}
              </h1>
              <p className="text-gray-600 text-sm">
                Photo taken on {format(new Date(photo.timestamp), 'MMM dd, yyyy at HH:mm')}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={annotationMode ? 'primary' : 'outline'}
            onClick={() => setAnnotationMode(!annotationMode)}
          >
            <ApperIcon name="MessageSquare" size={20} className="mr-2" />
            {annotationMode ? 'Exit Annotation' : 'Add Annotation'}
          </Button>
          <Button variant="ghost" onClick={handleSaveAnnotations}>
            <ApperIcon name="Save" size={20} className="mr-2" />
            Save
          </Button>
          <Button variant="ghost" onClick={handleDeletePhoto}>
            <ApperIcon name="Trash2" size={20} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Photo Display */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div 
              className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-crosshair"
              onClick={annotationMode ? handleAddAnnotation : undefined}
            >
              {photo.url ? (
                <img
                  src={photo.url}
                  alt={photo.description || 'Project photo'}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ApperIcon name="Camera" size={64} className="text-gray-400" />
                </div>
              )}
              
              {/* Annotations */}
              {annotations.map((annotation) => (
                <div
                  key={annotation.id}
                  className="absolute"
                  style={{
                    left: `${annotation.coordinates.x}%`,
                    top: `${annotation.coordinates.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="bg-primary text-white px-3 py-2 rounded-lg shadow-lg max-w-xs">
                    <p className="text-sm">{annotation.content}</p>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary"></div>
                  </div>
                </div>
              ))}
              
              {/* Annotation mode overlay */}
              {annotationMode && (
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  <div className="text-center">
                    <ApperIcon name="MessageSquare" size={32} className="text-primary mb-2 mx-auto" />
                    <p className="text-primary font-medium">Click anywhere to add annotation</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Annotation Input */}
            {annotationMode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-gray-50 rounded-lg"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annotation Text
                </label>
                <Input
                  type="text"
                  placeholder="Enter annotation text..."
                  value={annotationText}
                  onChange={(e) => setAnnotationText(e.target.value)}
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Photo Details Sidebar */}
        <div className="space-y-6">
          {/* Photo Metadata */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-secondary mb-4 font-display">
              Photo Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Description
                </label>
                <p className="text-secondary">{photo.description || 'No description'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Timestamp
                </label>
                <p className="text-secondary">
                  {format(new Date(photo.timestamp), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Uploaded By
                </label>
                <p className="text-secondary">{photo.uploadedBy}</p>
              </div>
              
              {photo.location && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Location
                  </label>
                  <div className="flex items-center text-secondary">
                    <ApperIcon name="MapPin" size={16} className="mr-2" />
                    {photo.location.latitude}, {photo.location.longitude}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Annotations List */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-secondary mb-4 font-display">
              Annotations ({annotations.length})
            </h3>
            <div className="space-y-3">
              {annotations.length === 0 ? (
                <p className="text-gray-500 text-sm">No annotations yet</p>
              ) : (
                annotations.map((annotation) => (
                  <div
                    key={annotation.id}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <p className="text-sm text-secondary mb-1">
                      {annotation.content}
                    </p>
                    <p className="text-xs text-gray-500">
                      by {annotation.createdBy}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-secondary mb-4 font-display">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {photo.tags && photo.tags.length > 0 ? (
                photo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No tags</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-secondary mb-4 font-display">
              Actions
            </h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                <ApperIcon name="Download" size={16} className="mr-2" />
                Download
              </Button>
              <Button variant="outline" className="w-full">
                <ApperIcon name="Share" size={16} className="mr-2" />
                Share
              </Button>
              <Button variant="outline" className="w-full">
                <ApperIcon name="Edit" size={16} className="mr-2" />
                Edit Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhotoViewer