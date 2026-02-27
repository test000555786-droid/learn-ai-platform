import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  RadarChart, PolarGrid, PolarAngleAxis,
  Radar, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const TOPICS_BY_GOAL = {
  'Data Science': ['Python Basics', 'Pandas', 'NumPy', 'Machine Learning', 'Data Visualization', 'Statistics'],
  'Web Development': ['HTML & CSS', 'JavaScript', 'React', 'Node.js', 'REST APIs', 'Databases'],
  'Machine Learning': ['Linear Regression', 'Neural Networks', 'CNNs', 'NLP', 'Clustering', 'Model Evaluation'],
  'Competitive Programming': ['Arrays', 'Linked Lists', 'Dynamic Programming', 'Graphs', 'Trees', 'Sorting'],
  'System Design': ['Load Balancing', 'Caching', 'Databases', 'Microservices', 'CAP Theorem', 'Message Queues'],
  'Mobile Development': ['React Native', 'Flutter', 'APIs', 'State Management', 'UI Components', 'Deployment'],
  'Cybersecurity': ['Networking', 'Cryptography', 'Web Security', 'Penetration Testing', 'Firewalls', 'OWASP'],
};

const DEFAULT_TOPICS = ['Python Basics', 'JavaScript', 'Data Structures', 'Algorithms', 'Databases', 'Networking'];

const DIFFICULTY_COLORS = {
  easy: 'text-green-400 bg-green-500/20',
  medium: 'text-yellow-400 bg-yellow-500/20',
  hard: 'text-red-400 bg-red-500/20',
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    api.get('/progress').then(({ data }) => setProgress(data));
  }, []);

  const topics = TOPICS_BY_GOAL[user?.learningGoal] || DEFAULT_TOPICS;
  const radarData = progress.map((p) => ({ topic: p.topic, mastery: p.masteryScore }));
  const weakTopics = progress.filter((p) => p.masteryScore < 60);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name} 👋</h1>
        <p className="text-gray-400 mt-1">Goal: <span className="text-indigo-400">{user?.learningGoal}</span></p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-2xl p-5 text-center">
          <p className="text-3xl font-black text-indigo-400">{progress.length}</p>
          <p className="text-gray-400 text-sm mt-1">Topics Attempted</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-5 text-center">
          <p className="text-3xl font-black text-green-400">
            {progress.filter(p => p.masteryScore >= 80).length}
          </p>
          <p className="text-gray-400 text-sm mt-1">Topics Mastered</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-5 text-center">
          <p className="text-3xl font-black text-yellow-400">
            {progress.length > 0
              ? Math.round(progress.reduce((a, b) => a + b.masteryScore, 0) / progress.length)
              : 0}%
          </p>
          <p className="text-gray-400 text-sm mt-1">Avg Mastery</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Radar Chart */}
        <div className="bg-gray-900 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Topic Mastery Radar</h2>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="topic" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Radar dataKey="mastery" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-600">
              Take a quiz to see your radar chart
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-900 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Mastery Scores</h2>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={radarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="topic" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '12px' }} />
                <Bar dataKey="mastery" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-600">
              Take a quiz to see your scores
            </div>
          )}
        </div>
      </div>

      {/* Weak Topics */}
      {weakTopics.length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-3">⚠️ Weak Topics — Need Practice</h2>
          <div className="flex flex-wrap gap-2">
            {weakTopics.map((p) => (
              <button
                key={p.topic}
                onClick={() => navigate(`/quiz/${encodeURIComponent(p.topic)}`)}
                className="bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm hover:bg-red-500/30 transition"
              >
                {p.topic} — {p.masteryScore}% →
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Topic Grid */}
      <div className="bg-gray-900 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">📚 Start a Quiz</h2>
        <div className="grid grid-cols-3 gap-3">
          {topics.map((topic) => {
            const p = progress.find((x) => x.topic === topic);
            return (
              <button
                key={topic}
                onClick={() => navigate(`/quiz/${encodeURIComponent(topic)}`)}
                className="bg-gray-800 hover:bg-gray-700 rounded-xl p-4 text-left transition group"
              >
                <p className="font-medium text-white group-hover:text-indigo-400 transition">{topic}</p>
                {p ? (
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[p.difficultyLevel]}`}>
                      {p.difficultyLevel}
                    </span>
                    <span className="text-sm text-gray-400">{p.masteryScore}%</span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-600 mt-2">Not started</p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
