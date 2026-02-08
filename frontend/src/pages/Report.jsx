import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, RefreshCw } from 'lucide-react'

// Component to draw bounding boxes on image
function ImageWithBoundingBoxes({ imageUrl, detections }) {
  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const containerRef = useRef(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (imageLoaded && canvasRef.current && imageRef.current) {
      drawBoundingBoxes()
    }
  }, [imageLoaded, detections])

  const drawBoundingBoxes = () => {
    const canvas = canvasRef.current
    const image = imageRef.current
    const container = containerRef.current
    
    if (!canvas || !image || !container) return
    
    const ctx = canvas.getContext('2d')

    // Calculate scale to fit container
    const containerWidth = container.clientWidth
    const scale = containerWidth / image.naturalWidth

    // Set canvas size
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${image.naturalHeight * scale}px`

    // Draw the image
    ctx.drawImage(image, 0, 0)

    // Draw bounding boxes for each detection
    if (detections && detections.length > 0) {
      detections.forEach((detection) => {
        const { x1, y1, x2, y2 } = detection.boundingBox
        const width = x2 - x1
        const height = y2 - y1

        // Draw semi-transparent fill
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)'
        ctx.fillRect(x1, y1, width, height)

        // Draw rectangle border
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 4
        ctx.strokeRect(x1, y1, width, height)

        // Draw label background
        const label = `${detection.damageType} - ${detection.confidence}%`
        ctx.font = 'bold 20px Arial'
        const textMetrics = ctx.measureText(label)
        const textWidth = textMetrics.width
        const textHeight = 28
        const padding = 10

        // Position label above box, or inside if too close to top
        const labelY = y1 > textHeight + 10 ? y1 - 6 : y1 + textHeight + 10

        ctx.fillStyle = '#ef4444'
        ctx.fillRect(x1, labelY - textHeight, textWidth + padding * 2, textHeight + 4)

        // Draw label text
        ctx.fillStyle = '#ffffff'
        ctx.fillText(label, x1 + padding, labelY - 8)
      })
    }
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(false)
  }

  // Construct full image URL
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`

  return (
    <div ref={containerRef} className="relative w-full">
      <img
        ref={imageRef}
        src={fullImageUrl}
        alt="Vehicle Damage"
        className="hidden"
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      {imageError ? (
        <div className="w-full h-64 bg-red-900/20 border border-red-500 rounded-lg flex items-center justify-center">
          <div className="text-red-400">Failed to load image</div>
        </div>
      ) : imageLoaded ? (
        <canvas
          ref={canvasRef}
          className="w-full h-auto rounded-lg shadow-lg"
        />
      ) : (
        <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-gray-400">Loading image...</div>
        </div>
      )}
    </div>
  )
}

