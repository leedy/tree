import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, saveToken } from '../services/api';

function Login({ onLogin }) {
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(teamName, password);
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
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎄</h1>
          <h2 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            Tree on a Truck
          </h2>
          <p style={{ color: 'var(--color-text-light)' }}>
            Spot trees on vehicles this Christmas season!
          </p>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Team Login</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label" htmlFor="teamName">
                Team Name
              </label>
              <input
                id="teamName"
                type="text"
                className="input"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter your team name"
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
