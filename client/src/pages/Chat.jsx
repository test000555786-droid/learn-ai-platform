import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { Send, Bot, User, Sparkles, Plus, Copy, Check, Lightbulb } from 'lucide-react';

const SUGGESTIONS = [
  'Explain React hooks with examples',
  "What's the difference between SQL and NoSQL?",
  'Help me understand Big O notation',
  'How does machine learning work?',
  'Best practices for REST API design',
];

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm your AI learning companion. I'm here to help you master any topic, clarify concepts, or guide you through challenges. What would you like to explore today? ✨" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [showSugg, setShowSugg] = useState(true);
  const bottomRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput(''); setShowSugg(false);
    setMessages(m => [...m, { role:'user', content: msg }]);
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { message: msg });
      setMessages(m => [...m, { role:'assistant', content: data.reply }]);
    } catch { setMessages(m => [...m, { role:'assistant', content:'I hit a snag — please try again.' }]); }
    finally { setLoading(false); }
  };

  const copyMsg = (content, idx) => {
    navigator.clipboard.writeText(content);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  const resetChat = () => {
    setMessages([{ role:'assistant', content:"Hey! I'm your AI learning companion. I'm here to help you master any topic, clarify concepts, or guide you through challenges. What would you like to explore today? ✨" }]);
    setShowSugg(true);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 80px)', maxWidth:800, margin:'0 auto' }}>

      {/* Header */}
      <div className="fi fi-1" style={{ display:'flex', alignItems:'center', gap:14, paddingBottom:16, marginBottom:4, borderBottom:'1px solid rgba(255,255,255,0.05)', flexShrink:0 }}>
        <div style={{ position:'relative', flexShrink:0 }}>
          <div className="anim-grad" style={{ width:42, height:42, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <span className="pulse" style={{ position:'absolute', top:-2, right:-2, width:11, height:11, borderRadius:'50%', background:'#34D399', border:'2px solid var(--bg)' }} />
        </div>
        <div style={{ flex:1 }}>
          <h1 className="font-display" style={{ fontSize:17, fontWeight:700, color:'var(--t1)', marginBottom:2 }}>AI Companion</h1>
          <p style={{ fontSize:11, color:'var(--t3)' }}>Always online · Powered by Claude</p>
        </div>
        <button onClick={resetChat} style={{
          display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:10, fontSize:12, fontWeight:500,
          background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'var(--t2)', cursor:'pointer', transition:'all 0.15s',
        }}
        onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.14)'}
        onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}>
          <Plus size={14} /> New Chat
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'8px 0 16px', display:'flex', flexDirection:'column', gap:16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display:'flex', gap:12, justifyContent: m.role==='user' ? 'flex-end' : 'flex-start' }} className="fi">
            {m.role === 'assistant' && (
              <div className="anim-grad" style={{ width:32, height:32, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                <Bot size={15} color="#fff" />
              </div>
            )}
            <div style={{ display:'flex', flexDirection:'column', alignItems: m.role==='user' ? 'flex-end' : 'flex-start', maxWidth:'78%' }}>
              <div style={{
                padding:'12px 16px', fontSize:14, lineHeight:1.6, whiteSpace:'pre-wrap', wordBreak:'break-word',
                ...(m.role === 'user'
                  ? { background:'linear-gradient(135deg,#7C3AED,#8B5CF6)', color:'#fff', borderRadius:'16px 16px 3px 16px', boxShadow:'0 4px 18px rgba(124,58,237,0.22)' }
                  : { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'var(--t1)', borderRadius:'16px 16px 16px 3px' })
              }}>
                {m.content}
              </div>
              {m.role === 'assistant' && (
                <button onClick={() => copyMsg(m.content, i)} style={{ display:'flex', alignItems:'center', gap:4, marginTop:6, padding:'3px 8px', borderRadius:6, fontSize:11, color:'var(--t3)', background:'none', border:'none', cursor:'pointer', transition:'color 0.15s' }}
                  onMouseEnter={e=>e.currentTarget.style.color='var(--t2)'} onMouseLeave={e=>e.currentTarget.style.color='var(--t3)'}>
                  {copied===i ? <><Check size={11} />Copied</> : <><Copy size={11} />Copy</>}
                </button>
              )}
            </div>
            {m.role === 'user' && (
              <div style={{ width:32, height:32, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2, background:'rgba(124,58,237,0.25)', border:'1px solid rgba(124,58,237,0.4)' }}>
                <User size={15} color="#C084FC" />
              </div>
            )}
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div style={{ display:'flex', gap:12, justifyContent:'flex-start' }}>
            <div className="anim-grad" style={{ width:32, height:32, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
              <Bot size={15} color="#fff" />
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:5, padding:'12px 16px', borderRadius:'16px 16px 16px 3px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
              {[0,1,2].map(j => <span key={j} className="typing-dot" style={{ width:7, height:7, borderRadius:'50%', background:'var(--violet)', display:'block', animationDelay:`${j*0.2}s` }} />)}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {showSugg && messages.length === 1 && (
          <div className="fi fi-2">
            <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10 }}>
              <Lightbulb size={13} color="var(--amber)" />
              <p style={{ fontSize:12, fontWeight:500, color:'var(--t3)' }}>Suggested questions</p>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  textAlign:'left', padding:'11px 16px', borderRadius:12, fontSize:13,
                  background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
                  color:'var(--t2)', cursor:'pointer', transition:'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(139,92,246,0.35)'; e.currentTarget.style.color='var(--t1)'; e.currentTarget.style.background='rgba(139,92,246,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.color='var(--t2)'; e.currentTarget.style.background='rgba(255,255,255,0.03)'; }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{ flexShrink:0, paddingTop:14, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{
          display:'flex', alignItems:'flex-end', gap:10, padding:'8px 8px 8px 16px',
          background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:16, transition:'border-color 0.2s',
        }}
        onFocusCapture={e => e.currentTarget.style.borderColor='rgba(139,92,246,0.45)'}
        onBlurCapture={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'}>
          <textarea ref={taRef} value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask anything… (Shift+Enter for new line)"
            rows={1}
            style={{ flex:1, background:'transparent', border:'none', outline:'none', resize:'none', fontSize:14, color:'var(--t1)', fontFamily:'inherit', minHeight:40, maxHeight:128, paddingTop:8, paddingBottom:8, lineHeight:1.5 }}
          />
          <button onClick={() => send()} disabled={!input.trim() || loading} style={{
            flexShrink:0, width:38, height:38, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center',
            cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            transition:'all 0.18s',
            ...(input.trim() && !loading
              ? { background:'linear-gradient(135deg,#8B5CF6,#7C3AED)', border:'1px solid rgba(139,92,246,0.4)', boxShadow:'0 4px 14px rgba(139,92,246,0.35)' }
              : { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' })
          }}>
            <Send size={15} color={input.trim() && !loading ? '#fff' : 'var(--t3)'} />
          </button>
        </div>
        <p style={{ textAlign:'center', fontSize:11, color:'var(--t4)', marginTop:8 }}>
          AI can make mistakes — verify important info.
        </p>
      </div>
    </div>
  );
}
