import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Award, Target, BookOpen, BarChart2, Zap } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const TOPICS_BY_GOAL = {
  'Data Science':              ['Python Basics','Pandas','NumPy','Machine Learning','Data Visualization','Statistics'],
  'Web Development':           ['HTML & CSS','JavaScript','React','Node.js','REST APIs','Databases'],
  'Machine Learning':          ['Linear Regression','Neural Networks','CNNs','NLP','Clustering','Model Evaluation'],
  'Competitive Programming':   ['Arrays','Linked Lists','Dynamic Programming','Graphs','Trees','Sorting'],
  'System Design':             ['Load Balancing','Caching','Databases','Microservices','CAP Theorem','Message Queues'],
  'Mobile Development':        ['React Native','Flutter','APIs','State Management','UI Components','Deployment'],
  'Cybersecurity':             ['Networking','Cryptography','Web Security','Penetration Testing','Firewalls','OWASP'],
};
const DEFAULT_TOPICS = ['Python Basics','JavaScript','Data Structures','Algorithms','Databases','Networking'];
const ICONS = ['⚡','🧩','🔬','📐','🛠','🎯','🔐','🌐','📊','💡'];
const DIFF = {
  easy:   { bg:'rgba(52,211,153,0.1)',  color:'#34D399', label:'Easy' },
  medium: { bg:'rgba(251,191,36,0.1)',  color:'#FBBF24', label:'Mid'  },
  hard:   { bg:'rgba(248,113,113,0.1)', color:'#F87171', label:'Hard' },
};
const QUOTES = [
  'Every expert was once a beginner. Keep going.',
  'The secret of getting ahead is getting started.',
  'Learning is not attained by chance — it must be sought.',
  'An investment in knowledge pays the best interest.',
];

