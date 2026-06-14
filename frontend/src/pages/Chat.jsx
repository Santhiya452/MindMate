import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function renderMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:#1e1b4b;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:13px;color:#22d3ee">$1</code>')
    .replace(/^### (.+)$/gm, '<h3 style="color:#22d3ee;font-size:15px;margin:12px 0 4px 0">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="color:#22d3ee;font-size:17px;margin:14px 0 6px 0">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="color:#22d3ee;font-size:19px;margin:16px 0 8px 0">$1</h1>')
    .replace(/^\* (.+)$/gm, '<div style="display:flex;gap:8px;margin:3px 0"><span style="color:#7c3aed">•</span><span>$1</span></div>')
    .replace(/^\d+\. (.+)$/gm, '<div style="display:flex;gap:8px;margin:3px 0"><span style="color:#22d3ee">→</span><span>$1</span></div>')
    .replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>')
}

const MOODS = [
  { emoji: '😊', label: 'Happy', color: '#10b981' },
  { emoji: '😐', label: 'Okay', color: '#f59e0b' },
  { emoji: '😔', label: 'Sad', color: '#6366f1' },
  { emoji: '😤', label: 'Stressed', color: '#ef4444' },
  { emoji: '😰', label: 'Anxious', color: '#8b5cf6' },
]

