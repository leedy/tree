import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/api';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const data = await resetPassword(token, newPassword);
      setMessage(data.message);
      setNewPassword('');
      setConfirmPassword('');

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
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
          <h3 style={{ marginBottom: '1rem' }}>Set New Password</h3>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label" htmlFor="newPassword">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                className="input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                disabled={loading || message}
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                disabled={loading || message}
                minLength={6}
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
                <p style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.85rem' }}>
                  Redirecting to login...
                </p>
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary btn-full ${(loading || message) ? 'btn-disabled' : ''}`}
              disabled={loading || message}
              style={{ marginTop: '1rem' }}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;
