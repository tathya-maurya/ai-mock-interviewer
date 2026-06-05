import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    setError('')
    setLoading(true)
    try {
    const res = await axios.post('http://localhost:8080/auth/register', { name, email, password })

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('name', res.data.name)
      localStorage.setItem('email', res.data.email)
      navigate('/dashboard')
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE — Brand Panel */}
      <div className="hidden md:flex w-1/2 flex-col items-center justify-center px-12 relative overflow-hidden"
        style={{background: 'linear-gradient(160deg, #6366f1 0%, #8b5cf6 60%, #a855f7 100%)'}}>

        {/* Decorative circles */}
        <div className="absolute w-64 h-64 rounded-full opacity-20 top-[-60px] left-[-60px]"
          style={{background: 'rgba(255,255,255,0.3)'}} />
        <div className="absolute w-48 h-48 rounded-full opacity-10 bottom-[-40px] right-[-40px]"
          style={{background: 'rgba(255,255,255,0.3)'}} />
        <div className="absolute w-32 h-32 rounded-full opacity-10 bottom-[20%] left-[10%]"
          style={{background: 'rgba(255,255,255,0.3)'}} />

        {/* Content */}
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl"
            style={{background: 'rgba(255,255,255,0.2)'}}>
            🧠
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Join AI Mock<br />Interviewer
          </h1>
          <p className="text-lg mb-10" style={{color: 'rgba(255,255,255,0.75)'}}>
            Your journey to success starts here.
          </p>

          {/* Steps */}
          <div className="flex flex-col gap-3 text-left">
            {[
              ['1', 'Create your free account'],
              ['2', 'Schedule a mock interview'],
              ['3', 'Answer AI questions & get scored'],
            ].map(([num, text]) => (
              <div key={num} className="flex items-center gap-4 px-5 py-3 rounded-xl text-sm text-white"
                style={{background: 'rgba(255,255,255,0.15)'}}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                  style={{background: 'rgba(255,255,255,0.25)'}}>
                  {num}
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — Form Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8 bg-white">
        <div className="w-full max-w-md">

          {/* Top label */}
          <p className="text-xs uppercase tracking-widest font-medium mb-8"
            style={{color: '#6366f1'}}>
            AI Mock Interviewer
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create account 🚀</h2>
          <p className="text-gray-400 text-sm mb-8">Start practicing interviews for free today</p>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm bg-red-50 text-red-500 border border-red-100">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
              Full name
            </label>
            <input type="text" value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
              Email address
            </label>
            <input type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
            />
          </div>

          {/* Password */}
          <div className="mb-8">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">
              Password
            </label>
            <input type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
            />
          </div>

          {/* Button */}
          <button onClick={handleRegister} disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50 transition duration-200"
            style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
            {loading ? 'Creating account...' : 'Create account →'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-300">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium" style={{color: '#6366f1'}}>
              Sign in here
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Register