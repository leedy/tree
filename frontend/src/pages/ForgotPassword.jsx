import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/api';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const data = await forgotPassword(email);
      setMessage(data.message);
      setEmail('');
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
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
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Reset Password</h3>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label" htmlFor="email">
                Email Address
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

            {error && <div className="error-message">{error}</div>}
            {message && (
              <div style={{
                backgroundColor: '#d4edda',
                color: '#155724',
                padding: '0.75rem',
                borderRadius: '6px',
                marginBottom: '1rem',
                fontSize: '0.9rem'
              }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary btn-full ${loading ? 'btn-disabled' : ''}`}
              disabled={loading}
              style={{ marginTop: '1rem' }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link
              to="/login"
              style={{ color: 'var(--color-primary)', fontWeight: 600 }}
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
