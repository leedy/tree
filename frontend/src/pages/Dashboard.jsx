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

  useEffect(() => {
    loadTeam();
  }, []);

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
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Team Header */}
      <div className="card">
        <h2 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
          {team.teamName}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
              Season {team.season}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
              {team.totalCount}
            </p>
            <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
              Total Trees Spotted
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="card" style={{ backgroundColor: '#FEE2E2', color: 'var(--color-error)' }}>
          {error}
        </div>
      )}

      {/* Team Management - Collapsible */}
      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-outline btn-full"
          style={{ marginBottom: '1rem' }}
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

      {/* Players List - Score Tracking */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Team Members ({team.players.length})</h3>

        {team.players.length === 0 ? (
          <p style={{ color: 'var(--color-text-light)', textAlign: 'center', padding: '2rem 0' }}>
            No team members yet. Click "Manage Team" to get started!
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {team.players.map((player) => (
              <div
                key={player._id}
                className="card"
                style={{ padding: '0.75rem', backgroundColor: 'var(--color-bg)' }}
              >
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', textAlign: 'center' }}>
                  {player.name}
                </h4>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleDecrement(player._id)}
                    className="btn btn-outline"
                    style={{ fontSize: '1.25rem', padding: '0.5rem 1rem', minWidth: '50px' }}
                    disabled={player.count === 0 || actionLoading === `dec-${player._id}`}
                  >
                    -
                  </button>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)', lineHeight: 1 }}>
                      {player.count}
                    </p>
                  </div>
                  <button
                    onClick={() => handleIncrement(player._id)}
                    className="btn btn-primary"
                    style={{ fontSize: '1.25rem', padding: '0.5rem 1rem', minWidth: '50px' }}
                    disabled={actionLoading === `inc-${player._id}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
