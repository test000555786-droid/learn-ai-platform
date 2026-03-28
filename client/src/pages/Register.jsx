import { useState } from 'react';
import api from '../services/api';
import { Calendar, Sparkles, AlertTriangle, Loader2, RefreshCw, BookOpen, Zap } from 'lucide-react';

export default function StudyPlan() {
  const [plan, setPlan] = useState('');
  const [weakTopics, setWeakTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/ai/studyplan');
      setPlan(data.plan);
      setWeakTopics(data.weakTopics || []);
      setGenerated(true);
    } catch { setPlan('Failed to generate study plan. Please try again.'); setGenerated(true); }
    finally { setLoading(false); }
  };

  const reset = () => { setGenerated(false); setPlan(''); setWeakTopics([]); };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', paddingBottom: 40 }}>

      {/* Header */}
      <div className="fi fi-1" style={{ display:'flex', alignItems:'center', gap:14, marginBottom:32 }}>
        <div className="anim-grad" style={{ width:44, height:44, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Calendar size={20} color="#fff" />
        </div>
        <div>
          <h1 className="font-display" style={{ fontSize:'clamp(20px,2.5vw,26px)', fontWeight:700, color:'var(--t1)', marginBottom:4 }}>
            Study Roadmap
          </h1>
          <p style={{ fontSize:13, color:'var(--t2)' }}>AI generates a personalized 7-day plan from your quiz history</p>
        </div>
      </div>

      {!generated ? (
        /* Empty state */
        <div className="fi fi-2" style={{
          display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center',
          padding:'64px 40px', borderRadius:24, position:'relative', overflow:'hidden',
          background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(139,92,246,0.09) 0%, transparent 70%)', pointerEvents:'none' }} />

          <div className="anim-grad" style={{ width:72, height:72, borderRadius:20, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:24, boxShadow:'0 0 40px rgba(139,92,246,0.3)', position:'relative', zIndex:1 }}>
            <BookOpen size={32} color="#fff" />
          </div>

          <h2 className="font-display" style={{ fontSize:22, fontWeight:700, color:'var(--t1)', marginBottom:10, position:'relative', zIndex:1 }}>Ready to level up?</h2>
          <p style={{ fontSize:14, color:'var(--t2)', maxWidth:400, lineHeight:1.7, marginBottom:36, position:'relative', zIndex:1 }}>
            We'll analyze your quiz performance and build a smart recovery roadmap targeting your weak spots.
          </p>

          {/* Feature row */}
          <div style={{ display:'flex', gap:28, marginBottom:40, position:'relative', zIndex:1, flexWrap:'wrap', justifyContent:'center' }}>
            {[['⚡','Adaptive','Based on your data'],['📅','7-Day Plan','Day-by-day schedule'],['🎯','Focused','Target weak areas']].map(([icon,t,d]) => (
              <div key={t} style={{ textAlign:'center' }}>
                <div style={{ fontSize:28, marginBottom:6 }}>{icon}</div>
                <p style={{ fontSize:13, fontWeight:600, color:'var(--t1)', marginBottom:3 }}>{t}</p>
                <p style={{ fontSize:11, color:'var(--t3)' }}>{d}</p>
              </div>
            ))}
          </div>

          <button onClick={generate} disabled={loading} className="btn-primary" style={{ padding:'14px 32px', borderRadius:14, fontSize:15, position:'relative', zIndex:1 }}>
            {loading
              ? <><Loader2 size={18} style={{ animation:'spin 1s linear infinite' }} /><span>Analyzing Performance…</span></>
              : <><Sparkles size={18} /><span>Generate My Plan</span></>
            }
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        /* Generated plan */
        <div className="fi fi-1" style={{ display:'flex', flexDirection:'column', gap:14 }}>

          {/* Weak topics */}
          {weakTopics.length > 0 && (
            <div style={{ padding:'16px 20px', borderRadius:16, background:'linear-gradient(135deg,rgba(248,113,113,0.07),transparent)', border:'1px solid rgba(248,113,113,0.18)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                <AlertTriangle size={15} color="#F87171" />
                <span style={{ fontSize:13, fontWeight:600, color:'#F87171' }}>Focus Areas</span>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {weakTopics.map(t => (
                  <span key={t} style={{ padding:'5px 12px', borderRadius:99, fontSize:12, fontWeight:500, background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.2)', color:'#F87171' }}>{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Plan */}
          <div style={{ borderRadius:16, overflow:'hidden', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <Zap size={16} color="var(--violet)" />
                <span className="font-display" style={{ fontSize:14, fontWeight:600, color:'var(--t1)' }}>Your 7-Day Roadmap</span>
              </div>
              <button onClick={reset} style={{
                display:'flex', alignItems:'center', gap:6, padding:'7px 12px', borderRadius:10, fontSize:12, fontWeight:500,
                background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'var(--t2)', cursor:'pointer', transition:'all 0.15s',
              }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}>
                <RefreshCw size={13} /> Regenerate
              </button>
            </div>
            <div style={{ padding:'24px 24px' }}>
              {plan.includes('Failed') ? (
                <p style={{ fontSize:13, color:'#F87171' }}>{plan}</p>
              ) : (
                <pre style={{ whiteSpace:'pre-wrap', fontFamily:'inherit', fontSize:14, lineHeight:1.8, color:'var(--t2)' }}>{plan}</pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
