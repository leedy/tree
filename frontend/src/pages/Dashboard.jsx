import { useState, useEffect } from 'react';
import {
  getTeam,
  addPlayer,
  updatePlayer,
  deletePlayer,
  incrementPlayerCount,
  decrementPlayerCount
} from '../services/api';

function Dashboard() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [editingPlayerName, setEditingPlayerName] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    loadTeam();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!team || team.allowAddingTrees || !team.seasonStartDate) {
      return;
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const startTime = new Date(team.seasonStartDate).getTime();
      const distance = startTime - now;

      if (distance < 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [team]);

  const loadTeam = async () => {
    try {
      setLoading(true);
      const data = await getTeam();
      setTeam(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    try {
      setActionLoading('add');
      const data = await addPlayer(newPlayerName.trim());
      setTeam({ ...team, players: data.players, totalCount: data.totalCount });
      setNewPlayerName('');
      setShowAddForm(false); // Hide form after adding
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to add player');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditPlayer = async (playerId) => {
    if (!editingPlayerName.trim()) return;

    try {
      setActionLoading(`edit-${playerId}`);
      const data = await updatePlayer(playerId, editingPlayerName.trim());
      setTeam({ ...team, players: data.players, totalCount: data.totalCount });
      setEditingPlayerId(null);
      setEditingPlayerName('');
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to update player');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeletePlayer = async (playerId) => {
    if (!confirm('Are you sure you want to delete this player?')) return;

    try {
      setActionLoading(`delete-${playerId}`);
      const data = await deletePlayer(playerId);
      setTeam({ ...team, players: data.players, totalCount: data.totalCount });
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to delete player');
    } finally {
      setActionLoading(null);
    }
  };

  const handleIncrement = async (playerId) => {
    try {
      setActionLoading(`inc-${playerId}`);
      const data = await incrementPlayerCount(playerId);

      // Update the specific player in the team
      const updatedPlayers = team.players.map(p =>
        p._id === playerId ? { ...p, count: data.player.count } : p
      );
      setTeam({ ...team, players: updatedPlayers, totalCount: data.totalCount });
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to increment count');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecrement = async (playerId) => {
    try {
      setActionLoading(`dec-${playerId}`);
      const data = await decrementPlayerCount(playerId);

      const updatedPlayers = team.players.map(p =>
        p._id === playerId ? { ...p, count: data.player.count } : p
      );
      setTeam({ ...team, players: updatedPlayers, totalCount: data.totalCount });
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to decrement count');
    } finally {
      setActionLoading(null);
    }
  };

  const startEdit = (player) => {
    setEditingPlayerId(player._id);
    setEditingPlayerName(player.name);
  };

  const cancelEdit = () => {
    setEditingPlayerId(null);
    setEditingPlayerName('');
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="error-message">Failed to load team data</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '1rem', paddingBottom: '2rem' }}>
      {/* Team Header - Compact */}
      <div className="card" style={{ padding: '0.75rem 1rem', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ color: 'var(--color-primary)', marginBottom: '0.25rem', fontSize: '1.25rem' }}>
              {team.teamName}
            </h2>
            <p style={{ color: 'var(--color-text-light)', fontSize: '0.75rem', margin: 0 }}>
              Season {team.season}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)', lineHeight: 1, margin: 0 }}>
              {team.totalCount}
            </p>
            <p style={{ color: 'var(--color-text-light)', fontSize: '0.75rem', margin: 0 }}>
              Trees
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="card" style={{ backgroundColor: '#FEE2E2', color: 'var(--color-error)', padding: '0.75rem', marginBottom: '0.75rem' }}>
          {error}
        </div>
      )}

      {!team.allowAddingTrees && (
        <div className="card" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '1.5rem',
          marginBottom: '0.75rem',
          textAlign: 'center',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 'bold' }}>
            🎄 Season Starts Soon! 🎄
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '1rem 0.5rem',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', lineHeight: '1' }}>
                {countdown.days}
              </div>
              <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.9 }}>
                Days
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '1rem 0.5rem',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', lineHeight: '1' }}>
                {countdown.hours}
              </div>
              <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.9 }}>
                Hours
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '1rem 0.5rem',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', lineHeight: '1' }}>
                {countdown.minutes}
              </div>
              <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.9 }}>
                Minutes
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '1rem 0.5rem',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', lineHeight: '1' }}>
                {countdown.seconds}
              </div>
              <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.9 }}>
                Seconds
              </div>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.95 }}>
            Tree Season begins Black Friday at 8:00 AM EST
          </p>
        </div>
      )}

      {/* Players List - Score Tracking */}
      <div className="card" style={{ padding: '1rem', marginBottom: '0.75rem' }}>
        <h3 style={{ marginBottom: '0.75rem', fontSize: '1.125rem' }}>Team Members ({team.players.length})</h3>

        {team.players.length === 0 ? (
          <p style={{ color: 'var(--color-text-light)', textAlign: 'center', padding: '1.5rem 0' }}>
            No team members yet. Click "Manage Team" to get started!
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '0.75rem'
          }}>
            {team.players.map((player) => (
              <div
                key={player._id}
                className="card"
                style={{ padding: '0.5rem', backgroundColor: 'var(--color-bg)' }}
              >
                <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.5rem', textAlign: 'center' }}>
                  {player.name}
                </h4>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleDecrement(player._id)}
                    className="btn btn-outline"
                    style={{ fontSize: '1.25rem', padding: '0.5rem 1rem', minWidth: '50px' }}
                    disabled={!team.allowAddingTrees || player.count === 0 || actionLoading === `dec-${player._id}`}
                  >
                    -
                  </button>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)', lineHeight: 1, margin: 0 }}>
                      {player.count}
                    </p>
                  </div>
                  <button
                    onClick={() => handleIncrement(player._id)}
                    className="btn btn-primary"
                    style={{ fontSize: '1.25rem', padding: '0.5rem 1rem', minWidth: '50px' }}
                    disabled={!team.allowAddingTrees || actionLoading === `inc-${player._id}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team Management - Collapsible - Now at Bottom */}
      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-outline btn-full"
        >
          Manage Team
        </button>
      ) : (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Team Management</h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewPlayerName('');
                setEditingPlayerId(null);
                setEditingPlayerName('');
              }}
              className="btn btn-outline"
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              Done
            </button>
          </div>

          {/* Add New Member */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Add New Member</h4>
            <form onSubmit={handleAddPlayer} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="input"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Enter player name"
                disabled={actionLoading === 'add'}
                style={{ flex: 1 }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={actionLoading === 'add' || !newPlayerName.trim()}
              >
                {actionLoading === 'add' ? 'Adding...' : 'Add'}
              </button>
            </form>
          </div>

          {/* Existing Members List */}
          {team.players.length > 0 && (
            <div>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Current Members</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {team.players.map((player) => (
                  <div
                    key={player._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      backgroundColor: 'var(--color-bg)',
                      borderRadius: '8px'
                    }}
                  >
                    {editingPlayerId === player._id ? (
                      <>
                        <input
                          type="text"
                          className="input"
                          value={editingPlayerName}
                          onChange={(e) => setEditingPlayerName(e.target.value)}
                          style={{ flex: 1, margin: 0 }}
                          autoFocus
                        />
                        <button
                          onClick={() => handleEditPlayer(player._id)}
                          className="btn btn-primary"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                          disabled={actionLoading === `edit-${player._id}`}
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="btn btn-outline"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                          disabled={actionLoading === `edit-${player._id}`}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <span style={{ flex: 1, fontWeight: '500' }}>
                          {player.name} ({player.count} trees)
                        </span>
                        <button
                          onClick={() => startEdit(player)}
                          className="btn btn-outline"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                          disabled={actionLoading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePlayer(player._id)}
                          className="btn btn-secondary"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                          disabled={actionLoading === `delete-${player._id}`}
                        >
                          {actionLoading === `delete-${player._id}` ? '...' : 'Delete'}
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
