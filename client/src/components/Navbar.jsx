import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-white font-bold text-xl">
        🎓 True Friend AI
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/" className="text-gray-400 hover:text-white text-sm transition">Dashboard</Link>
        <Link to="/chat" className="text-gray-400 hover:text-white text-sm transition">AI Tutor</Link>
        <Link to="/studyplan" className="text-gray-400 hover:text-white text-sm transition">Study Plan</Link>
        <button
          onClick={handleLogout}
          className="text-sm bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
