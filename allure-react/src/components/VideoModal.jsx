import { useState, useEffect } from 'react'

export default function VideoModal({ video, onClose }) {
  const [error, setError] = useState(false)

  useEffect(() => {
    // Close on escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const handleVideoError = () => {
    setError(true)
  }

  if (!video) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative rounded-3xl overflow-hidden shadow-lg border border-yellow-500"
        style={{ 
          maxWidth: '360px', 
          aspectRatio: '9/16',
          boxShadow: '0 0 25px 5px rgba(255, 216, 0, 0.6)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Local Video */}
        <video
          src={video.video_url}
          className="w-full h-full object-cover"
          autoPlay
          controls
          playsInline
          onError={handleVideoError}
        >
          <source src={video.video_url} type="video/mp4" />
          <source src={video.video_url} type="video/webm" />
          <source src={video.video_url} type="video/ogg" />
          Your browser does not support the video tag.
        </video>

        {/* Error Message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 text-white text-center text-sm">
            <p>Sorry, the video could not be loaded.</p>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-lg bg-black bg-opacity-50 px-2 py-1 rounded hover:bg-opacity-70 transition"
        >
          ×
        </button>
      </div>
    </div>
  )
}