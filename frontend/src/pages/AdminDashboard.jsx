import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminGetStats,
  adminGetAllTeams,
  adminUpdateTeam,
  adminDeleteTeam,
  adminDeletePlayer,
  adminGetAllSeasons,
  adminCreateSeason,
  adminUpdateSeason,
  adminDeleteSeason,
  adminGetActivities,
  adminDeleteActivity,
  removeAdminToken
} from '../services/api';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Overview state
  const [stats, setStats] = useState(null);

  // Teams state
  const [teams, setTeams] = useState([]);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamFormData, setTeamFormData] = useState({ teamName: '', email: '' });

  // Seasons state
  const [seasons, setSeasons] = useState([]);
  const [editingSeason, setEditingSeason] = useState(null);
  const [creatingSeason, setCreatingSeason] = useState(false);
  const [seasonFormData, setSeasonFormData] = useState({
    year: new Date().getFullYear(),
    startDate: '',
    endDate: '',
    isActive: false
  });

  // Activities state
  const [activities, setActivities] = useState([]);
  const [activitiesTotal, setActivitiesTotal] = useState(0);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'overview') {
        const data = await adminGetStats();
        setStats(data.stats);
      } else if (activeTab === 'teams') {
        const data = await adminGetAllTeams();
        setTeams(data.teams);
      } else if (activeTab === 'seasons') {
        const data = await adminGetAllSeasons();
        setSeasons(data.seasons);
      } else if (activeTab === 'activities') {
        const data = await adminGetActivities(100, 0);
        setActivities(data.activities);
        setActivitiesTotal(data.total);
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeAdminToken();
    navigate('/admin/login');
  };

  // Team Management Functions
  const startEditTeam = (team) => {
    setEditingTeam(team.id);
    setTeamFormData({ teamName: team.teamName, email: team.email || '' });
  };

  const cancelEditTeam = () => {
    setEditingTeam(null);
    setTeamFormData({ teamName: '', email: '' });
  };

  const saveTeam = async (teamId) => {
    try {
      await adminUpdateTeam(teamId, teamFormData);
      setEditingTeam(null);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to update team');
    }
  };

  const deleteTeam = async (teamId, teamName) => {
    if (!confirm(`Delete team "${teamName}" and all associated data?`)) return;
    try {
      await adminDeleteTeam(teamId);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete team');
    }
  };

  // Season Management Functions
  const startCreateSeason = () => {
    setCreatingSeason(true);
    setSeasonFormData({
      year: new Date().getFullYear(),
      startDate: '',
      endDate: '',
      isActive: false
    });
  };

  const startEditSeason = (season) => {
    setEditingSeason(season._id);
    setSeasonFormData({
      year: season.year,
      startDate: season.startDate.split('T')[0],
      endDate: season.endDate.split('T')[0],
      isActive: season.isActive
    });
  };

  const cancelSeasonEdit = () => {
    setEditingSeason(null);
    setCreatingSeason(false);
    setSeasonFormData({ year: new Date().getFullYear(), startDate: '', endDate: '', isActive: false });
  };

  const saveSeason = async () => {
    try {
      if (creatingSeason) {
        await adminCreateSeason(seasonFormData);
      } else {
        await adminUpdateSeason(editingSeason, seasonFormData);
      }
      cancelSeasonEdit();
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to save season');
    }
  };

  const deleteSeason = async (seasonId, year) => {
    if (!confirm(`Delete season ${year}?`)) return;
    try {
      await adminDeleteSeason(seasonId);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete season');
    }
  };

  // Activity Management Functions
  const deleteActivity = async (activityId) => {
    if (!confirm('Delete this activity?')) return;
    try {
      await adminDeleteActivity(activityId);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete activity');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '1rem' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem 1rem' }}>
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: '2px solid var(--color-border)',
        flexWrap: 'wrap'
      }}>
        {['overview', 'teams', 'seasons', 'activities'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1rem',
              background: 'none',
              border: 'none',
              borderBottom: `3px solid ${activeTab === tab ? 'var(--color-primary)' : 'transparent'}`,
              color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-light)',
              fontWeight: activeTab === tab ? 600 : 400,
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="card">
                <h3 style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Total Teams</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{stats.totalTeams}</p>
              </div>
              <div className="card">
                <h3 style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Total Players</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{stats.totalPlayers}</p>
              </div>
              <div className="card">
                <h3 style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Total Trees</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-success)' }}>{stats.totalTrees}</p>
              </div>
              <div className="card">
                <h3 style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Activities</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{stats.totalActivities}</p>
              </div>
              {stats.activeSeason && (
                <div className="card" style={{ gridColumn: 'span 2' }}>
                  <h3 style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Active Season</h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.activeSeason.year}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                    {new Date(stats.activeSeason.startDate).toLocaleDateString()} - {new Date(stats.activeSeason.endDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Teams Tab */}
          {activeTab === 'teams' && (
            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Teams ({teams.length})</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Team Name</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Email</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center' }}>Players</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center' }}>Trees</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center' }}>Season</th>
                      <th style={{ padding: '0.5rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map(team => (
                      <tr key={team.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '0.5rem' }}>
                          {editingTeam === team.id ? (
                            <input
                              className="input"
                              value={teamFormData.teamName}
                              onChange={(e) => setTeamFormData({ ...teamFormData, teamName: e.target.value })}
                              style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                            />
                          ) : (
                            team.teamName
                          )}
                        </td>
                        <td style={{ padding: '0.5rem' }}>
                          {editingTeam === team.id ? (
                            <input
                              className="input"
                              type="email"
                              value={teamFormData.email}
                              onChange={(e) => setTeamFormData({ ...teamFormData, email: e.target.value })}
                              style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                            />
                          ) : (
                            team.email || <span style={{ color: 'var(--color-error)' }}>No email</span>
                          )}
                        </td>
                        <td style={{ padding: '0.5rem', textAlign: 'center' }}>{team.playerCount}</td>
                        <td style={{ padding: '0.5rem', textAlign: 'center' }}>{team.totalCount}</td>
                        <td style={{ padding: '0.5rem', textAlign: 'center' }}>{team.season}</td>
                        <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                          {editingTeam === team.id ? (
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => saveTeam(team.id)}
                                className="btn btn-primary"
                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditTeam}
                                className="btn"
                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => startEditTeam(team)}
                                className="btn"
                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteTeam(team.id, team.teamName)}
                                className="btn"
                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', background: 'var(--color-error)' }}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Seasons Tab */}
          {activeTab === 'seasons' && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Seasons ({seasons.length})</h3>
                {!creatingSeason && !editingSeason && (
                  <button onClick={startCreateSeason} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                    Create Season
                  </button>
                )}
              </div>

              {(creatingSeason || editingSeason) && (
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--color-bg)', borderRadius: '8px' }}>
                  <h4 style={{ marginBottom: '1rem' }}>{creatingSeason ? 'Create New Season' : 'Edit Season'}</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="label">Year</label>
                      <input
                        type="number"
                        className="input"
                        value={seasonFormData.year}
                        onChange={(e) => setSeasonFormData({ ...seasonFormData, year: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Start Date</label>
                      <input
                        type="date"
                        className="input"
                        value={seasonFormData.startDate}
                        onChange={(e) => setSeasonFormData({ ...seasonFormData, startDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">End Date</label>
                      <input
                        type="date"
                        className="input"
                        value={seasonFormData.endDate}
                        onChange={(e) => setSeasonFormData({ ...seasonFormData, endDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={seasonFormData.isActive}
                          onChange={(e) => setSeasonFormData({ ...seasonFormData, isActive: e.target.checked })}
                        />
                        Active Season
                      </label>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button onClick={saveSeason} className="btn btn-primary">Save</button>
                    <button onClick={cancelSeasonEdit} className="btn">Cancel</button>
                  </div>
                </div>
              )}

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Year</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>Start Date</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left' }}>End Date</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center' }}>Active</th>
                      <th style={{ padding: '0.5rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seasons.map(season => (
                      <tr key={season._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '0.5rem' }}>{season.year}</td>
                        <td style={{ padding: '0.5rem' }}>{new Date(season.startDate).toLocaleDateString()}</td>
                        <td style={{ padding: '0.5rem' }}>{new Date(season.endDate).toLocaleDateString()}</td>
                        <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                          {season.isActive && <span style={{ color: 'var(--color-success)' }}>✓</span>}
                        </td>
                        <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => startEditSeason(season)}
                              className="btn"
                              style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteSeason(season._id, season.year)}
                              className="btn"
                              style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', background: 'var(--color-error)' }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Recent Activities ({activitiesTotal} total)</h3>
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {activities.map(activity => (
                  <div
                    key={activity._id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      borderBottom: '1px solid var(--color-border)',
                      fontSize: '0.875rem'
                    }}
                  >
                    <div>
                      <strong>{activity.team?.teamName}</strong>
                      <span style={{ color: 'var(--color-text-light)' }}> - {activity.playerName} </span>
                      <span>{activity.action === 'increment' ? 'added' : 'removed'} {activity.amount} tree(s)</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '0.25rem' }}>
                        {new Date(activity.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteActivity(activity._id)}
                      className="btn"
                      style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', background: 'var(--color-error)' }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
