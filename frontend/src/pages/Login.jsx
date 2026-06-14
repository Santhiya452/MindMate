import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) return setError('Please fill in all fields.')
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('https://mindmate-e33z.onrender.com/api/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/chat')
    } catch (err) {
      setError('Invalid email or password!')
    }
    setLoading(false)
  }

  const handleKey = (e) => { if (e.key === 'Enter') handleLogin() }

  return (
    <div style={styles.page}>
      <div style={styles.orb1} />
      <div style={styles.orb2} />
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoWrap}>
          <svg width="64" height="54" viewBox="0 0 110 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="mGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path d="M8 82 L8 18 L55 62 L102 18 L102 82"
              stroke="url(#mGrad)" strokeWidth="11"
              strokeLinecap="round" strokeLinejoin="round"
              fill="none" filter="url(#glow)" />
          </svg>
          <div style={styles.brand}>
            <span style={{ color: '#fff' }}>Mind</span>
            <span style={{ color: '#7C3AED' }}>Mate</span>
          </div>
          <p style={styles.tagline}>Your AI Companion for Smarter Learning.</p>
        </div>

        <h2 style={styles.title}>Welcome back 👋</h2>
        <p style={styles.subtitle}>Sign in to continue your journey</p>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.fieldWrap}>
          <label style={styles.label}>Email</label>
          <input type='email' placeholder='you@example.com' value={email}
            onChange={e => setEmail(e.target.value)} onKeyPress={handleKey}
            style={styles.input}
            onFocus={e => e.target.style.borderColor = '#7C3AED'}
            onBlur={e => e.target.style.borderColor = 'rgba(124,58,237,0.2)'} />
        </div>

        <div style={styles.fieldWrap}>
          <label style={styles.label}>Password</label>
          <input type='password' placeholder='••••••••' value={password}
            onChange={e => setPassword(e.target.value)} onKeyPress={handleKey}
            style={styles.input}
            onFocus={e => e.target.style.borderColor = '#7C3AED'}
            onBlur={e => e.target.style.borderColor = 'rgba(124,58,237,0.2)'} />
        </div>

        <button onClick={handleLogin} disabled={loading}
          style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Signing in...' : 'Sign In →'}
        </button>

        <p style={styles.switchText}>
          Don't have an account?{' '}
          <Link to='/register' style={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '100vh', background: '#0F172A', position: 'relative',
    overflow: 'hidden', fontFamily: "'Poppins', sans-serif",
  },
  orb1: {
    position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
    top: '-150px', left: '-150px', pointerEvents: 'none',
    background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
  },
  orb2: {
    position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
    bottom: '-100px', right: '-100px', pointerEvents: 'none',
    background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)',
  },
  card: {
    background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(20px)',
    padding: '48px 40px', borderRadius: '24px', width: '400px',
    border: '1px solid rgba(124,58,237,0.25)', position: 'relative', zIndex: 1,
    boxShadow: '0 0 80px rgba(124,58,237,0.1), 0 20px 60px rgba(0,0,0,0.5)',
  },
  logoWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px', gap: '6px'
  },
  brand: {
    fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px',
  },
  tagline: {
    fontSize: '12px', color: '#CBD5E1', textAlign: 'center', margin: 0
  },
  title: {
    fontSize: '22px', fontWeight: '700', color: '#fff', margin: '0 0 4px 0'
  },
  subtitle: { fontSize: '13px', color: '#64748B', margin: '0 0 24px 0' },
  error: {
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171', padding: '10px 14px', borderRadius: '8px',
    fontSize: '13px', marginBottom: '16px',
  },
  fieldWrap: { marginBottom: '16px' },
  label: {
    display: 'block', fontSize: '12px', fontWeight: '600', color: '#94A3B8',
    marginBottom: '6px', letterSpacing: '0.5px', textTransform: 'uppercase',
  },
  input: {
    width: '100%', padding: '12px 16px', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.2)',
    borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none',
    transition: 'border-color 0.2s', fontFamily: "'Poppins', sans-serif",
  },
  btn: {
    width: '100%', padding: '13px', border: 'none', borderRadius: '10px',
    background: 'linear-gradient(135deg, #7C3AED, #22D3EE)',
    color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
    marginTop: '8px', boxShadow: '0 4px 24px rgba(124,58,237,0.4)',
    fontFamily: "'Poppins', sans-serif", letterSpacing: '0.3px',
  },
  switchText: { textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#64748B' },
  link: { color: '#22D3EE', textDecoration: 'none', fontWeight: '600' },
}

export default Login