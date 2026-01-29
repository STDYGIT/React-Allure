import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStats, getContacts, getVideos, getServices } from '../api/api'
import { Video, Users, UserPlus, Briefcase, Mail, Home, LogOut } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalServices: 0,
    totalContacts: 0,
    newLeads: 0
  })
  const [recentContacts, setRecentContacts] = useState([])
  const [recentVideos, setRecentVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem('adminToken')

  useEffect(() => {
    if (!token) {
      navigate('/pops')
      return
    }
    loadData()
  }, [token, navigate])

  const loadData = async () => {
    try {
      const [statsData, contactsData, videosData, servicesData] = await Promise.all([
        getStats(token),
        getContacts(token),
        getVideos(),
        getServices()
      ])

      setStats({
        totalVideos: videosData.length || 0,
        totalServices: servicesData.length || 0,
        totalContacts: contactsData.length || 0,
        newLeads: contactsData.filter(c => !c.is_contacted).length || 0
      })

      setRecentContacts(contactsData.slice(0, 5))
      setRecentVideos(videosData.slice(0, 5))
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/pops')
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
      {/* Navigation */}
      <nav className="glass-effect border-b border-yellow-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold gradient-text">Allure Marketing Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-300 hover:text-yellow-400 transition-colors">
                <Home className="w-5 h-5" />
              </a>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-yellow-400 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold gradient-text mb-2">Dashboard</h2>
          <p className="text-gray-400">Manage your Allure Marketing website</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Videos</p>
                <p className="text-2xl font-bold text-white">{stats.totalVideos}</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Video className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="stat-card p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Contacts</p>
                <p className="text-2xl font-bold text-white">{stats.totalContacts}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="stat-card p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">New Leads</p>
                <p className="text-2xl font-bold text-white">{stats.newLeads}</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <UserPlus className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="stat-card p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Services</p>
                <p className="text-2xl font-bold text-white">{stats.totalServices}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Briefcase className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => navigate('/pops/videos')}
            className="stat-card p-6 rounded-xl hover:scale-105 transition-transform text-left"
          >
            <div className="text-center">
              <Video className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1">Manage Videos</h3>
              <p className="text-gray-400 text-sm">Upload and organize videos</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/pops/contacts')}
            className="stat-card p-6 rounded-xl hover:scale-105 transition-transform text-left"
          >
            <div className="text-center">
              <Mail className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1">View Contacts</h3>
              <p className="text-gray-400 text-sm">Manage contact submissions</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/pops/services')}
            className="stat-card p-6 rounded-xl hover:scale-105 transition-transform text-left"
          >
            <div className="text-center">
              <Briefcase className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1">Edit Services</h3>
              <p className="text-gray-400 text-sm">Update service offerings</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/pops/contacts')}
            className="stat-card p-6 rounded-xl hover:scale-105 transition-transform text-left"
          >
            <div className="text-center">
              <UserPlus className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1">Notifications</h3>
              <p className="text-gray-400 text-sm">View new leads</p>
            </div>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Contacts */}
          <div className="glass-effect p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-4">Recent Contacts</h3>
            <div className="space-y-4">
              {recentContacts.length > 0 ? (
                recentContacts.map((contact, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-semibold text-white">{contact.name || 'N/A'}</p>
                      <p className="text-gray-400 text-sm">{contact.email || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">
                        {contact.created_at ? new Date(contact.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                      {!contact.is_contacted && (
                        <span className="inline-block px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full mt-1">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No contacts yet.</p>
              )}
            </div>
          </div>

          {/* Recent Videos */}
          <div className="glass-effect p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-4">Recent Videos</h3>
            <div className="space-y-4">
              {recentVideos.length > 0 ? (
                recentVideos.map((video) => (
                  <div key={video.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {video.thumbnail_url ? (
                        <img src={video.thumbnail_url} alt={video.video_name} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                          <Video className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-white">{video.video_name}</p>
                        <p className="text-gray-400 text-sm">
                          {video.video_types?.name || 'No category'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">
                        {video.created_at ? new Date(video.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No videos uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
