import { useState } from 'react';
import api from '../services/api';
import { 
  Calendar, 
  Sparkles, 
  AlertTriangle, 
  Loader2, 
  RefreshCw, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

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
    } catch (err) {
      setPlan('Failed to generate study plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPlan = () => {
    setGenerated(false); 
    setPlan(''); 
    setWeakTopics([]);
  };

  return (
    // Removed min-h-screen and bg-gray-950 because AppLayout handles the background and height
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 pb-12">
      
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20 shadow-[inset_0_0_20px_rgba(99,102,241,0.1)]">
          <Calendar size={28} />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">Personalized Study Plan</h1>
          <p className="text-slate-400 mt-1">AI analyzes your weak topics to generate a focused 7-day recovery roadmap.</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full">
        
        {/* Empty State / Generation Button Area */}
        {!generated && (
          <div className="flex flex-col items-center justify-center p-12 md:p-20 border border-dashed border-slate-700/50 rounded-3xl bg-slate-900/30 text-center relative overflow-hidden">
            
            {/* Decorative background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="p-4 bg-slate-800 rounded-full border border-slate-700 shadow-xl">
                <BookOpen size={48} className="text-slate-400" />
              </div>
              
              <div className="max-w-md">
                <h3 className="text-xl font-semibold text-slate-200 mb-2">Ready to level up?</h3>
                <p className="text-slate-400 text-sm mb-8">
                  Click below to generate a smart, adaptive study schedule based on your recent quiz performance.
                </p>
              </div>

              <button
                onClick={generate}
                disabled={loading}
                className={`
                  group relative flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300
                  ${loading 
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40 hover:shadow-indigo-500/25 hover:-translate-y-0.5'}
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>Analyzing Performance...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={24} className="group-hover:animate-pulse" />
                    <span>Generate My Study Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Generated Plan State */}
        {generated && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Weak Topics Banner */}
            {weakTopics.length > 0 && (
              <div className="flex items-start md:items-center gap-4 p-5 bg-red-950/20 border border-red-900/30 rounded-2xl">
                <div className="p-2 bg-red-500/10 rounded-lg text-red-400 shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-2">Focus Areas Detected</h3>
                  <div className="flex flex-wrap gap-2">
                    {weakTopics.map((topic, index) => (
                      <span 
                        key={index} 
                        className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* The Plan Container */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-indigo-400 flex items-center gap-2">
                  <BookOpen size={20} />
                  Your 7-Day Roadmap
                </h2>
                
                <button
                  onClick={resetPlan}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <RefreshCw size={16} />
                  <span className="hidden sm:inline">Regenerate</span>
                </button>
              </div>
              
              <div className="p-6 md:p-8">
                {plan === 'Failed to generate study plan. Please try again.' ? (
                   <p className="text-red-400">{plan}</p>
                ) : (
                  <div className="prose prose-invert max-w-none text-slate-300">
                    {/* Assuming your API returns plain text.
                      If it returns Markdown, you should use 'react-markdown' here instead of <pre>.
                    */}
                    <pre className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed">
                      {plan}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}