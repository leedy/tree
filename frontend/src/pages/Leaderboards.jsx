import { useState, useEffect } from 'react';
import { getTeamLeaderboard, getPlayerLeaderboard } from '../services/api';

function Leaderboards() {
  const [view, setView] = useState('teams'); // 'teams' or 'players'
  const [teamLeaderboard, setTeamLeaderboard] = useState([]);
  const [playerLeaderboard, setPlayerLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [teamsData, playersData] = await Promise.all([
        getTeamLeaderboard(),
        getPlayerLeaderboard()
      ]);

      setTeamLeaderboard(teamsData.leaderboard);
      setPlayerLeaderboard(playersData.leaderboard);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load leaderboards');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  const currentLeaderboard = view === 'teams' ? teamLeaderboard : playerLeaderboard;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div className="card">
        <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
          Leaderboards
        </h2>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setView('teams')}
            className={`btn ${view === 'teams' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
          >
            Teams
          </button>
          <button
            onClick={() => setView('players')}
            className={`btn ${view === 'players' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
          >
            Individual Players
          </button>
        </div>
      </div>

      {error && (
        <div className="card" style={{ backgroundColor: '#FEE2E2', color: 'var(--color-error)' }}>
          {error}
        </div>
      )}

      {/* Leaderboard */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>
          {view === 'teams' ? 'Team Rankings' : 'Individual Rankings'}
        </h3>

        {currentLeaderboard.length === 0 ? (
          <p style={{ color: 'var(--color-text-light)', textAlign: 'center', padding: '2rem 0' }}>
            No data available yet. Start spotting trees!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentLeaderboard.map((item, index) => {
              const isTeam = view === 'teams';
              const rank = index + 1;
              const medalEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';

              return (
                <div
                  key={isTeam ? item.id : item.playerId}
                  className="card"
                  style={{
                    padding: '1rem',
                    backgroundColor: rank <= 3 ? '#FEF3C7' : 'var(--color-bg)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <div
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: 'var(--color-text-light)',
                        minWidth: '3rem',
                        textAlign: 'center'
                      }}
                    >
                      {medalEmoji || `#${rank}`}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                        {isTeam ? item.teamName : item.playerName}
                      </h4>
                      {!isTeam && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                          Team: {item.teamName}
                        </p>
                      )}
                      {isTeam && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                          {item.playerCount} member{item.playerCount !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                      {isTeam ? item.totalCount : item.count}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>
                      trees
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {currentLeaderboard.length > 0 && (
        <div className="card" style={{ backgroundColor: '#DBEAFE' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>Stats Summary</h4>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {currentLeaderboard.length}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                {view === 'teams' ? 'Teams' : 'Players'}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {currentLeaderboard.reduce((sum, item) =>
                  sum + (view === 'teams' ? item.totalCount : item.count), 0
                )}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                Total Trees
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {currentLeaderboard.length > 0
                  ? Math.round(
                      currentLeaderboard.reduce((sum, item) =>
                        sum + (view === 'teams' ? item.totalCount : item.count), 0
                      ) / currentLeaderboard.length
                    )
                  : 0}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                Average
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboards;
