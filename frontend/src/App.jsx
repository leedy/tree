import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isAuthenticated } from './services/api';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Leaderboards from './pages/Leaderboards';
import Countdown from './pages/Countdown';
import Rules from './pages/Rules';
import Landing from './pages/Landing';

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  return !isAuthenticated() ? children : <Navigate to="/dashboard" />;
}

function App() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    // Listen for auth changes
    const checkAuth = () => setIsAuth(isAuthenticated());
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
            path="/"
            element={
              isAuth ? <Navigate to="/dashboard" /> : <Landing />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