function Chat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [chatId, setChatId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sidebarTab, setSidebarTab] = useState('history')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mood, setMood] = useState(null)
  const [showMood, setShowMood] = useState(true)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [chatHistory, setChatHistory] = useState([])
  const [settingsName, setSettingsName] = useState('')
  const [settingsMsg, setSettingsMsg] = useState('')
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')

  useEffect(() => { if (!token) navigate('/') }, [])
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])
  useEffect(() => { setSettingsName(user?.name || '') }, [])

  const sendMessage = async (msgText) => {
    const text = msgText || message
    if (!text.trim()) return
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setMessage('')
    setLoading(true)
    try {
      const res = await axios.post('https://mindmate-e33z.onrender.com/api/chat/send',
        { message: text, chatId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setChatId(res.data.chatId)
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.message }])
      setChatHistory(prev => {
        const exists = prev.find(c => c.id === res.data.chatId)
        if (exists) return prev
        return [{ id: res.data.chatId, preview: text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...prev]
      })
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    }
    setLoading(false)
  }

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }

  const copyMessage = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const clearChat = () => { setMessages([]); setChatId(null); setShowMood(true); setMood(null) }

  const selectMood = (m) => { setMood(m); setShowMood(false); sendMessage(`My mood right now: ${m.emoji} ${m.label}`) }

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return alert('Voice not supported. Please use Chrome!')
    const recognition = new SR()
    recognition.lang = 'en-US'
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (e) => setMessage(e.results[0][0].transcript)
    recognition.onerror = () => setIsListening(false)
    recognition.start()
  }

  const handleLogout = () => { localStorage.clear(); navigate('/') }

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes blink { 0%,80%,100%{opacity:0.2} 40%{opacity:1} }
        @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#0a0e1a}
        ::-webkit-scrollbar-thumb{background:#2d2060;border-radius:2px}
        textarea{resize:none;}
        textarea:focus{outline:none;}
        textarea::placeholder{color:#4a5578;}
        .quick-btn:hover{background:rgba(124,58,237,0.15) !important;border-color:#7c3aed !important;color:#a78bfa !important;}
        .history-item:hover{background:rgba(124,58,237,0.08) !important;border-color:rgba(124,58,237,0.3) !important;}
        .mood-btn:hover{background:rgba(124,58,237,0.15) !important;border-color:#7c3aed !important;transform:scale(1.05);}
        .send-btn:hover{box-shadow:0 4px 20px rgba(124,58,237,0.5) !important;}
        .new-chat-btn:hover{box-shadow:0 4px 20px rgba(124,58,237,0.4) !important;transform:translateY(-1px);}
      `}</style>

      {/* Sidebar */}
      <div style={{ ...styles.sidebar, width: sidebarOpen ? '268px' : '0', minWidth: sidebarOpen ? '268px' : '0' }}>
        {sidebarOpen && (
          <>
            {/* Logo */}
            <div style={styles.sidebarLogo}>
              <div style={styles.logoMini}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 20 L12 4 L20 20" stroke="url(#lg)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 14 L17 14" stroke="url(#lg)" strokeWidth="2" strokeLinecap="round"/>
                  <defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs>
                </svg>
              </div>
              <span style={styles.brandMini}>MindMate</span>
            </div>

            {/* New Chat */}
            <button className="new-chat-btn" style={styles.newChatBtn} onClick={clearChat}>
              <span style={{ fontSize: '16px' }}>✦</span> New Chat
            </button>

            {/* Tabs */}
            <div style={styles.tabRow}>
              {['history', 'settings'].map(tab => (
                <button key={tab} onClick={() => setSidebarTab(tab)}
                  style={{ ...styles.tab, ...(sidebarTab === tab ? styles.tabActive : {}) }}>
                  {tab === 'history' ? '🕐 History' : '⚙️ Settings'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={styles.tabContent}>
              {sidebarTab === 'history' && (
                chatHistory.length === 0
                  ? <div style={styles.emptyHistory}>
                      <div style={{ fontSize: '36px', marginBottom: '10px' }}>💬</div>
                      <p style={{ fontSize: '13px', color: '#4a5578', lineHeight: '1.6' }}>No chats yet.<br />Start a conversation!</p>
                    </div>
                  : chatHistory.map(chat => (
                      <div key={chat.id} className="history-item" style={styles.historyItem} onClick={() => setChatId(chat.id)}>
                        <p style={styles.historyPreview}>{chat.preview}</p>
                        <span style={styles.historyTime}>{chat.time}</span>
                      </div>
                    ))
              )}
              {sidebarTab === 'settings' && (
                <div style={{ padding: '4px 0' }}>
                  <p style={styles.settingsSection}>Profile</p>
                  <label style={styles.settingsLabel}>Display Name</label>
                  <input value={settingsName} onChange={e => setSettingsName(e.target.value)}
                    style={styles.settingsInput} placeholder="Your name" />
                  <button style={styles.settingsSaveBtn} onClick={() => setSettingsMsg('Saved! ✓')}>Save Name</button>
                  {settingsMsg && <p style={{ color: '#22d3ee', fontSize: '12px', marginTop: '6px' }}>{settingsMsg}</p>}
                  <div style={styles.divider} />
                  <p style={styles.settingsSection}>Chat</p>
                  <button style={styles.settingsDangerBtn} onClick={clearChat}>🗑️ Clear Chat</button>
                  <div style={styles.divider} />
                  <p style={styles.settingsSection}>Account</p>
                  <button style={styles.settingsDangerBtn} onClick={handleLogout}>🚪 Logout</button>
                  {mood && <>
                    <div style={styles.divider} />
                    <p style={styles.settingsSection}>Today's Mood</p>
                    <div style={{ textAlign: 'center', fontSize: '32px' }}>{mood.emoji}</div>
                    <p style={{ textAlign: 'center', color: mood.color, fontSize: '13px', margin: '4px 0 0' }}>{mood.label}</p>
                  </>}
                </div>
              )}
            </div>

            {/* User */}
            <div style={styles.sidebarUser}>
              <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
              <div style={{ overflow: 'hidden' }}>
                <p style={styles.userName}>{user?.name}</p>
                <p style={styles.userEmail}>{user?.email}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main */}
      <div style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.toggleBtn} onClick={() => setSidebarOpen(o => !o)}>
            <span style={{ fontSize: '16px', color: '#cbd5e1' }}>{sidebarOpen ? '◀' : '▶'}</span>
          </button>
          <div style={styles.headerTitle}>
            {mood && <span style={{ fontSize: '18px', marginRight: '8px' }}>{mood.emoji}</span>}
            <span style={styles.headerBrand}>MindMate</span>
            <span style={styles.headerBadge}>✦ AI</span>
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>

        {/* Messages */}
        <div style={styles.messages}>
          {messages.length === 0 && (
            <div style={{ animation: 'fadeInUp 0.5s ease' }}>
              <div style={styles.welcome}>
                <div style={styles.welcomeIconWrap}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M4 20 L12 4 L20 20" stroke="url(#wlg)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 14 L17 14" stroke="url(#wlg)" strokeWidth="2" strokeLinecap="round"/>
                    <defs><linearGradient id="wlg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs>
                  </svg>
                </div>
                <h2 style={styles.welcomeTitle}>Hi, {user?.name}! 👋</h2>
                <p style={styles.welcomeSub}>Your AI companion for smarter learning.<br />What's on your mind today?</p>
                <div style={styles.quickRow}>
                  {['Help me study 📚', 'Debug my code 💻', 'I need motivation 💪', 'Explain a concept 🔍'].map(q => (
                    <button key={q} className="quick-btn" style={styles.quickBtn} onClick={() => sendMessage(q)}>{q}</button>
                  ))}
                </div>
              </div>

              {showMood && (
                <div style={styles.moodCard}>
                  <p style={styles.moodTitle}>How are you feeling today?</p>
                  <div style={styles.moodRow}>
                    {MOODS.map(m => (
                      <button key={m.label} className="mood-btn" style={styles.moodBtn} onClick={() => selectMood(m)} title={m.label}>
                        <span style={{ fontSize: '28px' }}>{m.emoji}</span>
                        <span style={{ fontSize: '10px', color: '#8892b0', marginTop: '5px', fontFamily: 'Poppins, sans-serif' }}>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{ ...styles.msgRow, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', animation: 'fadeInUp 0.3s ease' }}>
              {msg.role === 'assistant' && (
                <div style={styles.assistantAvatar}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M4 20 L12 4 L20 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 14 L17 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              )}
              <div style={{ maxWidth: '70%' }}>
                <div style={msg.role === 'user' ? styles.userBubble : styles.assistantBubble}>
                  {msg.role === 'assistant'
                    ? <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                    : msg.content}
                </div>
                {msg.role === 'assistant' && (
                  <button style={styles.copyBtn} onClick={() => copyMessage(msg.content, i)}>
                    {copiedIndex === i ? '✓ Copied' : '⎘ Copy'}
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ ...styles.msgRow, justifyContent: 'flex-start' }}>
              <div style={styles.assistantAvatar}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 20 L12 4 L20 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 14 L17 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={styles.thinkingBubble}>
                <span style={styles.dot}>●</span>
                <span style={{ ...styles.dot, animationDelay: '0.2s' }}>●</span>
                <span style={{ ...styles.dot, animationDelay: '0.4s' }}>●</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={styles.inputArea}>
          <div style={styles.inputRow}>
            <button style={{ ...styles.iconBtn, background: isListening ? 'rgba(124,58,237,0.25)' : 'transparent' }}
              onClick={startVoice} title="Voice message">🎤</button>
            <textarea
              placeholder="Ask MindMate anything... (Enter to send)"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
              style={styles.textarea}
            />
            <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !message.trim()}
              style={{ ...styles.sendBtn, opacity: (loading || !message.trim()) ? 0.45 : 1 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <p style={styles.inputHint}>MindMate can make mistakes. Use as a study aid, not a final source.</p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  root: {
    display: 'flex', height: '100vh',
    background: '#0f172a',
    fontFamily: "'Poppins', 'Inter', sans-serif",
    color: '#e2e8f0', overflow: 'hidden'
  },
  sidebar: {
    background: '#0a0f1e',
    borderRight: '1px solid rgba(124,58,237,0.15)',
    display: 'flex', flexDirection: 'column',
    transition: 'all 0.3s ease', overflow: 'hidden', flexShrink: 0
  },
  sidebarLogo: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '22px 18px 14px'
  },
  logoMini: {
    width: '34px', height: '34px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #7c3aed, #22d3ee)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, boxShadow: '0 0 18px rgba(124,58,237,0.45)'
  },
  brandMini: {
    fontSize: '17px', fontWeight: '700',
    background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  newChatBtn: {
    margin: '0 14px 14px',
    padding: '11px',
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    border: 'none', borderRadius: '12px',
    color: '#fff', fontSize: '13px', fontWeight: '600',
    cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '8px',
    boxShadow: '0 2px 14px rgba(124,58,237,0.35)',
    transition: 'all 0.2s ease', fontFamily: "'Poppins', sans-serif"
  },
  tabRow: { display: 'flex', margin: '0 14px 10px', gap: '6px' },
  tab: {
    flex: 1, padding: '8px 4px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px', color: '#4a5578',
    fontSize: '11px', cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif", fontWeight: '500',
    transition: 'all 0.2s'
  },
  tabActive: {
    background: 'rgba(124,58,237,0.12)',
    borderColor: 'rgba(124,58,237,0.4)',
    color: '#a78bfa'
  },
  tabContent: { flex: 1, overflowY: 'auto', padding: '4px 14px' },
  emptyHistory: { textAlign: 'center', padding: '44px 0' },
  historyItem: {
    padding: '10px 12px', borderRadius: '10px',
    marginBottom: '5px', cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.05)',
    transition: 'all 0.2s'
  },
  historyPreview: {
    fontSize: '12px', color: '#cbd5e1',
    margin: '0 0 3px', whiteSpace: 'nowrap',
    overflow: 'hidden', textOverflow: 'ellipsis',
    fontWeight: '500'
  },
  historyTime: { fontSize: '10px', color: '#4a5578' },
  settingsSection: {
    fontSize: '10px', color: '#4a5578', fontWeight: '700',
    letterSpacing: '1.2px', textTransform: 'uppercase',
    margin: '14px 0 8px', fontFamily: "'Poppins', sans-serif"
  },
  settingsLabel: { fontSize: '12px', color: '#8892b0', display: 'block', marginBottom: '5px' },
  settingsInput: {
    width: '100%', padding: '9px 12px', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(124,58,237,0.2)',
    borderRadius: '10px', color: '#e2e8f0',
    fontSize: '13px', outline: 'none',
    fontFamily: "'Poppins', sans-serif"
  },
  settingsSaveBtn: {
    width: '100%', marginTop: '8px', padding: '9px',
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    border: 'none', borderRadius: '10px',
    color: '#fff', fontSize: '12px', cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif", fontWeight: '600'
  },
  settingsDangerBtn: {
    width: '100%', padding: '9px',
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.2)',
    borderRadius: '10px', color: '#f87171',
    fontSize: '12px', cursor: 'pointer',
    marginBottom: '5px', fontFamily: "'Poppins', sans-serif"
  },
  divider: { height: '1px', background: 'rgba(255,255,255,0.05)', margin: '12px 0' },
  sidebarUser: {
    padding: '14px 18px',
    borderTop: '1px solid rgba(124,58,237,0.12)',
    display: 'flex', alignItems: 'center', gap: '10px'
  },
  avatar: {
    width: '34px', height: '34px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #7c3aed, #22d3ee)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', fontWeight: '700', flexShrink: 0,
    boxShadow: '0 0 12px rgba(124,58,237,0.35)'
  },
  userName: { fontSize: '13px', fontWeight: '600', color: '#e2e8f0', margin: 0 },
  userEmail: { fontSize: '10px', color: '#4a5578', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: {
    padding: '14px 22px',
    borderBottom: '1px solid rgba(124,58,237,0.12)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'rgba(10,15,30,0.85)',
    backdropFilter: 'blur(12px)'
  },
  toggleBtn: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px', cursor: 'pointer',
    padding: '5px 11px', transition: 'all 0.2s'
  },
  headerTitle: { display: 'flex', alignItems: 'center', gap: '8px' },
  headerBrand: {
    fontSize: '17px', fontWeight: '700',
    background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  headerBadge: {
    fontSize: '10px', fontWeight: '600',
    background: 'rgba(124,58,237,0.18)',
    border: '1px solid rgba(124,58,237,0.35)',
    color: '#a78bfa', padding: '2px 8px',
    borderRadius: '20px', letterSpacing: '0.5px'
  },
  logoutBtn: {
    padding: '7px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', color: '#8892b0',
    fontSize: '12px', cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif", fontWeight: '500',
    transition: 'all 0.2s'
  },
  messages: {
    flex: 1, overflowY: 'auto',
    padding: '28px 24px',
    display: 'flex', flexDirection: 'column', gap: '18px'
  },
  welcome: { textAlign: 'center', padding: '36px 0 24px' },
  welcomeIconWrap: {
    width: '64px', height: '64px', borderRadius: '20px',
    background: 'linear-gradient(135deg, #7c3aed, #22d3ee)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 18px',
    boxShadow: '0 0 32px rgba(124,58,237,0.4)'
  },
  welcomeTitle: {
    fontSize: '26px', fontWeight: '700', margin: '0 0 10px',
    background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  welcomeSub: { color: '#8892b0', fontSize: '14px', lineHeight: '1.7', margin: 0 },
  quickRow: { display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '24px' },
  quickBtn: {
    padding: '9px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px', color: '#cbd5e1',
    fontSize: '13px', cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif", fontWeight: '500',
    transition: 'all 0.2s'
  },
  moodCard: {
    background: 'rgba(124,58,237,0.06)',
    border: '1px solid rgba(124,58,237,0.18)',
    borderRadius: '18px', padding: '22px',
    textAlign: 'center', marginTop: '8px'
  },
  moodTitle: { color: '#8892b0', fontSize: '13px', margin: '0 0 16px', fontWeight: '600' },
  moodRow: { display: 'flex', justifyContent: 'center', gap: '10px' },
  moodBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px', padding: '12px 16px',
    cursor: 'pointer', transition: 'all 0.2s'
  },
  msgRow: { display: 'flex', gap: '10px', alignItems: 'flex-start' },
  assistantAvatar: {
    width: '34px', height: '34px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #7c3aed, #22d3ee)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, boxShadow: '0 0 14px rgba(124,58,237,0.35)'
  },
  userBubble: {
    padding: '12px 18px',
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    borderRadius: '18px 18px 4px 18px',
    fontSize: '14px', lineHeight: '1.65', color: '#fff',
    boxShadow: '0 4px 18px rgba(124,58,237,0.3)',
    fontWeight: '500'
  },
  assistantBubble: {
    padding: '14px 18px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(124,58,237,0.15)',
    borderRadius: '4px 18px 18px 18px',
    fontSize: '14px', lineHeight: '1.75', color: '#cbd5e1'
  },
  copyBtn: {
    background: 'transparent', border: 'none',
    color: '#4a5578', fontSize: '11px',
    cursor: 'pointer', padding: '4px 0', marginTop: '5px',
    fontFamily: "'Poppins', sans-serif"
  },
  thinkingBubble: {
    padding: '14px 20px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(124,58,237,0.15)',
    borderRadius: '4px 18px 18px 18px',
    display: 'flex', gap: '5px', alignItems: 'center',
    color: '#7c3aed', fontSize: '11px'
  },
  dot: { animation: 'blink 1.4s ease-in-out infinite' },
  inputArea: {
    padding: '14px 22px 18px',
    borderTop: '1px solid rgba(124,58,237,0.12)',
    background: 'rgba(10,15,30,0.85)',
    backdropFilter: 'blur(12px)'
  },
  inputRow: {
    display: 'flex', gap: '10px', alignItems: 'flex-end',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(124,58,237,0.25)',
    borderRadius: '18px', padding: '10px 14px',
    boxShadow: '0 0 24px rgba(124,58,237,0.08)'
  },
  iconBtn: {
    border: 'none', fontSize: '18px', cursor: 'pointer',
    padding: '4px 6px', borderRadius: '8px',
    flexShrink: 0, transition: 'all 0.2s'
  },
  textarea: {
    flex: 1, background: 'transparent',
    border: 'none', color: '#e2e8f0',
    fontSize: '14px', lineHeight: '1.6',
    padding: '4px 0',
    fontFamily: "'Poppins', 'Inter', sans-serif",
    maxHeight: '120px', fontWeight: '400'
  },
  sendBtn: {
    background: 'linear-gradient(135deg, #7c3aed, #22d3ee)',
    border: 'none', borderRadius: '12px',
    color: '#fff', cursor: 'pointer',
    padding: '10px 14px', flexShrink: 0,
    boxShadow: '0 2px 14px rgba(124,58,237,0.35)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s'
  },
  inputHint: {
    fontSize: '10px', color: '#2d3748',
    textAlign: 'center', margin: '9px 0 0',
    fontFamily: "'Poppins', sans-serif"
  },
}

export default Chat