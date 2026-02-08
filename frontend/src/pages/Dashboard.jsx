import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, IndianRupee, CheckCircle, Clock, Plus, LogOut } from 'lucide-react'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get('/api/dashboard/stats')
      setStats(res.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    setShowLogoutConfirm(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-primary text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="cyber-border rounded-xl p-8 bg-dark max-w-md w-full mx-4"
          >
            <h3 className="text-2xl font-bold mb-4">Confirm Logout</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-700 rounded-lg hover:border-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-6 py-3 cyber-button rounded-lg font-semibold"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <nav className="border-b border-gray-800 px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center font-bold">AI</div>
            <span className="text-2xl font-bold">DAMAGESYS</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm text-gray-400">Premium User</div>
              <div className="font-semibold">{user?.firstName} {user?.lastName}</div>
            </div>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <button onClick={() => setShowLogoutConfirm(true)} className="p-2 hover:text-primary transition">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">DASHBOARD</h1>
            <p className="text-gray-400">Overview of your damage analysis activity</p>
          </div>
          <button
            onClick={() => navigate('/analyze')}
            className="flex items-center gap-2 px-6 py-3 cyber-button rounded-lg font-semibold"
          >
            <Plus size={20} /> New Analysis
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: TrendingUp, label: 'Total Scans', value: stats?.stats.totalScans || 0, change: '+2 from last week', color: 'text-blue-400' },
            { icon: IndianRupee, label: 'Avg Repair Cost', value: `₹${(stats?.stats.avgRepairCost || 0).toLocaleString('en-IN')}`, change: '+1.5% from last month', color: 'text-green-400' },
            { icon: CheckCircle, label: 'Accuracy Rate', value: `${stats?.stats.accuracyRate || 0}%`, change: 'Based on user feedback', color: 'text-primary' },
            { icon: Clock, label: 'Pending Reviews', value: stats?.stats.pendingReviews || 0, change: 'Action required', color: 'text-yellow-400' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="cyber-border rounded-xl p-6 bg-dark-light/30"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`${stat.color}`} size={24} />
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.change}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts and Recent Analysis */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Cost Trends Chart */}
          <div className="md:col-span-2 cyber-border rounded-xl p-6 bg-dark-light/30">
            <h2 className="text-xl font-bold mb-6">Cost Estimation Trends (INR)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.costTrends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1f3a', border: '1px solid #00d9ff' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Avg Cost']}
                />
                <Line type="monotone" dataKey="cost" stroke="#00d9ff" strokeWidth={3} dot={{ fill: '#00d9ff', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Analysis */}
          <div className="cyber-border rounded-xl p-6 bg-dark-light/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recent Analysis</h2>
              <button onClick={() => navigate('/history')} className="text-primary text-sm hover:underline">
                View All History
              </button>
            </div>
            <div className="space-y-4">
              {stats?.recentAnalyses?.slice(0, 3).map((analysis, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/report/${analysis.reportId}`)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark/50 cursor-pointer transition"
                >
                  <div className="w-12 h-12 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                    {analysis.imageUrl ? (
                      <img 
                        src={`http://localhost:5000${analysis.imageUrl}`} 
                        alt="Vehicle damage" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23374151" width="48" height="48"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239CA3AF" font-family="Arial" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{analysis.vehicleName || 'Unknown Vehicle'}</div>
                    <div className="text-xs text-gray-400">{analysis.damageType}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-primary font-bold">₹{analysis.cost}</div>
                    <div className="text-xs text-gray-500">{new Date(analysis.date).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
