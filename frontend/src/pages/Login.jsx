import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, saveToken } from '../services/api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      saveToken(data.token);
      onLogin();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/images/logo.png"
            alt="Tree on a Truck"
            style={{ maxWidth: '300px', width: '100%', height: 'auto', marginBottom: '1rem' }}
          />
          <p style={{ color: 'var(--color-text-light)', fontSize: '1.125rem' }}>
            🎅 Spot trees on vehicles this Christmas season! 🎁
          </p>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Team Login</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
              <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
                <Link
                  to="/forgot-password"
                  style={{
                    color: 'var(--color-primary)',
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className={`btn btn-primary btn-full ${loading ? 'btn-disabled' : ''}`}
              disabled={loading}
              style={{ marginTop: '1rem' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-light)' }}>
              Don't have a team?{' '}
              <Link
                to="/register"
                style={{ color: 'var(--color-primary)', fontWeight: 600 }}
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
