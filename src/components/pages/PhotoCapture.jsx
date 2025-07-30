import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import Input from '@/components/atoms/Input'
import { projectService } from '@/services/api/projectService'
import { photoService } from '@/services/api/photoService'

const PhotoCapture = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState('')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
const [capturedImage, setCapturedImage] = useState(null)
  const [cameraStream, setCameraStream] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const projectsData = await projectService.getAll()
      setProjects(projectsData)
    } catch (err) {
      console.error('Failed to load projects:', err)
      toast.error('Failed to load projects')
    }
  }

const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })
      setCameraStream(stream)
      setShowCamera(true)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Failed to access camera:', err)
      toast.error('Unable to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setShowCamera(false)
  }

  const handleCapturePhoto = async () => {
    if (!selectedProject) {
      toast.error('Please select a project first')
      return
    }

    if (!videoRef.current || !canvasRef.current) {
      toast.error('Camera not ready')
      return
    }

    try {
      setUploading(true)
      
      // Capture photo from video stream
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // Convert to blob
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/jpeg', 0.9)
      })
      
      const imageUrl = URL.createObjectURL(blob)
      setCapturedImage(imageUrl)
      
      // Auto-save the photo
      const newPhoto = {
        projectId: parseInt(selectedProject),
        imageBlob: blob,
        url: imageUrl,
        thumbnailUrl: imageUrl,
        timestamp: new Date().toISOString(),
        uploadedBy: 'John Doe',
        annotations: [],
        tags: [],
        location: {
          latitude: 40.7128,
          longitude: -74.0060
        },
        description: description || 'Project photo'
      }

      await photoService.create(newPhoto)
      toast.success('Photo captured and saved successfully!')
      
      // Reset for next photo but keep camera active
      setCapturedImage(null)
      setDescription('')
      
    } catch (err) {
      console.error('Failed to capture photo:', err)
      toast.error('Failed to capture photo')
    } finally {
      setUploading(false)
    }
  }

  const handleRetake = () => {
    setCapturedImage(null)
    setDescription('')
  }

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [cameraStream])

  const projectOptions = projects.map(project => ({
    value: project.Id.toString(),
    label: project.name
  }))

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-secondary font-display">
            Capture Photo
          </h1>
          <p className="text-gray-600 mt-2 font-body">
            Document your project progress with photos
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ApperIcon name="X" size={20} className="mr-2" />
          Close
        </Button>
      </div>

      {/* Project Selection */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-secondary mb-4 font-display">
          Select Project
        </h2>
        <Select
          options={projectOptions}
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          placeholder="Choose a project for this photo"
        />
      </div>

      {/* Camera Interface */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-secondary mb-4 font-display">
          Camera
        </h2>
        
        <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden mb-6 relative">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured photo"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <ApperIcon name="Camera" size={64} className="text-gray-400 mb-4 mx-auto" />
                <p className="text-gray-400 text-lg">Camera preview</p>
                <p className="text-gray-500 text-sm mt-2">Click capture to take a photo</p>
              </div>
            </div>
          )}
          
          {/* Camera overlay */}
          <div className="absolute inset-0 border-2 border-white/30 rounded-lg pointer-events-none">
            <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-2 py-1 rounded">
              {capturedImage ? 'Photo Captured' : 'Live Preview'}
            </div>
          </div>
        </div>

        {/* Camera Controls */}
{/* Camera Interface */}
        {showCamera && (
          <div className="mb-8">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-h-96 object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute top-4 right-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stopCamera}
                  className="bg-black/50 text-white border-white/30 hover:bg-black/70"
                >
                  <ApperIcon name="X" size={16} className="mr-2" />
                  Close Camera
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          {!showCamera ? (
            <Button
              variant="primary"
              size="lg"
              onClick={startCamera}
              className="btn-hover"
            >
              <ApperIcon name="Camera" size={24} className="mr-2" />
              Open Camera
            </Button>
          ) : (
            <div className="flex items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handleCapturePhoto}
                disabled={uploading || !selectedProject}
                className="btn-hover"
              >
                {uploading ? (
                  <>
                    <ApperIcon name="Loader" size={24} className="mr-2 animate-spin" />
                    Capturing...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Camera" size={24} className="mr-2" />
                    Capture Photo
                  </>
                )}
              </Button>
              
              {!selectedProject && (
                <div className="text-sm text-error">
                  Select a project to capture photos
                </div>
              )}
            </div>
          )}
        </div>

        {capturedImage && (
          <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-secondary font-medium">
                  Photo captured successfully
                </p>
                <p className="text-xs text-gray-500">
                  Ready for next capture
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Photo Details */}
      {capturedImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold text-secondary mb-4 font-display">
            Photo Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Input
                type="text"
                placeholder="Add a description for this photo..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timestamp
                </label>
                <p className="text-gray-600">
                  {new Date().toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="flex items-center text-gray-600">
                  <ApperIcon name="MapPin" size={16} className="mr-2" />
                  40.7128, -74.0060
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-secondary mb-4 font-display">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer"
          >
            <ApperIcon name="Settings" size={24} className="text-gray-400 mb-2" />
            <h4 className="font-semibold text-secondary">Camera Settings</h4>
            <p className="text-sm text-gray-600">Adjust photo quality and settings</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent hover:bg-accent/5 transition-all duration-200 cursor-pointer"
          >
            <ApperIcon name="Upload" size={24} className="text-gray-400 mb-2" />
            <h4 className="font-semibold text-secondary">Upload from Gallery</h4>
            <p className="text-sm text-gray-600">Select existing photos</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-warning hover:bg-warning/5 transition-all duration-200 cursor-pointer"
          >
            <ApperIcon name="Zap" size={24} className="text-gray-400 mb-2" />
            <h4 className="font-semibold text-secondary">Batch Capture</h4>
            <p className="text-sm text-gray-600">Take multiple photos quickly</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default PhotoCapture