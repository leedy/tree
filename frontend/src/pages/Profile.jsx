import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTeam, changePassword } from '../services/api';

function Profile() {
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      const data = await getTeam();
      setTeam(data);
    } catch (err) {
      console.error('Error loading team:', err);
      if (err.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load team information');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setChangingPassword(true);
      await changePassword(currentPassword, newPassword);
      setSuccess('Password changed successfully!');
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '2rem', textAlign: 'center' }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Team Information */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                Team Name
              </label>
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'var(--color-bg)',
                borderRadius: '4px',
                border: '1px solid var(--color-border)'
              }}>
                {team?.teamName}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                Email
              </label>
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'var(--color-bg)',
                borderRadius: '4px',
                border: '1px solid var(--color-border)'
              }}>
                {team?.email}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                Member Since
              </label>
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'var(--color-bg)',
                borderRadius: '4px',
                border: '1px solid var(--color-border)'
              }}>
                {team?.createdAt ? new Date(team.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="card">
            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="btn btn-outline"
                style={{ width: '100%' }}
              >
                Change Password
              </button>
            ) : (
              <>
                {error && (
                  <div className="error-message" style={{ marginBottom: '1rem' }}>
                    {error}
                  </div>
                )}

                {success && (
                  <div style={{
                    padding: '0.75rem',
                    marginBottom: '1rem',
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    border: '1px solid #c3e6cb',
                    borderRadius: '4px'
                  }}>
                    {success}
                  </div>
                )}

                <form onSubmit={handleChangePassword}>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="currentPassword" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className="input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={changingPassword}
                  autoComplete="current-password"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="newPassword" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={changingPassword}
                  autoComplete="new-password"
                  minLength="6"
                />
                <small style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
                  Must be at least 6 characters
                </small>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={changingPassword}
                  autoComplete="new-password"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={changingPassword}
                  style={{ flex: 1 }}
                >
                  {changingPassword ? 'Changing Password...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setError('');
                    setSuccess('');
                  }}
                  className="btn btn-outline"
                  disabled={changingPassword}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
              </>
            )}
          </div>
        </div>
      </div>
  );
}

export default Profile;
