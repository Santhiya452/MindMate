import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Settings() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')

  const [activeSection, setActiveSection] = useState('profile')
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [darkMode, setDarkMode] = useState(true)
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [faqOpen, setFaqOpen] = useState(null)
  const [bugReport, setBugReport] = useState('')
  const [bugSent, setBugSent] = useState(false)

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type })
    setTimeout(() => setMsg({ text: '', type: '' }), 3000)
  }

  const handleSaveName = () => {
    if (!name.trim()) return showMsg('Name cannot be empty!', 'error')
    const updatedUser = { ...user, name }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    showMsg('Name updated successfully! ✓')
  }

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword)
      return showMsg('Please fill all fields!', 'error')
    if (newPassword !== confirmPassword)
      return showMsg('Passwords do not match!', 'error')
    if (newPassword.length < 6)
      return showMsg('Password must be at least 6 characters!', 'error')
    showMsg('Password updated successfully! ✓')
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
  }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  const handleBugReport = () => {
    if (!bugReport.trim()) return showMsg('Please describe the bug!', 'error')
    setBugSent(true)
    setBugReport('')
    setTimeout(() => setBugSent(false), 4000)
  }

  const faqs = [
    { q: 'How do I start a new chat?', a: 'Click the New Chat button in the sidebar to start a fresh conversation.' },
    { q: 'Is my chat data private?', a: 'Yes! Your chats are stored securely and only accessible to you via your account.' },
    { q: 'Why is MindMate not responding?', a: 'This may be due to an API issue. Please check your internet connection and try again.' },
    { q: 'Can I use MindMate on mobile?', a: 'Yes! MindMate works on any browser including mobile browsers.' },
    { q: 'How do I delete my account?', a: 'Contact us at support.mindmate@gmail.com and we will process your request within 24 hours.' },
  ]

  const sections = [
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'appearance', icon: '🎨', label: 'Appearance' },
    { id: 'support', icon: '❓', label: 'Support' },
    { id: 'about', icon: 'ℹ️', label: 'About' },
  ]
  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#0a0e1a}
        ::-webkit-scrollbar-thumb{background:#2d2060;border-radius:2px}
        .nav-item:hover{background:rgba(124,58,237,0.1) !important;color:#a78bfa !important;}
        .save-btn:hover{box-shadow:0 4px 20px rgba(124,58,237,0.5) !important;}
        .faq-item:hover{border-color:rgba(124,58,237,0.4) !important;}
        input:focus{outline:none;border-color:rgba(124,58,237,0.5) !important;}
        textarea:focus{outline:none;border-color:rgba(124,58,237,0.5) !important;}
      `}</style>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 20 L12 4 L20 20" stroke="url(#lg)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 14 L17 14" stroke="url(#lg)" strokeWidth="2" strokeLinecap="round"/>
              <defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs>
            </svg>
          </div>
          <span style={styles.logoText}>MindMate</span>
        </div>

        <button style={styles.backBtn} onClick={() => navigate('/chat')}>
          Back to Chat
        </button>

        <nav style={{ flex: 1 }}>
          {sections.map(s => (
            <button key={s.id} className="nav-item"
              style={{ ...styles.navItem, ...(activeSection === s.id ? styles.navItemActive : {}) }}
              onClick={() => setActiveSection(s.id)}>
              <span style={{ fontSize: '16px' }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </nav>

        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>

        <div style={styles.userRow}>
          <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <div style={{ overflow: 'hidden' }}>
            <p style={styles.userName}>{user?.name}</p>
            <p style={styles.userEmail}>{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Settings</h1>
          {msg.text && (
            <div style={{ ...styles.toast, background: msg.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(34,211,238,0.1)', borderColor: msg.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(34,211,238,0.3)', color: msg.type === 'error' ? '#f87171' : '#22d3ee' }}>
              {msg.text}
            </div>
          )}
        </div>

        <div style={styles.content}>

          {activeSection === 'profile' && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Profile</h2>
              <div style={styles.card}>
                <p style={styles.cardLabel}>Display Name</p>
                <input value={name} onChange={e => setName(e.target.value)} style={styles.input} placeholder="Your name" />
                <button className="save-btn" style={styles.saveBtn} onClick={handleSaveName}>Save Name</button>
              </div>
              <div style={styles.card}>
                <p style={styles.cardLabel}>Email Address</p>
                <input value={email} disabled style={{ ...styles.input, opacity: 0.5, cursor: 'not-allowed' }} />
                <p style={styles.hint}>Email cannot be changed for security reasons.</p>
              </div>
              <div style={styles.card}>
                <p style={styles.cardLabel}>Change Password</p>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={{ ...styles.input, marginBottom: '10px' }} placeholder="Current password" />
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ ...styles.input, marginBottom: '10px' }} placeholder="New password" />
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ ...styles.input, marginBottom: '14px' }} placeholder="Confirm new password" />
                <button className="save-btn" style={styles.saveBtn} onClick={handleChangePassword}>Update Password</button>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Appearance</h2>
              <div style={styles.card}>
                <p style={styles.cardLabel}>Theme</p>
                <div style={styles.toggleRow}>
                  <div>
                    <p style={{ color: '#e2e8f0', fontSize: '14px', margin: '0 0 4px', fontWeight: '500' }}>Dark Mode</p>
                    <p style={{ color: '#4a5578', fontSize: '12px', margin: 0 }}>Easy on the eyes at night</p>
                  </div>
                  <button onClick={() => setDarkMode(d => !d)} style={{ ...styles.toggle, background: darkMode ? 'linear-gradient(135deg, #7c3aed, #22d3ee)' : 'rgba(255,255,255,0.1)' }}>
                    <div style={{ ...styles.toggleThumb, transform: darkMode ? 'translateX(22px)' : 'translateX(2px)' }} />
                  </button>
                </div>
              </div>
              <div style={styles.card}>
                <p style={styles.cardLabel}>Chat Bubble Color</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  {['#7c3aed', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444'].map(color => (
                    <div key={color} style={{ width: '32px', height: '32px', borderRadius: '50%', background: color, cursor: 'pointer', border: '2px solid rgba(255,255,255,0.1)' }} />
                  ))}
                </div>
                <p style={styles.hint}>More themes coming soon!</p>
              </div>
            </div>
          )}

          {activeSection === 'support' && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Support</h2>
              <div style={styles.card}>
                <p style={styles.cardLabel}>Frequently Asked Questions</p>
                {faqs.map((faq, i) => (
                  <div key={i} className="faq-item" style={styles.faqItem} onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                    <div style={styles.faqQ}>
                      <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '500' }}>{faq.q}</span>
                      <span style={{ color: '#7c3aed', fontSize: '16px' }}>{faqOpen === i ? '▲' : '▼'}</span>
                    </div>
                    {faqOpen === i && <p style={{ color: '#8892b0', fontSize: '13px', margin: '10px 0 0', lineHeight: '1.6' }}>{faq.a}</p>}
                  </div>
                ))}
              </div>
              <div style={styles.card}>
                <p style={styles.cardLabel}>Contact Us</p>
                <div style={styles.contactRow}>
                  <span style={{ fontSize: '20px' }}>📧</span>
                  <div>
                    <p style={{ color: '#e2e8f0', fontSize: '13px', margin: '0 0 2px', fontWeight: '500' }}>Email Support</p>
                    <a href="mailto:support.mindmate@gmail.com" style={{ color: '#22d3ee', fontSize: '12px', textDecoration: 'none' }}>support.mindmate@gmail.com</a>
                  </div>
                </div>
              </div>
              <div style={styles.card}>
                <p style={styles.cardLabel}>Report a Bug</p>
                {bugSent
                  ? <div style={{ textAlign: 'center', padding: '20px' }}>
                      <div style={{ fontSize: '36px' }}>✅</div>
                      <p style={{ color: '#22d3ee', fontSize: '14px', marginTop: '10px' }}>Bug reported! Thank you</p>
                    </div>
                  : <>
                      <textarea value={bugReport} onChange={e => setBugReport(e.target.value)} style={{ ...styles.input, height: '100px', resize: 'none', fontFamily: 'Poppins, sans-serif' }} placeholder="Describe the bug you found..." />
                      <button className="save-btn" style={{ ...styles.saveBtn, marginTop: '10px' }} onClick={handleBugReport}>Send Bug Report</button>
                    </>
                }
              </div>
            </div>
          )}

          {activeSection === 'about' && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>About</h2>
              <div style={{ ...styles.card, textAlign: 'center', padding: '36px' }}>
                <div style={styles.aboutLogo}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                    <path d="M4 20 L12 4 L20 20" stroke="url(#alg)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 14 L17 14" stroke="url(#alg)" strokeWidth="2" strokeLinecap="round"/>
                    <defs><linearGradient id="alg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs>
                  </svg>
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: '700', margin: '14px 0 6px', color: '#e2e8f0' }}>MindMate</h3>
                <p style={{ color: '#4a5578', fontSize: '12px', margin: '0 0 20px' }}>Version 1.0.0</p>
                <p style={{ color: '#8892b0', fontSize: '13px', lineHeight: '1.7', margin: '0 0 24px' }}>Your AI companion for smarter learning and mental wellness.</p>
                <div style={styles.divider} />
                <p style={{ color: '#4a5578', fontSize: '11px', margin: '20px 0 6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Created by</p>
                <p style={{ color: '#a78bfa', fontSize: '15px', fontWeight: '700', margin: '0 0 4px' }}>Santhiya</p>
                <p style={{ color: '#4a5578', fontSize: '12px', margin: '0 0 20px' }}>BCA Student, Chennai</p>
                <div style={styles.divider} />
                <p style={{ color: '#4a5578', fontSize: '11px', margin: '20px 0 10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Powered by</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {['Gemini AI', 'MongoDB', 'React', 'Node.js'].map(tech => (
                    <span key={tech} style={styles.techBadge}>{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
const styles = {
  root: {
    display: 'flex', height: '100vh',
    background: '#0f172a',
    fontFamily: "'Poppins', sans-serif",
    color: '#e2e8f0', overflow: 'hidden'
  },
  sidebar: {
    width: '240px', minWidth: '240px',
    background: '#0a0f1e',
    borderRight: '1px solid rgba(124,58,237,0.15)',
    display: 'flex', flexDirection: 'column',
    padding: '0 0 16px'
  },
  logoWrap: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '22px 18px 14px'
  },
  logoIcon: {
    width: '34px', height: '34px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #7c3aed, #22d3ee)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, boxShadow: '0 0 18px rgba(124,58,237,0.45)'
  },
  logoText: {
    fontSize: '17px', fontWeight: '700',
    background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  backBtn: {
    margin: '0 14px 16px',
    padding: '10px',
    background: 'rgba(124,58,237,0.1)',
    border: '1px solid rgba(124,58,237,0.25)',
    borderRadius: '12px', color: '#a78bfa',
    fontSize: '13px', fontWeight: '600',
    cursor: 'pointer', fontFamily: "'Poppins', sans-serif",
    transition: 'all 0.2s'
  },
  navItem: {
    width: '100%', padding: '11px 18px',
    background: 'transparent', border: 'none',
    color: '#4a5578', fontSize: '13px', fontWeight: '500',
    cursor: 'pointer', display: 'flex', alignItems: 'center',
    gap: '10px', fontFamily: "'Poppins', sans-serif",
    transition: 'all 0.2s', textAlign: 'left'
  },
  navItemActive: {
    background: 'rgba(124,58,237,0.12)',
    color: '#a78bfa',
    borderRight: '2px solid #7c3aed'
  },
  logoutBtn: {
    margin: '8px 14px',
    padding: '10px',
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '12px', color: '#f87171',
    fontSize: '13px', cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif", fontWeight: '500'
  },
  userRow: {
    padding: '14px 18px 0',
    borderTop: '1px solid rgba(124,58,237,0.12)',
    display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px'
  },
  avatar: {
    width: '34px', height: '34px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #7c3aed, #22d3ee)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', fontWeight: '700', flexShrink: 0
  },
  userName: { fontSize: '13px', fontWeight: '600', color: '#e2e8f0', margin: 0 },
  userEmail: { fontSize: '10px', color: '#4a5578', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: {
    padding: '20px 32px',
    borderBottom: '1px solid rgba(124,58,237,0.12)',
    background: 'rgba(10,15,30,0.85)',
    backdropFilter: 'blur(12px)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
  },
  headerTitle: {
    fontSize: '22px', fontWeight: '700', margin: 0,
    background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  toast: {
    padding: '8px 18px', borderRadius: '10px',
    border: '1px solid', fontSize: '13px', fontWeight: '500'
  },
  content: { flex: 1, overflowY: 'auto', padding: '28px 32px' },
  section: { maxWidth: '640px' },
  sectionTitle: {
    fontSize: '18px', fontWeight: '700', margin: '0 0 20px',
    color: '#e2e8f0'
  },
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(124,58,237,0.15)',
    borderRadius: '16px', padding: '22px',
    marginBottom: '16px'
  },
  cardLabel: {
    fontSize: '11px', color: '#4a5578', fontWeight: '700',
    letterSpacing: '1.2px', textTransform: 'uppercase',
    margin: '0 0 12px'
  },
  input: {
    width: '100%', padding: '10px 14px',
    boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(124,58,237,0.2)',
    borderRadius: '10px', color: '#e2e8f0',
    fontSize: '13px', fontFamily: "'Poppins', sans-serif",
    transition: 'border-color 0.2s'
  },
  saveBtn: {
    padding: '10px 24px',
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    border: 'none', borderRadius: '10px',
    color: '#fff', fontSize: '13px', fontWeight: '600',
    cursor: 'pointer', fontFamily: "'Poppins', sans-serif",
    boxShadow: '0 2px 14px rgba(124,58,237,0.35)',
    transition: 'all 0.2s', marginTop: '4px'
  },
  hint: { color: '#4a5578', fontSize: '11px', margin: '8px 0 0' },
  toggleRow: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between'
  },
  toggle: {
    width: '48px', height: '26px', borderRadius: '13px',
    border: 'none', cursor: 'pointer',
    position: 'relative', transition: 'all 0.3s', flexShrink: 0
  },
  toggleThumb: {
    width: '22px', height: '22px', borderRadius: '50%',
    background: '#fff', position: 'absolute', top: '2px',
    transition: 'transform 0.3s'
  },
  faqItem: {
    padding: '14px', borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.06)',
    marginBottom: '8px', cursor: 'pointer',
    transition: 'all 0.2s'
  },
  faqQ: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  contactRow: {
    display: 'flex', alignItems: 'center', gap: '14px',
    padding: '12px', background: 'rgba(124,58,237,0.06)',
    borderRadius: '10px', border: '1px solid rgba(124,58,237,0.15)'
  },
  divider: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' },
  aboutLogo: {
    width: '72px', height: '72px', borderRadius: '20px',
    background: 'linear-gradient(135deg, #7c3aed, #22d3ee)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto', boxShadow: '0 0 32px rgba(124,58,237,0.4)'
  },
  techBadge: {
    padding: '5px 14px',
    background: 'rgba(124,58,237,0.1)',
    border: '1px solid rgba(124,58,237,0.25)',
    borderRadius: '20px', color: '#a78bfa',
    fontSize: '12px', fontWeight: '500'
  }
}

export default Settings