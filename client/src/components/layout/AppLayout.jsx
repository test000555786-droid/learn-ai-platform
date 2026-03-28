import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, MessageSquare, Calendar, LogOut, Menu, X, Sparkles, ChevronRight } from 'lucide-react';

const NAV = [
  { name: 'Dashboard',    path: '/',         icon: LayoutDashboard, sub: 'Overview' },
  { name: 'AI Companion', path: '/chat',      icon: MessageSquare,   sub: 'Chat & Learn' },
  { name: 'Study Plan',   path: '/studyplan', icon: Calendar,        sub: 'Roadmap' },
];

export default function AppLayout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;
  const initial = (user.name || user.email || '?')[0].toUpperCase();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ display:'flex', height:'100vh', width:'100%', overflow:'hidden', background:'var(--bg)', position:'relative' }}>

      {/* ── SIDEBAR ──────────────────────────────────────── */}
      <aside style={{
        position: open ? 'absolute' : 'relative',
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        width: 240,
        minWidth: 240,
        height: '100%',
        background: 'linear-gradient(180deg, #0C1220 0%, #080E1A 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        transition: 'transform 0.3s ease',
        transform: open || window.innerWidth >= 768 ? 'translateX(0)' : 'translateX(-100%)',
        flexShrink: 0,
      }}
      className="sidebar-el"
      >
        {/* Logo */}
        <div style={{ height: 64, display:'flex', alignItems:'center', gap:12, padding:'0 20px', borderBottom:'1px solid rgba(255,255,255,0.05)', flexShrink:0 }}>
          <div className="anim-grad" style={{ width:32, height:32, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Sparkles size={16} color="#fff" />
          </div>
          <span className="font-display" style={{ fontWeight:700, fontSize:16, color:'var(--t1)', whiteSpace:'nowrap' }}>
            True Friend <span className="grad-text">AI</span>
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'20px 12px', overflowY:'auto', display:'flex', flexDirection:'column', gap:4 }}>
          <p style={{ fontSize:10, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t3)', padding:'0 8px', marginBottom:8 }}>
            Navigation
          </p>
          {NAV.map(({ name, path, icon: Icon, sub }) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path} onClick={() => setOpen(false)}
                style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:14, textDecoration:'none', transition:'all 0.15s' }}
                className={active ? 'nav-active' : 'nav-inactive'}>
                <div style={{
                  width:34, height:34, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                  background: active ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                }}>
                  <Icon size={16} color={active ? '#A78BFA' : 'var(--t3)'} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:500, color: active ? '#fff' : 'var(--t2)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{name}</div>
                  <div style={{ fontSize:11, color:'var(--t3)' }}>{sub}</div>
                </div>
                {active && <ChevronRight size={14} color="#A78BFA" style={{ flexShrink:0 }} />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding:'12px', borderTop:'1px solid rgba(255,255,255,0.05)', flexShrink:0 }}>
          {/* Streak */}
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px', borderRadius:12, background:'rgba(251,178,60,0.08)', border:'1px solid rgba(251,178,60,0.15)', marginBottom:8 }}>
            <span style={{ fontSize:16 }}>🔥</span>
            <span style={{ fontSize:12, fontWeight:500, color:'#FBB23C' }}>Keep your streak going!</span>
          </div>
          {/* User */}
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', marginBottom:6 }}>
            <div style={{ position:'relative', flexShrink:0 }}>
              <div className="anim-grad" style={{ width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff' }}>
                {initial}
              </div>
              <span className="pulse" style={{ position:'absolute', bottom:-1, right:-1, width:10, height:10, borderRadius:'50%', background:'#34D399', border:'2px solid #0C1220' }} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:500, color:'var(--t1)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.name || 'Student'}</div>
              <div style={{ fontSize:11, color:'var(--t3)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.email}</div>
            </div>
          </div>
          {/* Logout */}
          <button onClick={handleLogout} style={{
            display:'flex', alignItems:'center', gap:8, width:'100%', padding:'9px 12px',
            borderRadius:12, border:'1px solid transparent', background:'transparent',
            color:'var(--t3)', fontSize:13, cursor:'pointer', transition:'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(248,113,113,0.09)'; e.currentTarget.style.borderColor='rgba(248,113,113,0.2)'; e.currentTarget.style.color='#F87171'; }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.color='var(--t3)'; }}>
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>

      {/* ── MOBILE TOPBAR ───────────────────────────────── */}
      <div className="mobile-bar" style={{
        position:'absolute', top:0, left:0, right:0, height:56, zIndex:20,
        display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px',
        background:'rgba(7,11,20,0.85)', backdropFilter:'blur(12px)',
        borderBottom:'1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div className="anim-grad" style={{ width:28, height:28, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Sparkles size={13} color="#fff" />
          </div>
          <span className="font-display" style={{ fontWeight:700, fontSize:15, color:'var(--t1)' }}>
            True Friend <span className="grad-text">AI</span>
          </span>
        </div>
        <button onClick={() => setOpen(!open)} style={{ padding:8, background:'transparent', border:'none', color:'var(--t2)', cursor:'pointer' }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── MAIN ────────────────────────────────────────── */}
      <main style={{ flex:1, height:'100%', overflowY:'auto', position:'relative', background:'var(--bg)' }}
        className="main-content">
        {/* Ambient orbs */}
        <div className="orb" style={{ position:'fixed', top:60, right:40, width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter:'blur(50px)', pointerEvents:'none', opacity:0.6 }} />
        <div className="orb2" style={{ position:'fixed', bottom:80, left:80, width:260, height:260, borderRadius:'50%', background:'radial-gradient(circle, rgba(244,114,182,0.1) 0%, transparent 70%)', filter:'blur(50px)', pointerEvents:'none', opacity:0.5 }} />
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'28px 28px 40px', position:'relative', zIndex:1 }}
          className="main-inner">
          {children}
        </div>
      </main>

      {/* Mobile overlay */}
      {open && (
        <div onClick={() => setOpen(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', zIndex:25 }} />
      )}

      <style>{`
        @media (min-width: 768px) {
          .mobile-bar { display: none !important; }
          .sidebar-el { position: relative !important; transform: translateX(0) !important; }
          .main-content { padding-top: 0 !important; }
          .main-inner { padding: 32px 36px 48px !important; }
        }
        @media (max-width: 767px) {
          .sidebar-el { position: absolute !important; transform: ${open ? 'translateX(0)' : 'translateX(-100%)'} !important; }
          .main-content { padding-top: 56px; }
          .main-inner { padding: 20px 16px 32px !important; }
        }
      `}</style>
    </div>
  );
}
