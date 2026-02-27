import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

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
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await api.get(`/quiz/${encodeURIComponent(topic)}`);
        if (!data.questions || data.questions.length === 0) {
          setError('No questions returned. Please try again.');
          return;
        }
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(null));
      } catch (err) {
        console.error('Quiz fetch error:', err);
        setError(err.response?.data?.message || 'Failed to load quiz. Check your GROQ_API_KEY in server/.env');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [topic]);

  const handleAnswer = (option) => {
    const updated = [...answers];
    updated[current] = option;
    setAnswers(updated);
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const { data } = await api.post('/quiz/submit', {
        topic,
        questions,
        userAnswers: answers,
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ──
  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400">Generating quiz for <span className="text-white font-semibold">{topic}</span>...</p>
      <p className="text-gray-600 text-sm">This may take a few seconds</p>
    </div>
  );

  // ── Error ──
  if (error) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full text-center">
        <p className="text-4xl mb-4">❌</p>
        <h2 className="text-white text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-red-400 text-sm mb-6 bg-red-500/10 p-3 rounded-xl">{error}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setError(''); setLoading(true); window.location.reload(); }}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-xl text-white text-sm transition"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-xl text-white text-sm transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  // ── Result ──
  if (result) {
    const masteryColor =
      result.masteryScore >= 80 ? 'text-green-400' :
      result.masteryScore >= 60 ? 'text-yellow-400' : 'text-red-400';

    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
        <div className="bg-gray-900 rounded-2xl p-10 max-w-md w-full text-center text-white">
          <p className="text-5xl mb-4">
            {result.score >= 80 ? '🏆' : result.score >= 60 ? '👍' : '📚'}
          </p>
          <h2 className="text-3xl font-bold mb-1">Quiz Complete!</h2>
          <p className="text-gray-400 mb-6">{topic}</p>

          <div className="bg-gray-800 rounded-xl p-6 mb-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Score</span>
              <span className="font-bold text-2xl text-indigo-400">{result.score}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Mastery Score</span>
              <span className={`font-semibold ${masteryColor}`}>{result.masteryScore}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Next Difficulty</span>
              <span className="text-yellow-400 capitalize font-semibold">{result.difficulty}</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-semibold transition"
            >
              Retry Quiz
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-semibold transition"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Quiz ──
  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-white text-sm transition">
            ← Dashboard
          </button>
          <span className="text-gray-400 text-sm font-medium">{topic}</span>
          <span className="text-gray-500 text-sm">{current + 1} / {questions.length}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-800 rounded-full h-2 mb-8">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-gray-900 rounded-2xl p-8 mb-6">
          <h2 className="text-xl font-semibold leading-relaxed">{q.question}</h2>
        </div>

        {/* Options */}
        <div className="grid gap-3 mb-8">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className={`w-full p-4 rounded-xl border text-left transition font-medium ${
                answers[current] === opt
                  ? 'border-indigo-500 bg-indigo-500/20 text-white'
                  : 'border-gray-700 bg-gray-900 hover:border-indigo-400 text-gray-300'
              }`}
            >
              <span className="text-gray-500 mr-3">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrent(c => c - 1)}
            disabled={current === 0}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl disabled:opacity-30 transition"
          >
            ← Back
          </button>

          {current < questions.length - 1 ? (
            <button
              onClick={() => setCurrent(c => c + 1)}
              disabled={!answers[current]}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl disabled:opacity-30 transition font-semibold"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={!answers[current] || submitting}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-xl disabled:opacity-30 transition font-semibold"
            >
              {submitting ? 'Submitting...' : '✓ Submit Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
