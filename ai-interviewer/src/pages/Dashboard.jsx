import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllInterviews } from '../api/api'

function Dashboard() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const name = localStorage.getItem('name') || 'there'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    getAllInterviews()
      .then(res => setInterviews(res.data))
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const getScoreColor = (score) => {
    if (score >= 8) return { color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' }
    if (score >= 5) return { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' }
    return { color: '#ef4444', bg: '#fef2f2', border: '#fecaca' }
  }

  const getStatusBadge = (status) => {
    if (status === 'COMPLETED') return { label: 'Completed', color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' }
    if (status === 'IN_PROGRESS') return { label: 'In Progress', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' }
    return { label: status, color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' }
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
              {name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-600 font-medium">{name}</span>
          </div>
          <button onClick={handleLogout}
            className="text-sm px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">

        {/* Header row */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hey, {name} 👋
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Ready for your next interview practice?
            </p>
          </div>
          <button onClick={() => navigate('/schedule')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-lg transition hover:opacity-90"
            style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
            + New Interview
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Sessions', value: interviews.length },
            { label: 'Completed', value: interviews.filter(i => i.status === 'COMPLETED').length },
            { label: 'In Progress', value: interviews.filter(i => i.status === 'IN_PROGRESS').length },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl px-6 py-5 border border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Interviews list */}
        <h2 className="text-lg font-bold text-gray-800 mb-4">Past Interviews</h2>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading your interviews...</div>
        ) : interviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 text-center py-20">
            <div className="text-5xl mb-4">🎯</div>
            <p className="text-gray-500 font-medium">No interviews yet</p>
            <p className="text-gray-400 text-sm mt-1">Start your first one to see results here</p>
            <button onClick={() => navigate('/schedule')}
              className="mt-6 px-6 py-3 rounded-xl text-white text-sm font-semibold"
              style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
              Start First Interview
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {interviews.map((interview) => {
              const status = getStatusBadge(interview.status)
              const scoreStyle = getScoreColor(interview.totalScore)
              return (
                <div key={interview.id}
                  className="bg-white rounded-2xl border border-gray-100 px-6 py-5 flex items-center justify-between hover:shadow-md transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{background: '#f8f7ff'}}>
                      💼
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{interview.interviewTopic}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(interview.scheduledDate.split('.')[0]).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Status badge */}
                    <span className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{color: status.color, background: status.bg, border: `1px solid ${status.border}`}}>
                      {status.label}
                    </span>

                    {/* Score */}
                    {interview.totalScore != null && (
                      <span className="text-xs px-3 py-1 rounded-full font-bold"
                        style={{color: scoreStyle.color, background: scoreStyle.bg, border: `1px solid ${scoreStyle.border}`}}>
                        Score: {interview.totalScore}/10
                      </span>
                    )}

                    {/* Action button */}
                    {interview.status === 'COMPLETED' ? (
                      <button onClick={() => navigate(`/results/${interview.id}`)}
                        className="text-sm px-4 py-2 rounded-xl text-white font-medium"
                        style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
                        View Results
                      </button>
                    ) : (
                      <button onClick={() => navigate(`/interview/${interview.id}`)}
                        className="text-sm px-4 py-2 rounded-xl font-medium border"
                        style={{color: '#6366f1', borderColor: '#6366f1'}}>
                        Resume
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard