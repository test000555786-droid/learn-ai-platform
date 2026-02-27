import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // <-- Added your AuthContext
import { 
  LayoutDashboard, 
  MessageSquare, 
  Calendar, 
  LogOut, 
  Menu, 
  X, 
  GraduationCap 
} from 'lucide-react';

const AppLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Bring in your auth logic
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'True Friend AI', path: '/chat', icon: MessageSquare },
    { name: 'Study Plan', path: '/studyplan', icon: Calendar },
  ];

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // If there's no user, we shouldn't render the protected layout
  if (!user) return null;

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans">
      
      {/* --- MOBILE HEADER --- */}
      <div className="md:hidden absolute top-0 w-full h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xl">
          <GraduationCap size={24} />
          <span>True Friend AI</span>
        </div>
        <button onClick={toggleMenu} className="p-2 text-slate-300 hover:text-white">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- SIDEBAR (Desktop & Mobile Slide-out) --- */}
      <aside className={`
        absolute md:relative z-30 flex flex-col w-64 h-full bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="hidden md:flex h-20 items-center gap-3 px-6 text-indigo-400 font-bold text-2xl border-b border-slate-800/50">
          <GraduationCap size={28} />
          <span>True Friend AI</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 mt-6 md:mt-10 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-indigo-600/10 text-indigo-400 shadow-[inset_0px_0px_20px_rgba(79,70,229,0.1)]' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
                `}
              >
                <Icon size={20} className={isActive ? 'text-indigo-400' : 'text-slate-500'} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User / Logout Area */}
        <div className="p-4 border-t border-slate-800">
          {/* Optional: Show user's name/email if you have it in your user object */}
          <div className="px-4 py-3 mb-2 text-sm text-slate-300 bg-slate-800/50 rounded-xl truncate border border-slate-700/50">
            {user.email || 'Student User'}
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-slate-400 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 h-full overflow-y-auto pt-16 md:pt-0 bg-slate-950 relative z-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm"
          onClick={toggleMenu}
        />
      )}
    </div>
  );
};

export default AppLayout;