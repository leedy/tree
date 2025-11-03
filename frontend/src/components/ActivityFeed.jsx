import { useState, useEffect } from 'react';
import { getRecentActivities } from '../services/api';

function ActivityFeed({ limit = 10 }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadActivities();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadActivities = async () => {
    try {
      const data = await getRecentActivities(limit);
      setActivities(data.activities);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load activity feed');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const seconds = Math.floor((now - activityTime) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const getActivityMessage = (activity) => {
    if (activity.type === 'tree_spotted') {
      const trees = activity.count === 1 ? 'a tree' : `${activity.count} trees`;
      return (
        <>
          <span style={{ fontWeight: '600' }}>{activity.playerName}</span>
          {' from '}
          <span style={{ fontWeight: '600' }}>{activity.teamName}</span>
          {' spotted '}
          {trees}!
        </>
      );
    }
    return 'Unknown activity';
  };

  if (loading && activities.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-light)' }}>
        Loading activity...
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{ margin: 0 }}>🎄 Recent Activity</h3>
        <button
          onClick={loadActivities}
          className="btn btn-outline"
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div style={{ color: 'var(--color-error)', marginBottom: '1rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {activities.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2rem 1rem',
          color: 'var(--color-text-light)',
          backgroundColor: 'var(--color-bg)',
          borderRadius: '8px'
        }}>
          No activity yet. Start spotting trees!
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxHeight: '400px',
          overflowY: 'auto',
          padding: '0.5rem'
        }}>
          {activities.map((activity) => (
            <div
              key={activity._id}
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--color-bg)',
                borderRadius: '8px',
                borderLeft: '3px solid var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🎄</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
                  {getActivityMessage(activity)}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-light)',
                  marginTop: '0.25rem'
                }}>
                  {getTimeAgo(activity.createdAt)}
                </div>
              </div>
              {activity.type === 'tree_spotted' && (
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: 'var(--color-primary)',
                  minWidth: '2rem',
                  textAlign: 'center'
                }}>
                  {activity.newTotal}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityFeed;