export default function Report() {
  const { reportId } = useParams()
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statusUpdating, setStatusUpdating] = useState(false)

  useEffect(() => {
    console.log('Report ID:', reportId)
    fetchAnalysis()
  }, [reportId])

  const fetchAnalysis = async () => {
    try {
      console.log('Fetching analysis for:', reportId)
      // Handle both formats: with and without # prefix
      const cleanReportId = reportId.startsWith('%23') ? reportId.substring(3) : reportId.replace('#', '')
      console.log('Clean report ID:', cleanReportId)
      const res = await axios.get(`/api/analysis/${encodeURIComponent(cleanReportId)}`)
      console.log('Analysis response:', res.data)
      setAnalysis(res.data.analysis)
    } catch (error) {
      console.error('Failed to fetch analysis:', error)
      console.error('Error details:', error.response?.data)
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = async () => {
    try {
      const res = await axios.get(`/api/analysis/${reportId}/pdf`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `report-${reportId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Failed to download PDF:', error)
    }
  }

  const updateStatus = async (newStatus) => {
    try {
      setStatusUpdating(true)
      const cleanReportId = reportId.startsWith('%23') ? reportId.substring(3) : reportId.replace('#', '')
      await axios.patch(`/api/dashboard/${cleanReportId}/status`, {
        status: newStatus,
        needsReview: false
      })
      setAnalysis({ ...analysis, status: newStatus, needsReview: false })
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setStatusUpdating(false)
    }
  }

  const toggleNeedsReview = async () => {
    try {
      setStatusUpdating(true)
      const cleanReportId = reportId.startsWith('%23') ? reportId.substring(3) : reportId.replace('#', '')
      const newNeedsReview = !analysis.needsReview
      await axios.patch(`/api/dashboard/${cleanReportId}/status`, {
        needsReview: newNeedsReview
      })
      setAnalysis({ ...analysis, needsReview: newNeedsReview })
    } catch (error) {
      console.error('Failed to toggle review flag:', error)
    } finally {
      setStatusUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-primary text-2xl">Loading Report...</div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-red-400 text-2xl">Report not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <nav className="border-b border-gray-800 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:text-primary transition">
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded flex items-center justify-center font-bold">AI</div>
              <span className="text-2xl font-bold">DAMAGESYS</span>
            </div>
          </div>
          <div className="text-sm text-gray-400">Premium User</div>
        </div>
      </nav>

      <div className="container mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Report Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">ANALYSIS REPORT</h1>
              <p className="text-gray-400">ID: {analysis.reportId}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  analysis.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  analysis.status === 'reviewed' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {analysis.status?.toUpperCase() || 'PENDING'}
                </span>
                {analysis.needsReview && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">
                    NEEDS REVIEW
                  </span>
                )}
                {analysis.damageDetection.confidence < 70 && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400">
                    LOW CONFIDENCE
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/analyze')}
                className="flex items-center gap-2 px-6 py-3 border-2 border-primary/30 rounded-lg hover:border-primary transition"
              >
                <RefreshCw size={20} /> Analyze Again
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-6 py-3 cyber-button rounded-lg font-semibold"
              >
                <Download size={20} /> Download PDF
              </button>
            </div>
          </div>

          {/* Status Management */}
          <div className="cyber-border rounded-xl p-6 bg-dark-light/30 mb-8">
            <h3 className="text-lg font-bold mb-4">Review Status</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => updateStatus('pending')}
                disabled={statusUpdating}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  analysis.status === 'pending'
                    ? 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-400'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => updateStatus('reviewed')}
                disabled={statusUpdating}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  analysis.status === 'reviewed'
                    ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-400'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Reviewed
              </button>
              <button
                onClick={() => updateStatus('completed')}
                disabled={statusUpdating}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  analysis.status === 'completed'
                    ? 'bg-green-500/20 text-green-400 border-2 border-green-400'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                Completed
              </button>
              <div className="ml-auto">
                <button
                  onClick={toggleNeedsReview}
                  disabled={statusUpdating}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    analysis.needsReview
                      ? 'bg-red-500/20 text-red-400 border-2 border-red-400'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {analysis.needsReview ? '⚠️ Needs Review' : 'Flag for Review'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Image with Detection */}
            <div className="cyber-border rounded-xl p-6 bg-dark-light/30">
              <h3 className="text-lg font-bold mb-4">Damage Detection</h3>
              <ImageWithBoundingBoxes 
                imageUrl={analysis.imageUrl} 
                detections={analysis.detections || []} 
              />
              {analysis.detections && analysis.detections.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-gray-400">Detected Damages:</div>
                  {analysis.detections.map((detection, index) => (
                    <div key={index} className="flex justify-between items-center bg-dark-light/50 rounded p-2">
                      <span className="text-sm font-semibold">{detection.damageType}</span>
                      <span className="text-xs text-primary">{detection.confidence}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Analysis Details */}
            <div className="space-y-6">
              {/* Cost */}
              <div className="cyber-border rounded-xl p-6 bg-dark-light/30">
                <div className="text-sm text-gray-400 mb-2">ESTIMATED REPAIR COST</div>
                <div className="text-5xl font-bold text-primary mb-4">{analysis.estimatedCost}</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Damage Type</div>
                    <div className="font-bold">{analysis.damageDetection.damageType}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Severity</div>
                    <div className={`font-bold ${
                      analysis.damageDetection.severity === 'Severe' ? 'text-red-400' :
                      analysis.damageDetection.severity === 'Moderate' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {analysis.damageDetection.severity}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Confidence */}
              <div className="cyber-border rounded-xl p-6 bg-dark-light/30">
                <div className="text-lg font-bold mb-4">AI Confidence Score</div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-400">Detection Confidence</span>
                      <span className="text-primary font-bold">{analysis.damageDetection.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${analysis.damageDetection.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                    <div>
                      <div className="text-sm text-gray-400">Affected Area</div>
                      <div className="font-bold">{analysis.damageDetection.affectedArea} px²</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Model Version</div>
                      <div className="font-bold">{analysis.modelVersion}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="cyber-border rounded-xl p-6 bg-dark-light/30">
                <div className="text-lg font-bold mb-4">Vehicle Information</div>
                <div className="space-y-2">
                  {analysis.vehicleDetails.carCategory && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category:</span>
                      <span className="font-semibold text-primary">{analysis.vehicleDetails.carCategory}</span>
                    </div>
                  )}
                  {analysis.vehicleDetails.carType && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="font-semibold">{analysis.vehicleDetails.carType}</span>
                    </div>
                  )}
                  {analysis.vehicleDetails.brand && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Brand:</span>
                      <span className="font-semibold">{analysis.vehicleDetails.brand}</span>
                    </div>
                  )}
                  {analysis.vehicleDetails.model && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Model:</span>
                      <span className="font-semibold">{analysis.vehicleDetails.model}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
