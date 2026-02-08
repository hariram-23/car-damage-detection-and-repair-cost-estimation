import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Upload, X, ArrowLeft } from 'lucide-react'

export default function Analyze() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    carCategory: ''
  })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = (e) => {
    // Check if car category is selected first
    if (!formData.carCategory) {
      setError('Please select a car category first')
      return
    }
    
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (JPG, PNG, etc.)')
        return
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size should be less than 10MB. Please upload a smaller image.')
        return
      }
      
      setError('') // Clear any previous errors
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    
    // Check if car category is selected first
    if (!formData.carCategory) {
      setError('Please select a car category first')
      return
    }
    
    const file = e.dataTransfer.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (JPG, PNG, etc.)')
        return
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size should be less than 10MB. Please upload a smaller image.')
        return
      }
      
      setError('') // Clear any previous errors
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate car category
    if (!formData.carCategory) {
      setError('Please select a car category')
      return
    }
    
    // Validate image
    if (!image) {
      setError('Please upload an image')
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = new FormData()
      data.append('image', image)
      data.append('carCategory', formData.carCategory)

      const res = await axios.post('/api/analysis/analyze', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      navigate(`/report/${res.data.analysis.reportId}`)
    } catch (err) {
      // Show a single unified error message for all image/damage detection issues
      setError('Please upload the image properly or your vehicle has no damage')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <nav className="border-b border-gray-800 px-8 py-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:text-primary transition">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center font-bold">AI</div>
            <span className="text-2xl font-bold">DAMAGESYS</span>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-2">ANALYZE DAMAGE</h1>
          <p className="text-gray-400 mb-8">Upload an image of your vehicle to detect damage and estimate costs</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6 text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
            {/* Vehicle Details */}
            <div className="cyber-border rounded-xl p-6 bg-dark-light/30">
              <h2 className="text-xl font-bold mb-6">Vehicle Details</h2>
              <p className="text-sm text-gray-400 mb-6">Select your car category for accurate cost estimation</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Car Category</label>
                  <select
                    value={formData.carCategory}
                    onChange={(e) => setFormData({ ...formData, carCategory: e.target.value })}
                    className="w-full px-4 py-3 bg-dark border-2 border-gray-700 rounded-lg focus:border-primary outline-none transition"
                  >
                    <option value="">Select Category</option>
                    <option value="Economy">Economy (Budget-friendly vehicles)</option>
                    <option value="Medium">Medium (Mid-range vehicles)</option>
                    <option value="Premium">Premium (Higher-end vehicles)</option>
                    <option value="Luxury">Luxury (Luxury vehicles)</option>
                  </select>
                </div>

                <div className="bg-dark-light/50 rounded-lg p-4 mt-4">
                  <h3 className="text-sm font-semibold mb-2">Category Guide:</h3>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div><span className="text-primary">Economy:</span> Budget-friendly vehicles</div>
                    <div><span className="text-primary">Medium:</span> Mid-range vehicles</div>
                    <div><span className="text-primary">Premium:</span> Higher-end vehicles</div>
                    <div><span className="text-primary">Luxury:</span> Luxury vehicles</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="cyber-border rounded-xl p-6 bg-dark-light/30">
              {!formData.carCategory && (
                <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3 mb-4 text-yellow-400 text-sm">
                  ⚠️ Please select a car category first before uploading an image
                </div>
              )}
              
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
                  formData.carCategory 
                    ? 'border-gray-700 hover:border-primary cursor-pointer' 
                    : 'border-gray-800 opacity-50 cursor-not-allowed'
                }`}
              >
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => { setImage(null); setPreview(null); }}
                      className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <label className={`block ${formData.carCategory ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={!formData.carCategory}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                        formData.carCategory ? 'bg-primary/20' : 'bg-gray-700/20'
                      }`}>
                        <Upload className={formData.carCategory ? 'text-primary' : 'text-gray-600'} size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">DRAG & DROP IMAGE</h3>
                      <p className="text-gray-400 mb-4">
                        {formData.carCategory 
                          ? 'Or click to browse from your computer. Supports JPG and PNG' 
                          : 'Select a car category first to enable upload'}
                      </p>
                      <div className={`px-6 py-3 border-2 rounded-lg transition ${
                        formData.carCategory 
                          ? 'border-gray-700 hover:border-primary' 
                          : 'border-gray-800 opacity-50'
                      }`}>
                        Browse Files
                      </div>
                    </div>
                  </label>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !image || !formData.carCategory}
                className="w-full mt-6 py-4 cyber-button rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Analyze Damage →'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
