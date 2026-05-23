import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { scheduleInterview, startInterview } from '../api/api'

const SUGGESTED_TOPICS = [
  { label: 'Java', icon: '☕' },
  { label: 'React', icon: '⚛️' },
  { label: 'Spring Boot', icon: '🍃' },
  { label: 'System Design', icon: '🏗️' },
  { label: 'Data Structures', icon: '🧩' },
  { label: 'Python', icon: '🐍' },
  { label: 'SQL', icon: '🗄️' },
  { label: 'Machine Learning', icon: '🤖' },
]

function Schedule() {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState('idle') // idle | scheduling | generating
  const navigate = useNavigate()

  const handleStart = async (selectedTopic) => {
    const finalTopic = selectedTopic || topic
    if (!finalTopic.trim()) { setError('Please enter or select a topic.'); return }
    setError('')
    setLoading(true)

    try {
      setStep('scheduling')
      const scheduleRes = await scheduleInterview(finalTopic)
      const sessionId = scheduleRes.data.id

      setStep('generating')
      await startInterview(sessionId)

      navigate(`/interview/${sessionId}`)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setStep('idle')
    } finally {
      setLoading(false)
    }
  }

  const getStepMessage = () => {
    if (step === 'scheduling') return '📋 Creating your session...'
    if (step === 'generating') return '🤖 AI is generating your questions...'
    return ''
  }

  return (
    <div className="min-h-screen" style={{background: '#f8f7ff'}}>

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
            🧠
          </div>
          <span className="font-bold text-gray-800 text-lg">AI Interviewer</span>
        </div>
        <button onClick={() => navigate('/dashboard')}
          className="text-sm px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
          ← Back to Dashboard
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-8 py-14">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5"
            style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
            🎯
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Start a Mock Interview</h1>
          <p className="text-gray-400 text-sm">Choose a topic and our AI will generate 10 questions for you</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">

          {/* Topic input */}
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
            Interview Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Java, React, System Design..."
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent mb-6 disabled:opacity-50"
          />

          {/* Suggested topics */}
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Quick pick</p>
          <div className="grid grid-cols-4 gap-2 mb-8">
            {SUGGESTED_TOPICS.map((t) => (
              <button
                key={t.label}
                onClick={() => !loading && handleStart(t.label)}
                disabled={loading}
                className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition text-sm font-medium text-gray-600 disabled:opacity-40"
              >
                <span className="text-xl">{t.icon}</span>
                <span className="text-xs">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm bg-red-50 text-red-500 border border-red-100">
              {error}
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm text-indigo-600 border flex items-center gap-3"
              style={{background: '#f8f7ff', borderColor: '#e0e0ff'}}>
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              {getStepMessage()}
            </div>
          )}

          {/* Start button */}
          <button
            onClick={() => handleStart(null)}
            disabled={loading || !topic.trim()}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-40 transition hover:opacity-90"
            style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
            {loading ? 'Preparing Interview...' : 'Start Interview →'}
          </button>

        </div>

        {/* Info note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          🤖 Powered by Groq LLaMA — questions are generated fresh every time
        </p>

      </div>
    </div>
  )
}

export default Schedule