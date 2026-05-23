import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getScore } from '../api/api'

function Results() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getScore(id)
      .then(res => setResult(res.data))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false))
  }, [])

  const getScoreColor = (score) => {
    if (score >= 8) return { color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' }
    if (score >= 5) return { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' }
    return { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' }
  }

  const getScoreLabel = (avg) => {
    if (avg >= 8) return { label: 'Excellent', emoji: '🏆' }
    if (avg >= 5) return { label: 'Good', emoji: '👍' }
    return { label: 'Keep Practicing', emoji: '💪' }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background: '#f8f7ff'}}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Loading your results...</p>
      </div>
    </div>
  )

  const avg = result?.averageScore ?? 0
  const attempted = result?.questionsAttempted ?? 0
  const total = result?.totalQuestions ?? 0
  const scoreStyle = getScoreColor(avg)
  const scoreLabel = getScoreLabel(avg)
  const answeredQuestions = result?.questionAnswers?.filter(q => q.answer !== null) ?? []

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

      <div className="max-w-2xl mx-auto px-8 py-10">

        {/* Score hero card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-10 mb-8 shadow-sm text-center">
          <div className="text-5xl mb-4">{scoreLabel.emoji}</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{scoreLabel.label}!</h1>
          <p className="text-gray-400 text-sm mb-6">
            Interview on <span className="font-medium text-gray-600">{result?.interviewTopic}</span>
          </p>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="rounded-xl p-4" style={{background: '#f8f7ff'}}>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Avg Score</p>
              <p className="text-2xl font-bold" style={{color: scoreStyle.color}}>{avg}</p>
            </div>
            <div className="rounded-xl p-4" style={{background: '#f8f7ff'}}>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Attempted</p>
              <p className="text-2xl font-bold text-gray-800">{attempted}</p>
            </div>
            <div className="rounded-xl p-4" style={{background: '#f8f7ff'}}>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-800">{total}</p>
            </div>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(attempted / total) * 100}%`,
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)'
              }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {Math.round((attempted / total) * 100)}% completed
          </p>
        </div>

        {/* Per question breakdown */}
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Question Breakdown
          <span className="text-sm font-normal text-gray-400 ml-2">
            ({answeredQuestions.length} answered)
          </span>
        </h2>

        {answeredQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <p className="text-gray-400 text-sm">No answered questions to show yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-8">
            {answeredQuestions.map((q, i) => {
              const qScore = getScoreColor(q.score)
              return (
                <div key={q.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">

                  {/* Question header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white flex-shrink-0"
                        style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
                        Q{i + 1}
                      </span>
                      <p className="text-sm font-medium text-gray-800 leading-relaxed">{q.question}</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0"
                      style={{color: qScore.color, background: qScore.bg, border: `1px solid ${qScore.border}`}}>
                      {q.score}/10
                    </span>
                  </div>

                  {/* Your answer */}
                  <div className="rounded-xl p-4 mb-3" style={{background: '#f8f7ff'}}>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Your Answer</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{q.answer}</p>
                  </div>

                  {/* Feedback */}
                  <div className="rounded-xl p-4 mb-3" style={{background: '#fef2f2', border: '1px solid #fecaca'}}>
                    <p className="text-xs uppercase tracking-widest mb-1 font-semibold" style={{color: '#ef4444'}}>
                      📝 Feedback
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">{q.aiFeedback}</p>
                  </div>

                  {/* Improvements */}
                  {q.improvements && (
                    <div className="rounded-xl p-4 mb-3" style={{background: '#fffbeb', border: '1px solid #fde68a'}}>
                      <p className="text-xs uppercase tracking-widest mb-1 font-semibold" style={{color: '#f59e0b'}}>
                        💡 Points to Improve
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">{q.improvements}</p>
                    </div>
                  )}

                  {/* Ideal Answer */}
                  {q.idealAnswer && (
                    <div className="rounded-xl p-4" style={{background: '#f0fdf4', border: '1px solid #bbf7d0'}}>
                      <p className="text-xs uppercase tracking-widest mb-1 font-semibold" style={{color: '#22c55e'}}>
                        ✅ Interview Ready Answer
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">{q.idealAnswer}</p>
                    </div>
                  )}

                </div>
              )
            })}
          </div>
        )}

        {/* Bottom actions */}
        <div className="flex gap-4">
          <button onClick={() => navigate('/schedule')}
            className="flex-1 py-3 rounded-xl text-white font-semibold text-sm transition hover:opacity-90"
            style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
            🎯 Start New Interview
          </button>
          <button onClick={() => navigate('/dashboard')}
            className="flex-1 py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default Results