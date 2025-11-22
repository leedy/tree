import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isAuthenticated, isAdminAuthenticated } from './services/api';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Leaderboards from './pages/Leaderboards';
import Countdown from './pages/Countdown';
import Rules from './pages/Rules';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  return !isAuthenticated() ? children : <Navigate to="/dashboard" />;
}

function AdminRoute({ children }) {
  return isAdminAuthenticated() ? children : <Navigate to="/admin/login" />;
}

function AdminPublicRoute({ children }) {
  return !isAdminAuthenticated() ? children : <Navigate to="/admin/dashboard" />;
}

function App() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());
  const [isAdminAuth, setIsAdminAuth] = useState(isAdminAuthenticated());

  useEffect(() => {
    // Listen for auth changes
    const checkAuth = () => {
      setIsAuth(isAuthenticated());
      setIsAdminAuth(isAdminAuthenticated());
    };
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <Router>
      <div className="app">
        {isAuth && <Header />}
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login onLogin={() => setIsAuth(true)} />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register onRegister={() => setIsAuth(true)} />
              </PublicRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/leaderboards"
            element={
              <PrivateRoute>
                <Leaderboards />
              </PrivateRoute>
            }
          />
          <Route
            path="/countdown"
            element={
              <PrivateRoute>
                <Countdown />
              </PrivateRoute>
            }
          />
          <Route
            path="/rules"
            element={
              <PrivateRoute>
                <Rules />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/"
            element={
              isAuth ? <Navigate to="/dashboard" /> : <Landing />
            }
          />
          <Route
            path="/admin/login"
            element={
              <AdminPublicRoute>
                <AdminLogin onAdminLogin={() => setIsAdminAuth(true)} />
              </AdminPublicRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
