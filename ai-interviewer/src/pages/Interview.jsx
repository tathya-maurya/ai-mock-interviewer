import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { resumeInterview, submitAnswer } from '../api/api'

function Interview() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    resumeInterview(id)
      .then(res => {
        // backend returns array directly
        const allQuestions = Array.isArray(res.data) ? res.data : []
        setQuestions(allQuestions)
        // find first unanswered question
        const firstUnanswered = allQuestions.findIndex(q => !q.answer)
        setCurrentIndex(firstUnanswered === -1 ? 0 : firstUnanswered)
      })
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false))
  }, [])

  const currentQuestion = questions[currentIndex]
  const progress = questions.length > 0
    ? Math.round((currentIndex / questions.length) * 100)
    : 0

  const handleSubmit = async () => {
    if (!answer.trim()) { setError('Please write an answer before submitting.'); return }
    setError('')
    setSubmitting(true)
    try {
      const res = await submitAnswer(currentQuestion.id, answer)
      setFeedback(res.data)
    } catch {
      setError('Failed to submit answer. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleNext = () => {
    const nextIndex = currentIndex + 1
    if (nextIndex >= questions.length) {
      navigate(`/results/${id}`)
    } else {
      setCurrentIndex(nextIndex)
      setAnswer('')
      setFeedback(null)
      setError('')
    }
  }

  const getScoreColor = (score) => {
    if (score >= 8) return { color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' }
    if (score >= 5) return { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' }
    return { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{background: '#f8f7ff'}}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Loading your interview...</p>
      </div>
    </div>
  )

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
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <button onClick={() => navigate('/dashboard')}
            className="text-sm px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
            Exit
          </button>
        </div>
      </nav>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-100">
        <div className="h-full transition-all duration-500 rounded-full"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6)'
          }} />
      </div>

      <div className="max-w-2xl mx-auto px-8 py-10">

        {/* Question number + dot tracker */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-semibold px-3 py-1 rounded-full text-white"
            style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
            Q{currentIndex + 1}
          </span>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full transition-all"
                style={{
                  background: i < currentIndex
                    ? '#6366f1'
                    : i === currentIndex
                    ? '#8b5cf6'
                    : '#e5e7eb'
                }} />
            ))}
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6 shadow-sm">
          <p className="text-gray-800 text-lg font-medium leading-relaxed">
            {currentQuestion?.question}
          </p>
        </div>

        {/* Answer area */}
        {!feedback && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
              Your Answer
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              rows={6}
              disabled={submitting}
              className="w-full text-sm text-gray-800 resize-none focus:outline-none disabled:opacity-50"
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
              <span className="text-xs text-gray-300">{answer.length} characters</span>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={submitting || !answer.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-40 transition"
                style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
                {submitting
                  ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</>
                  : 'Submit Answer →'}
              </button>
            </div>
          </div>
        )}

{/* Feedback card */}
{feedback && (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">

    {/* Score header */}
    <div className="flex items-center justify-between mb-5">
      <p className="text-sm font-semibold text-gray-700">AI Feedback</p>
      <span className="text-sm font-bold px-4 py-1.5 rounded-full"
        style={{
          color: getScoreColor(feedback.score).color,
          background: getScoreColor(feedback.score).bg,
          border: `1px solid ${getScoreColor(feedback.score).border}`
        }}>
        Score: {feedback.score} / 10
      </span>
    </div>

    {/* Your answer */}
    <div className="rounded-xl p-4 mb-4" style={{background: '#f8f7ff'}}>
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Your Answer</p>
      <p className="text-sm text-gray-600">{answer}</p>
    </div>

    {/* What was wrong */}
    <div className="rounded-xl p-4 mb-4" style={{background: '#fef2f2', border: '1px solid #fecaca'}}>
      <p className="text-xs uppercase tracking-widest mb-2 font-semibold" style={{color: '#ef4444'}}>
        📝 Feedback
      </p>
      <p className="text-sm text-gray-700 leading-relaxed">{feedback.feedback}</p>
    </div>

    {/* Improvements */}
    {feedback.improvements && (
      <div className="rounded-xl p-4 mb-4" style={{background: '#fffbeb', border: '1px solid #fde68a'}}>
        <p className="text-xs uppercase tracking-widest mb-2 font-semibold" style={{color: '#f59e0b'}}>
          💡 Points to Improve
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">{feedback.improvements}</p>
      </div>
    )}

    {/* Ideal Answer */}
    {feedback.idealAnswer && (
      <div className="rounded-xl p-4 mb-5" style={{background: '#f0fdf4', border: '1px solid #bbf7d0'}}>
        <p className="text-xs uppercase tracking-widest mb-2 font-semibold" style={{color: '#22c55e'}}>
          ✅ Interview Ready Answer
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">{feedback.idealAnswer}</p>
      </div>
    )}

    {/* Next button */}
    <button onClick={handleNext}
      className="w-full py-3 rounded-xl text-white font-semibold text-sm transition hover:opacity-90"
      style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
      {currentIndex + 1 >= questions.length ? '🎉 View Results' : 'Next Question →'}
    </button>
  </div>
)}

      </div>
    </div>
  )
}

export default Interview