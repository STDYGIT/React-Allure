import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getServices, createService, updateService, deleteService } from '../api/api'
import * as LucideIcons from 'lucide-react'
const { Briefcase, Plus, Edit, Trash2, ArrowLeft, X, Camera, Paintbrush } = LucideIcons

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon_id: '',
    is_active: true,
    order: 0
  })
  const navigate = useNavigate()
  const token = localStorage.getItem('adminToken')

  useEffect(() => {
    if (!token) {
      navigate('/pops')
      return
    }
    loadServices()
  }, [token, navigate])

  const loadServices = async () => {
    try {
      const data = await getServices()
      setServices(data)
    } catch (error) {
      console.error('Error loading services:', error)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to render the correct Lucide icon
  const renderIcon = (service) => {
    // Check if service has icon information
    if (service.service_icons && service.service_icons.length > 0) {
      const iconClass = service.service_icons[0].icon_class
      
      // Convert icon_class to PascalCase for Lucide icon names
      // e.g., 'code' -> 'Code', 'pen-tool' -> 'PenTool', 'share-2' -> 'Share2'
      const iconName = iconClass
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('')
      
      // Get the icon component from Lucide
      const IconComponent = LucideIcons[iconName]
      
      if (IconComponent) {
        return <IconComponent className="w-6 h-6" />
      }
    }
    
    // Fallback to Briefcase icon
    return <Briefcase className="w-6 h-6" />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingService) {
        await updateService(editingService.id, formData, token)
      } else {
        await createService(formData, token)
      }
      
      setShowModal(false)
      setEditingService(null)
      resetForm()
      loadServices()
    } catch (error) {
      console.error('Error saving service:', error)
      alert('Error saving service. Please try again.')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    
    try {
      await deleteService(id, token)
      loadServices()
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Error deleting service. Please try again.')
    }
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setFormData({
      name: service.name || '',
      description: service.description || '',
      icon_id: service.icon_id || '',
      is_active: service.is_active !== undefined ? service.is_active : true,
      order: service.order || 0
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon_id: '',
      is_active: true,
      order: 0
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)'
      }}>
        <div className="text-white text-xl">Loading...</div>
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
            <h2 className="text-3xl font-bold gradient-text">Manage Services</h2>
          </div>
          <button
            onClick={() => {
              setEditingService(null)
              resetForm()
              setShowModal(true)
            }}
            className="flex items-center gap-2 gold-gradient text-black font-semibold px-6 py-3 rounded-lg hover-glow transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Service
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="glass-effect p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="service-icon w-12 h-12 rounded-full flex items-center justify-center">
                  {renderIcon(service)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  service.is_active 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {service.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-gray-500">Order: {service.order}</span>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No services found. Add your first service!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-effect p-8 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold gradient-text">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingService(null)
                  resetForm()
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500/60"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500/60"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Icon ID
                </label>
                <input
                  type="text"
                  value={formData.icon_id}
                  onChange={(e) => setFormData({ ...formData, icon_id: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500/60"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Active
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-white/5 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500/60"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 gold-gradient text-black font-semibold py-3 px-6 rounded-lg hover-glow transition-all"
                >
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingService(null)
                    resetForm()
                  }}
                  className="px-6 py-3 glass-effect text-white font-semibold rounded-lg hover-glow transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}