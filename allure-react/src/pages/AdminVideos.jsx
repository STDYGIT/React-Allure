import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getVideos, createVideo, updateVideo, deleteVideo } from '../api/api'
import { Video, Plus, Edit, Trash2, ArrowLeft, X, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function AdminVideos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingVideo, setEditingVideo] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const [formData, setFormData] = useState({
    video_name: '',
    video_description: '',
    video_type_id: '',
    is_featured: false,
    order: 0
  })
  const [videoFile, setVideoFile] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const navigate = useNavigate()
  const token = localStorage.getItem('adminToken')

  useEffect(() => {
    if (!token) {
      navigate('/pops')
      return
    }
    loadVideos()
  }, [token, navigate])

  const loadVideos = async () => {
    try {
      const data = await getVideos()
      setVideos(data)
    } catch (error) {
      console.error('Error loading videos:', error)
      showToast('Failed to load videos', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' })
    }, 4000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.video_name.trim()) {
      showToast('Video name is required', 'error')
      return
    }
    
    if (!formData.video_description.trim()) {
      showToast('Video description is required', 'error')
      return
    }

    if (!editingVideo && !videoFile) {
      showToast('Please select a video file to upload', 'error')
      return
    }

    setUploading(true)
    
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('video_name', formData.video_name)
      formDataToSend.append('video_description', formData.video_description)
      formDataToSend.append('video_type_id', formData.video_type_id || '')
      formDataToSend.append('is_featured', formData.is_featured)
      formDataToSend.append('order', formData.order)
      
      if (videoFile) {
        // Validate video file size (e.g., max 100MB)
        const maxSize = 100 * 1024 * 1024 // 100MB
        if (videoFile.size > maxSize) {
          showToast('Video file is too large. Maximum size is 100MB', 'error')
          setUploading(false)
          return
        }
        formDataToSend.append('video', videoFile)
      }
      
      if (thumbnailFile) {
        // Validate thumbnail file size (e.g., max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (thumbnailFile.size > maxSize) {
          showToast('Thumbnail file is too large. Maximum size is 5MB', 'error')
          setUploading(false)
          return
        }
        formDataToSend.append('thumbnail', thumbnailFile)
      }

      if (editingVideo) {
        await updateVideo(editingVideo.id, formData, token)
        showToast('Video updated successfully!', 'success')
      } else {
        await createVideo(formDataToSend, token)
        showToast('Video uploaded successfully!', 'success')
      }
      
      setShowModal(false)
      setEditingVideo(null)
      resetForm()
      loadVideos()
    } catch (error) {
      console.error('Error saving video:', error)
      const errorMessage = error.response?.data?.error || error.message || 'Failed to save video'
      showToast(errorMessage, 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this video?')) return
    
    try {
      await deleteVideo(id, token)
      showToast('Video deleted successfully!', 'success')
      loadVideos()
    } catch (error) {
      console.error('Error deleting video:', error)
      showToast('Failed to delete video', 'error')
    }
  }

  const handleEdit = (video) => {
    setEditingVideo(video)
    setFormData({
      video_name: video.video_name || '',
      video_description: video.video_description || '',
      video_type_id: video.video_type_id || '',
      is_featured: video.is_featured || false,
      order: video.order || 0
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      video_name: '',
      video_description: '',
      video_type_id: '',
      is_featured: false,
      order: 0
    })
    setVideoFile(null)
    setThumbnailFile(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)'
      }}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
          <div className="text-white text-xl">Loading videos...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/pops/dashboard')}
              className="text-gray-300 hover:text-yellow-400 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold gradient-text">Manage Videos</h2>
          </div>
          <button
            onClick={() => {
              setEditingVideo(null)
              resetForm()
              setShowModal(true)
            }}
            className="flex items-center gap-2 gold-gradient text-black font-semibold px-6 py-3 rounded-lg hover-glow transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Video
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="glass-effect p-6 rounded-xl">
              {video.thumbnail_url ? (
                <img src={video.thumbnail_url} alt={video.video_name} className="w-full h-48 object-cover rounded-lg mb-4" />
              ) : (
                <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                  <Video className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-2">{video.video_name}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{video.video_description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {video.video_types?.name || 'No category'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(video)}
                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {videos.length === 0 && (
          <div className="text-center py-12">
            <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No videos found. Add your first video!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-effect p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold gradient-text">
                {editingVideo ? 'Edit Video' : 'Add New Video'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingVideo(null)
                  resetForm()
                }}
                className="text-gray-400 hover:text-white transition-colors"
                disabled={uploading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Video Name *
                </label>
                <input
                  type="text"
                  value={formData.video_name}
                  onChange={(e) => setFormData({ ...formData, video_name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500/60"
                  required
                  disabled={uploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.video_description}
                  onChange={(e) => setFormData({ ...formData, video_description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500/60"
                  rows="4"
                  required
                  disabled={uploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Video Type ID
                </label>
                <input
                  type="number"
                  value={formData.video_type_id}
                  onChange={(e) => setFormData({ ...formData, video_type_id: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500/60"
                  disabled={uploading}
                />
              </div>

              {!editingVideo && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Video File * (Max 100MB)
                    </label>
                    <div className="flex items-center gap-4">
                      <label className={`flex items-center gap-2 cursor-pointer gold-gradient text-black font-semibold px-4 py-2 rounded-lg hover-glow ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <Upload className="w-5 h-5" />
                        Upload Video
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => setVideoFile(e.target.files[0])}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                      {videoFile && (
                        <span className="text-gray-400 text-sm truncate max-w-xs">{videoFile.name}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Thumbnail Image (Max 5MB)
                    </label>
                    <div className="flex items-center gap-4">
                      <label className={`flex items-center gap-2 cursor-pointer gold-gradient text-black font-semibold px-4 py-2 rounded-lg hover-glow ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <Upload className="w-5 h-5" />
                        Upload Thumbnail
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setThumbnailFile(e.target.files[0])}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                      {thumbnailFile && (
                        <span className="text-gray-400 text-sm truncate max-w-xs">{thumbnailFile.name}</span>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4"
                    disabled={uploading}
                  />
                  Featured
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-white/5 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500/60"
                  disabled={uploading}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className={`flex-1 flex items-center justify-center gap-2 gold-gradient text-black font-semibold py-3 px-6 rounded-lg hover-glow transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>{editingVideo ? 'Update Video' : 'Create Video'}</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingVideo(null)
                    resetForm()
                  }}
                  className="px-6 py-3 glass-effect text-white font-semibold rounded-lg hover-glow transition-all"
                  disabled={uploading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-6 left-6 z-[60] text-white px-6 py-4 rounded-lg shadow-2xl transform transition-all duration-700 ease-in-out ${
            toast.show ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
          } ${
            toast.type === 'success' 
              ? 'bg-gradient-to-r from-green-600 to-green-500 border border-green-400' 
              : 'bg-gradient-to-r from-red-600 to-red-500 border border-red-400'
          }`}
        >
          <div className="flex items-center space-x-3">
            {toast.type === 'success' ? (
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
            )}
            <span className="font-medium text-base">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}