import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate()

  const features = [
    { icon: '🧠', title: 'AI-Powered Chat', desc: 'Chat with Gemini AI for instant help with studies, coding, and mental wellness.' },
    { icon: '📚', title: 'Study Companion', desc: 'Get explanations, solve problems, and prepare for exams with your AI buddy.' },
    { icon: '💆', title: 'Mood Tracker', desc: 'Track how you feel daily and get personalized support based on your mood.' },
    { icon: '💻', title: 'Code Debugger', desc: 'Stuck on a bug? MindMate helps you debug and understand code instantly.' },
    { icon: '🔒', title: 'Private & Secure', desc: 'Your chats are private and protected with JWT authentication.' },
    { icon: '⚡', title: 'Always Available', desc: 'Available 24/7 whenever you need help — day or night.' },
  ]

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes fadeInUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes pulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.05)} }
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#0a0e1a}
        ::-webkit-scrollbar-thumb{background:#2d2060;border-radius:2px}
        .get-started:hover{box-shadow:0 8px 32px rgba(124,58,237,0.6) !important;transform:translateY(-2px) !important;}
        .login-btn:hover{background:rgba(124,58,237,0.15) !important;border-color:#7c3aed !important;color:#a78bfa !important;}
        .feature-card:hover{border-color:rgba(124,58,237,0.4) !important;transform:translateY(-4px) !important;box-shadow:0 8px 32px rgba(124,58,237,0.15) !important;}
        .nav-login:hover{color:#a78bfa !important;}
      `}</style>

      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <div style={styles.navIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M4 20 L12 4 L20 20" stroke="url(#nlg)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 14 L17 14" stroke="url(#nlg)" strokeWidth="2" strokeLinecap="round"/>
              <defs><linearGradient id="nlg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs>
            </svg>
          </div>
          <span style={styles.navBrand}>MindMate</span>
        </div>
        <div style={styles.navLinks}>
          <button className="nav-login" style={styles.navLink} onClick={() => navigate('/register')}>Sign Up</button>
          <button style={styles.navLoginBtn} onClick={() => navigate('/')}>Login</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={styles.hero}>
        {/* Glow blobs */}
        <div style={styles.blob1} />
        <div style={styles.blob2} />

        <div style={{ animation: 'fadeInUp 0.7s ease', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={styles.badge}>
            <span style={{ fontSize: '12px' }}>✦</span> Powered by Gemini AI
          </div>

          {/* Logo */}
          <div style={{ ...styles.heroLogo, animation: 'float 3s ease-in-out infinite' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M4 20 L12 4 L20 20" stroke="url(#hlg)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 14 L17 14" stroke="url(#hlg)" strokeWidth="2" strokeLinecap="round"/>
              <defs><linearGradient id="hlg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs>
            </svg>
          </div>

          {/* Title */}
          <h1 style={styles.heroTitle}>
            Your AI Companion<br />
            <span style={styles.heroGradient}>for Smarter Learning</span>
          </h1>

          <p style={styles.heroSub}>
            MindMate helps students study better, feel better, and grow better.<br />
            Chat with AI, track your mood, and never feel stuck again.
          </p>

          {/* CTA Buttons */}
          <div style={styles.ctaRow}>
            <button className="get-started" style={styles.getStartedBtn} onClick={() => navigate('/register')}>
              Get Started Free →
            </button>
            <button className="login-btn" style={styles.loginBtn} onClick={() => navigate('/')}>
              Already have an account
            </button>
          </div>

          {/* Stats */}
          <div style={styles.statsRow}>
            {[['AI Powered', '✦'], ['24/7 Available', '🕐'], ['100% Free', '💚'], ['Secure & Private', '🔒']].map(([label, icon]) => (
              <div key={label} style={styles.statItem}>
                <span style={{ fontSize: '16px' }}>{icon}</span>
                <span style={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={styles.features}>
        <div style={{ animation: 'fadeInUp 0.5s ease' }}>
          <p style={styles.featuresEyebrow}>WHAT MINDMATE CAN DO</p>
          <h2 style={styles.featuresTitle}>Everything you need to<br /><span style={styles.heroGradient}>succeed as a student</span></h2>
        </div>
        <div style={styles.featuresGrid}>
          {features.map((f, i) => (
            <div key={i} className="feature-card" style={styles.featureCard}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div style={styles.ctaBanner}>
        <div style={styles.ctaBannerInner}>
          <h2 style={styles.ctaBannerTitle}>Ready to study smarter? 🚀</h2>
          <p style={styles.ctaBannerSub}>Join MindMate today and never feel stuck again!</p>
          <button className="get-started" style={{ ...styles.getStartedBtn, marginTop: '24px' }} onClick={() => navigate('/register')}>
            Get Started Free →
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerLogo}>
          <div style={styles.navIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M4 20 L12 4 L20 20" stroke="url(#flg)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 14 L17 14" stroke="url(#flg)" strokeWidth="2" strokeLinecap="round"/>
              <defs><linearGradient id="flg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient></defs>
            </svg>
          </div>
          <span style={{ ...styles.navBrand, fontSize: '14px' }}>MindMate</span>
        </div>
        <p style={styles.footerText}>Made with 💜 by Santhiya · BCA Student, Chennai</p>
        <p style={styles.footerText}>Powered by Gemini AI · MongoDB · React · Node.js</p>
      </div>
    </div>
  )
}

const styles = {
  root: {
    minHeight: '100vh',
    background: '#0f172a',
    fontFamily: "'Poppins', sans-serif",
    color: '#e2e8f0', overflowX: 'hidden'
  },
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 48px',
    borderBottom: '1px solid rgba(124,58,237,0.12)',
    background: 'rgba(10,15,30,0.85)',
    backdropFilter: 'blur(12px)',
    position: 'sticky', top: 0, zIndex: 100
  },
  navLogo: { display: 'flex', alignItems: 'center', gap: '10px' },
  navIcon: {
    width: '30px', height: '30px', borderRadius: '8px',
    background: 'linear-gradient(135deg, #7c3aed, #22d3ee)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 0 14px rgba(124,58,237,0.4)'
  },
  navBrand: {
    fontSize: '17px', fontWeight: '700',
    background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  navLinks: { display: 'flex', alignItems: 'center', gap: '12px' },
  navLink: {
    background: 'transparent', border: 'none',
    color: '#8892b0', fontSize: '13px', fontWeight: '500',
    cursor: 'pointer', fontFamily: "'Poppins', sans-serif",
    transition: 'color 0.2s', padding: '6px 12px'
  },
  navLoginBtn: {
    padding: '8px 20px',
    background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    border: 'none', borderRadius: '10px',
    color: '#fff', fontSize: '13px', fontWeight: '600',
    cursor: 'pointer', fontFamily: "'Poppins', sans-serif",
    boxShadow: '0 2px 14px rgba(124,58,237,0.35)'
  },
  hero: {
    textAlign: 'center', padding: '80px 24px 80px',
    position: 'relative', overflow: 'hidden'
  },
  blob1: {
    position: 'absolute', top: '-80px', left: '20%',
    width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
    animation: 'pulse 4s ease-in-out infinite', pointerEvents: 'none'
  },
  blob2: {
    position: 'absolute', bottom: '-80px', right: '20%',
    width: '350px', height: '350px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)',
    animation: 'pulse 5s ease-in-out infinite 1s', pointerEvents: 'none'
  },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    padding: '6px 16px',
    background: 'rgba(124,58,237,0.12)',
    border: '1px solid rgba(124,58,237,0.3)',
    borderRadius: '20px', color: '#a78bfa',
    fontSize: '12px', fontWeight: '600',
    marginBottom: '28px', letterSpacing: '0.5px'
  },
  heroLogo: {
    width: '96px', height: '96px', borderRadius: '28px',
    background: 'linear-gradient(135deg, #7c3aed, #22d3ee)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 28px',
    boxShadow: '0 0 48px rgba(124,58,237,0.5)'
  },
  heroTitle: {
    fontSize: '52px', fontWeight: '800',
    lineHeight: '1.15', margin: '0 0 20px',
    color: '#f1f5f9'
  },
  heroGradient: {
    background: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
  },
  heroSub: {
    color: '#8892b0', fontSize: '16px',
    lineHeight: '1.8', margin: '0 auto 36px',
    maxWidth: '560px'
  },
  ctaRow: {
    display: 'flex', gap: '14px',
    justifyContent: 'center', flexWrap: 'wrap',
    marginBottom: '44px'
  },
  getStartedBtn: {
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #7c3aed, #22d3ee)',
    border: 'none', borderRadius: '14px',
    color: '#fff', fontSize: '15px', fontWeight: '700',
    cursor: 'pointer', fontFamily: "'Poppins', sans-serif",
    boxShadow: '0 4px 24px rgba(124,58,237,0.45)',
    transition: 'all 0.2s'
  },
  loginBtn: {
    padding: '14px 32px',
    background: 'transparent',
    border: '1px solid rgba(124,58,237,0.3)',
    borderRadius: '14px', color: '#8892b0',
    fontSize: '15px', fontWeight: '600',
    cursor: 'pointer', fontFamily: "'Poppins', sans-serif",
    transition: 'all 0.2s'
  },
  statsRow: {
    display: 'flex', gap: '32px',
    justifyContent: 'center', flexWrap: 'wrap'
  },
  statItem: {
    display: 'flex', alignItems: 'center', gap: '8px'
  },
  statLabel: { color: '#4a5578', fontSize: '13px', fontWeight: '500' },
  features: {
    padding: '80px 48px',
    borderTop: '1px solid rgba(124,58,237,0.1)',
    textAlign: 'center'
  },
  featuresEyebrow: {
    fontSize: '11px', color: '#7c3aed', fontWeight: '700',
    letterSpacing: '2px', margin: '0 0 12px'
  },
  featuresTitle: {
    fontSize: '36px', fontWeight: '800',
    margin: '0 0 48px', lineHeight: '1.3', color: '#f1f5f9'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px', maxWidth: '960px', margin: '0 auto'
  },
  featureCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(124,58,237,0.15)',
    borderRadius: '18px', padding: '28px',
    textAlign: 'left', transition: 'all 0.3s',
    cursor: 'default'
  },
  featureIcon: { fontSize: '32px', marginBottom: '14px' },
  featureTitle: {
    fontSize: '16px', fontWeight: '700',
    color: '#e2e8f0', margin: '0 0 8px'
  },
  featureDesc: {
    fontSize: '13px', color: '#4a5578',
    lineHeight: '1.7', margin: 0
  },
  ctaBanner: {
    padding: '80px 24px',
    background: 'rgba(124,58,237,0.06)',
    borderTop: '1px solid rgba(124,58,237,0.15)',
    borderBottom: '1px solid rgba(124,58,237,0.15)',
    textAlign: 'center'
  },
  ctaBannerInner: { maxWidth: '560px', margin: '0 auto' },
  ctaBannerTitle: {
    fontSize: '32px', fontWeight: '800',
    margin: '0 0 12px', color: '#f1f5f9'
  },
  ctaBannerSub: {
    color: '#8892b0', fontSize: '15px', margin: 0
  },
  footer: {
    padding: '32px 48px',
    textAlign: 'center',
    borderTop: '1px solid rgba(124,58,237,0.1)'
  },
  footerLogo: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '8px', marginBottom: '12px'
  },
  footerText: { color: '#2d3748', fontSize: '12px', margin: '4px 0' }
}

export default Landing