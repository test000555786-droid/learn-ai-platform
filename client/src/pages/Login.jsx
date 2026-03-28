import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await login(form.email, form.password); navigate('/'); }
    catch (err) { setError(err.response?.data?.message || 'Invalid credentials'); }
    finally { setLoading(false); }
  };

  const features = [
    { icon: '📚', label: 'Adaptive Quizzes' },
    { icon: '🤖', label: 'AI Companion' },
    { icon: '📊', label: 'Progress Insights' },
  ];

  return (
    <div style={{ minHeight:'100vh', display:'flex', background:'var(--bg)', position:'relative', overflow:'hidden' }}>

      {/* Ambient orbs */}
      <div className="orb" style={{ position:'fixed', top:'20%', left:'10%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />
      <div className="orb2" style={{ position:'fixed', bottom:'15%', right:'10%', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle, rgba(244,114,182,0.09) 0%, transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />

      {/* ── LEFT HERO PANEL ── */}
      <div style={{
        flex: 1, display:'flex', flexDirection:'column', justifyContent:'space-between',
        padding:'40px 48px', borderRight:'1px solid rgba(255,255,255,0.05)', minHeight:'100vh',
      }} className="login-left">
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div className="anim-grad" style={{ width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Sparkles size={17} color="#fff" />
          </div>
          <span className="font-display" style={{ fontWeight:700, fontSize:18, color:'var(--t1)' }}>
            True Friend <span className="grad-text">AI</span>
          </span>
        </div>

        {/* Hero text */}
        <div>
          <h1 className="font-display" style={{ fontSize:'clamp(36px,4vw,52px)', fontWeight:800, lineHeight:1.15, color:'var(--t1)', marginBottom:20 }}>
            Learn smarter,<br />
            <span className="grad-text">not harder.</span>
          </h1>
          <p style={{ fontSize:16, color:'var(--t2)', lineHeight:1.7, maxWidth:440, marginBottom:32 }}>
            Your personalized AI companion that adapts to your learning style and helps you master any topic.
          </p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
            {features.map(({ icon, label }) => (
              <div key={label} style={{
                display:'flex', alignItems:'center', gap:8, padding:'8px 14px',
                borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
              }}>
                <span style={{ fontSize:16 }}>{icon}</span>
                <span style={{ fontSize:13, color:'var(--t2)', fontWeight:500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize:12, color:'var(--t3)' }}>© 2025 True Friend AI</p>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div style={{
        flex: 1, display:'flex', alignItems:'center', justifyContent:'center',
        padding:'40px 32px', minHeight:'100vh',
      }}>
        <div className="fi fi-1" style={{ width:'100%', maxWidth:400 }}>

          {/* Mobile logo (hidden on desktop) */}
          <div className="mobile-logo" style={{ display:'none', alignItems:'center', justifyContent:'center', gap:10, marginBottom:32 }}>
            <div className="anim-grad" style={{ width:32, height:32, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Sparkles size={15} color="#fff" />
            </div>
            <span className="font-display" style={{ fontWeight:700, fontSize:17, color:'var(--t1)' }}>
              True Friend <span className="grad-text">AI</span>
            </span>
          </div>

          {/* Form card */}
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'32px' }}>
            <h2 className="font-display" style={{ fontSize:24, fontWeight:700, color:'var(--t1)', marginBottom:6 }}>Welcome back</h2>
            <p style={{ fontSize:13, color:'var(--t2)', marginBottom:24 }}>Sign in to continue your learning journey</p>

            {error && (
              <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:12, padding:'12px 16px', fontSize:13, color:'#F87171', marginBottom:20 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {/* Email */}
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:500, color:'var(--t2)', marginBottom:8 }}>Email address</label>
                <div style={{ position:'relative' }}>
                  <Mail size={15} color="var(--t3)" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
                  <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="p-input" placeholder="you@example.com" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:500, color:'var(--t2)', marginBottom:8 }}>Password</label>
                <div style={{ position:'relative' }}>
                  <Lock size={15} color="var(--t3)" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
                  <input type={showPass ? 'text' : 'password'} required value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    className="p-input" placeholder="••••••••"
                    style={{ paddingRight:44 }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{
                    position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                    background:'none', border:'none', cursor:'pointer', color:'var(--t3)', display:'flex', alignItems:'center',
                  }}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary"
                style={{ width:'100%', padding:'13px 20px', borderRadius:12, marginTop:4, fontSize:14 }}>
                {loading ? 'Signing in…' : <><span>Continue</span><ArrowRight size={16} /></>}
              </button>
            </form>

            <p style={{ textAlign:'center', fontSize:13, color:'var(--t3)', marginTop:20 }}>
              New here?{' '}
              <Link to="/register" style={{ color:'#A78BFA', fontWeight:500, textDecoration:'none' }}>Create an account</Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-left { display: none !important; }
          .mobile-logo { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
