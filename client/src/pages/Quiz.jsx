import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, ArrowRight, CheckCircle, Trophy, RotateCcw, Loader2, Sparkles } from 'lucide-react';

export default function Quiz() {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [current, setCurrent] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/quiz/${encodeURIComponent(topic)}`);
        if (!data.questions?.length) { setError('No questions returned. Please try again.'); return; }
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(null));
      } catch (err) { setError(err.response?.data?.message || 'Failed to load quiz.'); }
      finally { setLoading(false); }
    })();
  }, [topic]);

  const submit = async () => {
    setSubmitting(true);
    try {
      const { data } = await api.post('/quiz/submit', { topic, questions, userAnswers: answers });
      setResult(data);
    } catch (err) { setError(err.response?.data?.message || 'Failed to submit.'); }
    finally { setSubmitting(false); }
  };

  const fullPage = { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 16px', background:'var(--bg)', position:'relative' };

  if (loading) return (
    <div style={{ ...fullPage, flexDirection:'column', gap:16 }}>
      <div className="anim-grad" style={{ width:56, height:56, borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 40px rgba(139,92,246,0.4)' }}>
        <Sparkles size={24} color="#fff" />
      </div>
      <p className="font-display" style={{ fontSize:17, fontWeight:600, color:'var(--t1)' }}>
        Generating <span className="grad-text">{topic}</span> quiz…
      </p>
      <p style={{ fontSize:13, color:'var(--t3)' }}>Crafting personalized questions for you</p>
    </div>
  );

  if (error) return (
    <div style={fullPage}>
      <div style={{ width:'100%', maxWidth:420, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:20, padding:'32px', textAlign:'center' }}>
        <div style={{ fontSize:40, marginBottom:16 }}>⚠️</div>
        <h2 className="font-display" style={{ fontSize:20, fontWeight:700, color:'var(--t1)', marginBottom:12 }}>Something went wrong</h2>
        <p style={{ fontSize:13, padding:'12px 16px', borderRadius:12, background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.2)', color:'#F87171', marginBottom:24 }}>{error}</p>
        <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
          <button onClick={() => window.location.reload()} className="btn-primary" style={{ padding:'10px 20px', borderRadius:12, fontSize:13 }}>Try Again</button>
          <button onClick={() => navigate('/')} style={{ padding:'10px 20px', borderRadius:12, fontSize:13, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'var(--t2)', cursor:'pointer' }}>Dashboard</button>
        </div>
      </div>
    </div>
  );

  if (result) {
    const score = result.masteryScore;
    const isGreat = score >= 80, isOk = score >= 60;
    const emoji = isGreat ? '🏆' : isOk ? '👍' : '📚';
    const msg = isGreat ? 'Excellent work!' : isOk ? 'Good effort!' : 'Keep practicing!';
    const sc = isGreat ? '#2DD4BF' : isOk ? '#FBB23C' : '#F87171';
    const circ = 2 * Math.PI * 40;

    return (
      <div style={fullPage}>
        <div className="fi" style={{ width:'100%', maxWidth:400, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, padding:'36px 32px', textAlign:'center' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>{emoji}</div>
          <h2 className="font-display" style={{ fontSize:24, fontWeight:700, color:'var(--t1)', marginBottom:6 }}>{msg}</h2>
          <p style={{ fontSize:13, color:'var(--t2)', marginBottom:28 }}>{topic}</p>

          {/* Score ring */}
          <div style={{ position:'relative', width:112, height:112, margin:'0 auto 28px' }}>
            <svg style={{ position:'absolute', inset:0, transform:'rotate(-90deg)' }} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="none" stroke={sc} strokeWidth="8"
                strokeDasharray={circ} strokeDashoffset={circ * (1 - score / 100)}
                strokeLinecap="round" style={{ transition:'stroke-dashoffset 1s ease' }} />
            </svg>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <span className="font-display" style={{ fontSize:24, fontWeight:700, color:sc, lineHeight:1 }}>{score}%</span>
              <span style={{ fontSize:10, color:'var(--t3)', marginTop:2 }}>mastery</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'16px 20px', marginBottom:24 }}>
            {[['Quiz Score', `${result.score}%`, '#A78BFA'], ['Mastery', `${result.masteryScore}%`, sc], ['Next Level', result.difficulty, '#FBB23C']].map(([k,v,c]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize:13, color:'var(--t3)' }}>{k}</span>
                <span style={{ fontSize:13, fontWeight:600, color:c, textTransform:'capitalize' }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => window.location.reload()} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'12px', borderRadius:12, fontSize:13, fontWeight:500, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)', color:'var(--t2)', cursor:'pointer' }}>
              <RotateCcw size={14} /> Retry
            </button>
            <button onClick={() => navigate('/')} className="btn-primary" style={{ flex:1, padding:'12px', borderRadius:12, fontSize:13 }}>
              <Trophy size={14} /> Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;
  const answered = answers.filter(Boolean).length;

  return (
    <div style={{ ...fullPage, alignItems:'flex-start', paddingTop:40 }}>
      <div className="fi" style={{ width:'100%', maxWidth:680 }}>
        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <button onClick={() => navigate('/')} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'var(--t3)', background:'none', border:'none', cursor:'pointer', transition:'color 0.15s' }}
            onMouseEnter={e=>e.currentTarget.style.color='var(--t1)'} onMouseLeave={e=>e.currentTarget.style.color='var(--t3)'}>
            <ArrowLeft size={15} /> Back
          </button>
          <div style={{ padding:'5px 14px', borderRadius:99, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <span className="grad-text" style={{ fontSize:12, fontWeight:600 }}>{topic}</span>
          </div>
          <span style={{ fontSize:13, color:'var(--t3)' }}>{current+1} / {questions.length}</span>
        </div>

        {/* Progress bar */}
        <div style={{ height:4, borderRadius:99, background:'rgba(255,255,255,0.07)', marginBottom:28, overflow:'hidden' }}>
          <div className="anim-grad" style={{ height:'100%', borderRadius:99, width:`${progress}%`, transition:'width 0.4s ease' }} />
        </div>

        {/* Question */}
        <div style={{ padding:'20px 24px', borderRadius:16, marginBottom:16, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
            <span style={{ flexShrink:0, width:26, height:26, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(139,92,246,0.2)', color:'#A78BFA', fontSize:11, fontWeight:700 }}>Q{current+1}</span>
            <p style={{ fontSize:15, fontWeight:500, color:'var(--t1)', lineHeight:1.6 }}>{q.question}</p>
          </div>
        </div>

        {/* Options */}
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:28 }}>
          {q.options.map((opt, i) => {
            const sel = answers[current] === opt;
            return (
              <button key={i}
                onClick={() => { const u=[...answers]; u[current]=opt; setAnswers(u); }}
                style={{
                  display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderRadius:13, fontSize:14, textAlign:'left', cursor:'pointer', transition:'all 0.15s',
                  ...(sel
                    ? { background:'linear-gradient(135deg,rgba(139,92,246,0.16),rgba(244,114,182,0.08))', border:'1px solid rgba(139,92,246,0.4)', color:'var(--t1)' }
                    : { background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', color:'var(--t2)' })
                }}
                onMouseEnter={e => { if (!sel) { e.currentTarget.style.borderColor='rgba(139,92,246,0.25)'; e.currentTarget.style.color='var(--t1)'; } }}
                onMouseLeave={e => { if (!sel) { e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='var(--t2)'; } }}>
                <span style={{ flexShrink:0, width:28, height:28, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, background: sel ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.06)', color: sel ? '#C084FC' : 'var(--t3)' }}>
                  {String.fromCharCode(65+i)}
                </span>
                <span style={{ flex:1 }}>{opt}</span>
                {sel && <CheckCircle size={16} color="var(--violet)" style={{ flexShrink:0 }} />}
              </button>
            );
          })}
        </div>

        {/* Nav */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <button onClick={() => setCurrent(c=>c-1)} disabled={current===0} style={{
            display:'flex', alignItems:'center', gap:6, padding:'11px 20px', borderRadius:12, fontSize:13, fontWeight:500, cursor: current===0 ? 'not-allowed' : 'pointer', opacity: current===0 ? 0.35 : 1,
            background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'var(--t2)',
          }}>
            <ArrowLeft size={15} /> Previous
          </button>

          <span style={{ fontSize:12, color:'var(--t3)' }}>{answered}/{questions.length} answered</span>

          {current < questions.length-1 ? (
            <button onClick={() => setCurrent(c=>c+1)} disabled={!answers[current]} className="btn-primary"
              style={{ display:'flex', alignItems:'center', gap:6, padding:'11px 20px', borderRadius:12, fontSize:13, opacity: answers[current] ? 1 : 0.35 }}>
              Next <ArrowRight size={15} />
            </button>
          ) : (
            <button onClick={submit} disabled={!answers[current] || submitting} className="btn-primary"
              style={{ display:'flex', alignItems:'center', gap:6, padding:'11px 20px', borderRadius:12, fontSize:13, opacity: answers[current] ? 1 : 0.35, background:'linear-gradient(135deg,#059669,#10B981)', border:'1px solid rgba(16,185,129,0.4)' }}>
              {submitting ? <Loader2 size={15} style={{ animation:'spin 1s linear infinite' }} /> : <CheckCircle size={15} />}
              {submitting ? 'Submitting…' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