const Tip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#1A2236', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'8px 12px', fontSize:12 }}>
      <p style={{ color:'var(--t1)', fontWeight:600, marginBottom:2 }}>{payload[0]?.payload?.topic}</p>
      <p style={{ color:'#A78BFA' }}>{payload[0]?.value}% mastery</p>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  useEffect(() => { api.get('/progress').then(({ data }) => setProgress(data)).catch(() => {}); }, []);

  const topics = TOPICS_BY_GOAL[user?.learningGoal] || DEFAULT_TOPICS;
  const radar = progress.map(p => ({ topic: p.topic, mastery: p.masteryScore }));
  const weak  = progress.filter(p => p.masteryScore < 60);
  const avg   = progress.length ? Math.round(progress.reduce((a, b) => a + b.masteryScore, 0) / progress.length) : 0;

  const stats = [
    { label:'Topics Attempted', value: progress.length,                                  color:'#A78BFA', bg:'rgba(139,92,246,0.08)', acc:'acc-violet', Icon: BookOpen },
    { label:'Topics Mastered',  value: progress.filter(p=>p.masteryScore>=80).length,   color:'#2DD4BF', bg:'rgba(45,212,191,0.08)',  acc:'acc-teal',   Icon: Award },
    { label:'Avg Mastery',      value: `${avg}%`,                                        color:'#F472B6', bg:'rgba(244,114,182,0.08)', acc:'acc-rose',   Icon: TrendingUp },
    { label:'Need Practice',    value: weak.length,                                      color:'#FBB23C', bg:'rgba(251,178,60,0.08)',  acc:'acc-amber',  Icon: Target },
  ];

  return (
    <div style={{ paddingBottom: 32 }}>

      {/* Header */}
      <div className="fi fi-1" style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-start', justifyContent:'space-between', gap:16, marginBottom:28 }}>
        <div>
          <h1 className="font-display" style={{ fontSize:'clamp(22px,3vw,30px)', fontWeight:700, color:'var(--t1)', marginBottom:6 }}>
            Hey, <span className="grad-text">{user?.name?.split(' ')[0] || 'there'}</span> 👋
          </h1>
          <p style={{ fontSize:13, color:'var(--t2)' }}>
            Goal: <span style={{ color:'#A78BFA', fontWeight:500 }}>{user?.learningGoal || 'Learning'}</span>
          </p>
        </div>
        <div style={{ padding:'12px 16px', borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', maxWidth:320 }} className="quote-pill">
          <p style={{ fontSize:10, fontWeight:600, color:'var(--t3)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>✦ Daily Insight</p>
          <p style={{ fontSize:12, color:'var(--t2)', fontStyle:'italic', lineHeight:1.5 }}>"{quote}"</p>
        </div>
      </div>

      {/* Stats */}
      <div className="fi fi-2" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {stats.map(({ label, value, color, bg, acc, Icon }) => (
          <div key={label} className={`glass ${acc}`} style={{ borderRadius:16, padding:'16px', position:'relative', overflow:'hidden', background:`linear-gradient(135deg,${bg} 0%, transparent 100%)` }}>
            <div style={{ width:34, height:34, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', background:bg, marginBottom:12 }}>
              <Icon size={16} color={color} />
            </div>
            <p className="font-display" style={{ fontSize:28, fontWeight:700, color, lineHeight:1, marginBottom:4 }}>{value}</p>
            <p style={{ fontSize:11, color:'var(--t3)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="fi fi-3" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:20 }}>
        {/* Bar chart */}
        <div className="glass" style={{ borderRadius:16, padding:'20px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <div style={{ width:28, height:28, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(139,92,246,0.12)' }}>
              <BarChart2 size={14} color="var(--violet)" />
            </div>
            <span className="font-display" style={{ fontSize:13, fontWeight:600, color:'var(--t1)' }}>Mastery Scores</span>
          </div>
          {radar.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={radar} margin={{ top:0, right:0, left:-24, bottom:0 }}>
                <defs>
                  <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" /><stop offset="100%" stopColor="#F472B6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="topic" tick={{ fill:'#4B5563', fontSize:10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0,100]} tick={{ fill:'#4B5563', fontSize:10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip />} />
                <Bar dataKey="mastery" fill="url(#bg1)" radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height:200, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10 }}>
              <span style={{ fontSize:32 }}>📊</span>
              <p style={{ fontSize:12, color:'var(--t3)' }}>Take a quiz to see scores</p>
            </div>
          )}
        </div>

        {/* Radar chart */}
        <div className="glass" style={{ borderRadius:16, padding:'20px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <div style={{ width:28, height:28, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(244,114,182,0.1)' }}>
              <Zap size={14} color="var(--rose)" />
            </div>
            <span className="font-display" style={{ fontSize:13, fontWeight:600, color:'var(--t1)' }}>Skill Radar</span>
          </div>
          {radar.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radar}>
                <defs>
                  <linearGradient id="rg1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" /><stop offset="100%" stopColor="#F472B6" />
                  </linearGradient>
                </defs>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="topic" tick={{ fill:'#4B5563', fontSize:9 }} />
                <Radar dataKey="mastery" stroke="#8B5CF6" fill="url(#rg1)" fillOpacity={0.3} strokeWidth={2} />
                <Tooltip content={<Tip />} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height:200, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10 }}>
              <span style={{ fontSize:32 }}>🎯</span>
              <p style={{ fontSize:12, color:'var(--t3)' }}>Take a quiz to see your radar</p>
            </div>
          )}
        </div>
      </div>

      {/* Weak topics */}
      {weak.length > 0 && (
        <div className="fi fi-4" style={{ borderRadius:16, padding:'18px 20px', marginBottom:16, background:'linear-gradient(135deg,rgba(248,113,113,0.06),transparent)', border:'1px solid rgba(248,113,113,0.15)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <Target size={15} color="#F87171" />
            <span style={{ fontSize:13, fontWeight:600, color:'var(--t1)' }}>Needs Practice</span>
            <span style={{ marginLeft:'auto', fontSize:11, padding:'2px 8px', borderRadius:99, background:'rgba(248,113,113,0.1)', color:'#F87171' }}>{weak.length} topic{weak.length>1?'s':''}</span>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {weak.map(p => (
              <button key={p.topic} onClick={() => navigate(`/quiz/${encodeURIComponent(p.topic)}`)} style={{
                display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:99, fontSize:12, fontWeight:500, cursor:'pointer',
                background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.2)', color:'#F87171', transition:'all 0.15s',
              }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(248,113,113,0.18)'}
              onMouseLeave={e=>e.currentTarget.style.background='rgba(248,113,113,0.1)'}>
                {p.topic} <span style={{ opacity:0.6, fontSize:11 }}>{p.masteryScore}% →</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Topic grid */}
      <div className="fi fi-5 glass" style={{ borderRadius:16, padding:'20px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <BookOpen size={15} color="var(--violet)" />
            <span className="font-display" style={{ fontSize:13, fontWeight:600, color:'var(--t1)' }}>Start a Quiz</span>
          </div>
          <span style={{ fontSize:11, color:'var(--t3)' }}>{topics.length} topics available</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
          {topics.map((topic, i) => {
            const p = progress.find(x => x.topic === topic);
            const d = p ? DIFF[p.difficultyLevel] : null;
            return (
              <button key={topic} onClick={() => navigate(`/quiz/${encodeURIComponent(topic)}`)} style={{
                display:'flex', flexDirection:'column', alignItems:'flex-start', padding:'14px', borderRadius:14,
                background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)',
                cursor:'pointer', textAlign:'left', transition:'all 0.18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(139,92,246,0.35)'; e.currentTarget.style.transform='scale(1.02)'; e.currentTarget.style.background='rgba(139,92,246,0.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.background='rgba(255,255,255,0.02)'; }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', marginBottom:10 }}>
                  <span style={{ fontSize:20 }}>{ICONS[i % ICONS.length]}</span>
                  {d && <span style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:99, background:d.bg, color:d.color }}>{d.label}</span>}
                </div>
                <p style={{ fontSize:12, fontWeight:500, color:'var(--t1)', marginBottom: p ? 8 : 4, lineHeight:1.3 }}>{topic}</p>
                {p ? (
                  <div style={{ width:'100%', display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ flex:1, height:3, borderRadius:99, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
                      <div style={{ width:`${p.masteryScore}%`, height:'100%', borderRadius:99, background:'linear-gradient(90deg,#8B5CF6,#F472B6)' }} />
                    </div>
                    <span style={{ fontSize:11, color:'var(--t2)', flexShrink:0 }}>{p.masteryScore}%</span>
                  </div>
                ) : (
                  <p style={{ fontSize:11, color:'var(--t3)' }}>Not started</p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .charts-grid { grid-template-columns: 1fr !important; }
          .topics-grid { grid-template-columns: repeat(2,1fr) !important; }
          .quote-pill { display: none !important; }
        }
        @media (max-width: 540px) {
          .topics-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
