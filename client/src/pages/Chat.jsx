import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your True Friend AI. Ask me anything! 📚" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Reference to auto-scroll to the latest message
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Trigger scroll whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/ai/chat', { message: input });
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages((m) => [...m, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    // We use a fixed height calculation so the chat fits perfectly inside the layout without page scrolling
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto relative">
      
      {/* Header Area */}
      <div className="flex items-center gap-3 mb-6 px-4">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
          <Sparkles size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-100">True Friend AI</h1>
          <p className="text-sm text-slate-400">Ask questions, clarify doubts, or get study tips.</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-32 custom-scrollbar">
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* AI Avatar */}
            {m.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 mt-1">
                <Bot size={18} className="text-indigo-400" />
              </div>
            )}

            {/* Message Bubble */}
            <div className={`max-w-[80%] md:max-w-[70%] p-4 whitespace-pre-wrap text-[15px] leading-relaxed shadow-sm
              ${m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-indigo-900/20' 
                : 'bg-slate-800/50 text-slate-200 border border-slate-700/50 rounded-2xl rounded-tl-sm'
              }`}
            >
              {m.content}
            </div>

            {/* User Avatar */}
            {m.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center mt-1 shadow-md shadow-indigo-900/20">
                <User size={18} className="text-white" />
              </div>
            )}
          </div>
        ))}
        
        {/* Animated Loading State */}
        {loading && (
          <div className="flex gap-4 justify-start">
             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 mt-1">
                <Bot size={18} className="text-indigo-400" />
              </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2 text-slate-400">
              <Loader2 size={16} className="animate-spin text-indigo-400" />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}
        
        {/* Invisible div to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Floats at the bottom with a blur effect */}
      <div className="absolute bottom-0 left-0 w-full pt-10 pb-4 px-4 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent">
        <div className="relative max-w-3xl mx-auto flex items-end gap-2 bg-slate-900 border border-slate-700 focus-within:border-indigo-500/50 rounded-2xl p-2 shadow-xl transition-colors duration-200">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask your doubt... (Shift+Enter for new line)"
            className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none outline-none text-slate-200 px-3 py-2.5 custom-scrollbar"
            rows="1"
          />
          <button 
            onClick={send} 
            disabled={!input.trim() || loading}
            className={`p-3 rounded-xl flex-shrink-0 transition-all duration-200
              ${!input.trim() || loading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25'}
            `}
          >
            <Send size={20} className={loading ? 'opacity-0' : 'opacity-100'} />
            {/* If you wanted a spinner on the button itself, you could add it here */}
          </button>
        </div>
      </div>
    </div>
  );
}