import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import StudyPlan from './pages/StudyPlan';

import AppLayout from './components/layout/AppLayout';

// ✅ Must be defined OUTSIDE App() so it can be used inside Routes
function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-gray-950" />;
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes (Wrapped in BOTH Protected and AppLayout) */}
      <Route path="/" element={
        <Protected>
          <AppLayout>
            <Dashboard />
          </AppLayout>
        </Protected>
      } />
      
      <Route path="/chat" element={
        <Protected>
          <AppLayout>
            <Chat />
          </AppLayout>
        </Protected>
      } />
      
      <Route path="/studyplan" element={
        <Protected>
          <AppLayout>
            <StudyPlan />
          </AppLayout>
        </Protected>
      } />

      {/* Note: I added AppLayout to the Quiz route too so it matches the rest of the app */}
      <Route path="/quiz/:topic" element={
        <Protected>
          <AppLayout>
            <Quiz />
          </AppLayout>
        </Protected>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
