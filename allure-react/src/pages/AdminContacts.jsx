import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getContacts } from '../api/api'
import { Mail, ArrowLeft, User, Phone, MapPin, Building, Instagram, MessageSquare, Calendar } from 'lucide-react'

export default function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, new, contacted
  const navigate = useNavigate()
  const token = localStorage.getItem('adminToken')

  useEffect(() => {
    if (!token) {
      navigate('/pops')
      return
    }
    loadContacts()
  }, [token, navigate])

  const loadContacts = async () => {
    try {
      const data = await getContacts(token)
      setContacts(data)
    } catch (error) {
      console.error('Error loading contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'new') return !contact.is_contacted
    if (filter === 'contacted') return contact.is_contacted
    return true
  })

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
            <h2 className="text-3xl font-bold gradient-text">Contacts & Notifications</h2>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'all'
                ? 'gold-gradient text-black font-semibold'
                : 'glass-effect text-gray-300 hover:text-white'
            }`}
          >
            All ({contacts.length})
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'new'
                ? 'gold-gradient text-black font-semibold'
                : 'glass-effect text-gray-300 hover:text-white'
            }`}
          >
            New ({contacts.filter(c => !c.is_contacted).length})
          </button>
          <button
            onClick={() => setFilter('contacted')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'contacted'
                ? 'gold-gradient text-black font-semibold'
                : 'glass-effect text-gray-300 hover:text-white'
            }`}
          >
            Contacted ({contacts.filter(c => c.is_contacted).length})
          </button>
        </div>

        {/* Contacts List */}
        <div className="space-y-4">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact, idx) => (
              <div key={idx} className="glass-effect p-6 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{contact.name || 'N/A'}</h3>
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {contact.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {!contact.is_contacted && (
                      <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full mb-2">
                        New
                      </span>
                    )}
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {contact.created_at 
                        ? new Date(contact.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {contact.contact && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{contact.contact}</span>
                    </div>
                  )}
                  {contact.business_name && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Building className="w-4 h-4" />
                      <span className="text-sm">{contact.business_name}</span>
                    </div>
                  )}
                  {contact.city && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{contact.city}</span>
                    </div>
                  )}
                  {contact.insta_id && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Instagram className="w-4 h-4" />
                      <span className="text-sm">@{contact.insta_id}</span>
                    </div>
                  )}
                </div>

                {contact.services && contact.services.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">Services Interested In:</p>
                    <div className="flex flex-wrap gap-2">
                      {contact.services.map((service, sIdx) => (
                        <span key={sIdx} className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {contact.message && (
                  <div className="mt-4 p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-300 mb-2">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm font-medium">Message:</span>
                    </div>
                    <p className="text-gray-400 text-sm">{contact.message}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No contacts found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
