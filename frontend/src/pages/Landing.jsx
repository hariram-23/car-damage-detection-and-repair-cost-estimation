import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Zap, Target, FileText } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dark relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <nav className="relative z-10 flex justify-between items-center px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded flex items-center justify-center font-bold">AI</div>
          <span className="text-2xl font-bold tracking-wider">DAMAGESYS</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/login')} className="px-6 py-2 text-white hover:text-primary transition">
            Sign In
          </button>
          <button onClick={() => navigate('/signup')} className="px-8 py-2 cyber-button rounded-lg font-semibold">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-12 py-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block px-4 py-2 bg-primary/20 rounded-full text-primary text-sm mb-6">
            AI-POWERED ANALYSIS
          </div>
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            INSTANT<br />
            <span className="text-primary text-glow">DAMAGE</span><br />
            DETECTION
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Upload a photo of your vehicle and let our advanced computer vision algorithms analyze the damage, estimate repair costs, and generate a detailed report in seconds.
          </p>
          <div className="flex gap-4">
            <button onClick={() => navigate('/signup')} className="px-8 py-4 cyber-button rounded-lg font-semibold text-lg">
              Start Analysis →
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="cyber-border rounded-2xl p-8 bg-dark-light/50 backdrop-blur">
            <div className="text-primary text-6xl mb-4">🚗</div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Ready for Analysis</span>
                <span className="text-primary font-bold">Upload Image</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <div className="relative z-10 container mx-auto px-12 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">WHY CHOOSE US</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: 'INSTANT RESULTS', desc: 'Get damage analysis and cost estimates quickly using advanced computer vision technology.' },
            { icon: Target, title: 'ACCURATE DETECTION', desc: 'Advanced algorithms designed to identify and assess vehicle damage with precision.' },
            { icon: FileText, title: 'DETAILED REPORTS', desc: 'Generate comprehensive PDF reports suitable for insurance claims and repair documentation.' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="cyber-border rounded-xl p-8 bg-dark-light/30 hover:bg-dark-light/50 transition"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="relative z-10 text-center py-8 text-gray-500 text-sm">
        © 2025 AI Damage Analyzer. All rights reserved
      </footer>
    </div>
  )
}
