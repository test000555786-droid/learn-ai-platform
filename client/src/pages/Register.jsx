import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';

const GOALS = [
  { value:'Web Development',         emoji:'🌐', desc:'HTML, JS, React, Node' },
  { value:'Data Science',            emoji:'📊', desc:'Python, Pandas, Stats' },
  { value:'Machine Learning',        emoji:'🤖', desc:'Neural Networks, NLP' },
  { value:'Competitive Programming', emoji:'⚡', desc:'DSA, Graphs, DP' },
  { value:'System Design',           emoji:'🏗', desc:'Scalability, Databases' },
  { value:'Mobile Development',      emoji:'📱', desc:'React Native, Flutter' },
  { value:'Cybersecurity',           emoji:'🔐', desc:'Networking, Cryptography' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', learningGoal:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try { await register(form.name, form.email, form.password, form.learningGoal); navigate('/'); }
    catch (err) { setError(err.response?.data?.message || 'Registration failed'); setStep(1); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:'24px 16px', position:'relative', overflow:'hidden' }}>

      <div className="orb" style={{ position:'fixed', top:'25%', right:'15%', width:360, height:360, borderRadius:'50%', background:'radial-gradient(circle, rgba(244,114,182,0.1) 0%, transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />
      <div className="orb3" style={{ position:'fixed', bottom:'20%', left:'15%', width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />

      <div className="fi fi-1" style={{ width:'100%', maxWidth:440 }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:28 }}>
          <div className="anim-grad" style={{ width:34, height:34, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Sparkles size={16} color="#fff" />
          </div>
          <span className="font-display" style={{ fontWeight:700, fontSize:18, color:'var(--t1)' }}>
            True Friend <span className="grad-text">AI</span>
          </span>
        </div>

        {/* Card */}
        <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'28px 28px' }}>
          {/* Step bar */}
          <div style={{ display:'flex', gap:6, marginBottom:24 }}>
            {[1,2].map(s => (
              <div key={s} style={{ flex:1, height:3, borderRadius:99, background: s <= step ? undefined : 'rgba(255,255,255,0.08)', overflow:'hidden' }}>
                {s <= step && <div className="anim-grad" style={{ width:'100%', height:'100%' }} />}
              </div>
            ))}
          </div>

          <h2 className="font-display" style={{ fontSize:22, fontWeight:700, color:'var(--t1)', marginBottom:6 }}>
            {step === 1 ? 'Create account' : 'Choose your path'}
          </h2>
          <p style={{ fontSize:13, color:'var(--t2)', marginBottom:22 }}>
            {step === 1 ? 'Start your personalized AI learning journey' : 'What do you want to master?'}
          </p>

          {error && (
            <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:12, padding:'12px 16px', fontSize:13, color:'#F87171', marginBottom:18 }}>
              {error}
            </div>
          )}

          {step === 1 ? (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {[
                { label:'Full name', key:'name', type:'text', icon:<User size={15} />, placeholder:'Your full name' },
                { label:'Email', key:'email', type:'email', icon:<Mail size={15} />, placeholder:'you@example.com' },
                { label:'Password', key:'password', type: showPass ? 'text' : 'password', icon:<Lock size={15} />, placeholder:'Min. 6 characters', isPass:true },
              ].map(({ label, key, type, icon, placeholder, isPass }) => (
                <div key={key}>
                  <label style={{ display:'block', fontSize:12, fontWeight:500, color:'var(--t2)', marginBottom:8 }}>{label}</label>
                  <div style={{ position:'relative' }}>
                    <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--t3)', display:'flex', pointerEvents:'none' }}>{icon}</span>
                    <input type={type} value={form[key]}
                      onChange={e => setForm({...form, [key]: e.target.value})}
                      className="p-input" placeholder={placeholder}
                      style={isPass ? { paddingRight:44 } : {}} />
                    {isPass && (
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--t3)', display:'flex', alignItems:'center' }}>
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button type="button"
                disabled={!form.name || !form.email || !form.password}
                onClick={() => setStep(2)}
                className="btn-primary"
                style={{ width:'100%', padding:'13px 20px', borderRadius:12, marginTop:4 }}>
                <span>Next</span><ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:18, maxHeight:340, overflowY:'auto', paddingRight:4 }}>
                {GOALS.map(({ value, emoji, desc }) => {
                  const selected = form.learningGoal === value;
                  return (
                    <button type="button" key={value}
                      onClick={() => setForm({...form, learningGoal: value})}
                      style={{
                        display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:12,
                        border: selected ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.07)',
                        background: selected ? 'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(244,114,182,0.07))' : 'rgba(255,255,255,0.03)',
                        cursor:'pointer', textAlign:'left', transition:'all 0.15s',
                      }}>
                      <span style={{ fontSize:20, width:28, textAlign:'center', flexShrink:0 }}>{emoji}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:500, color: selected ? 'var(--t1)' : 'var(--t2)' }}>{value}</div>
                        <div style={{ fontSize:11, color:'var(--t3)' }}>{desc}</div>
                      </div>
                      {selected && <div style={{ width:16, height:16, borderRadius:'50%', background:'var(--violet)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><div style={{ width:6, height:6, borderRadius:'50%', background:'#fff' }} /></div>}
                    </button>
                  );
                })}
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button type="button" onClick={() => setStep(1)} style={{ padding:'12px 20px', borderRadius:12, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.04)', color:'var(--t2)', fontSize:13, fontWeight:500, cursor:'pointer' }}>
                  Back
                </button>
                <button type="submit" disabled={!form.learningGoal || loading} className="btn-primary"
                  style={{ flex:1, padding:'12px 20px', borderRadius:12 }}>
                  {loading ? 'Creating…' : <><span>Get Started</span><ArrowRight size={16} /></>}
                </button>
              </div>
            </form>
          )}

          <p style={{ textAlign:'center', fontSize:13, color:'var(--t3)', marginTop:20 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'#A78BFA', fontWeight:500, textDecoration:'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
