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
  adminGetDailyStats,
  adminGetAnalyticsOverview,
  adminGetPageStats,
  adminGetDailyAnalytics,
  removeAdminToken
} from '../services/api';
import Calendar from '../components/Calendar';

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
    isActive: false,
    allowAddingTrees: true
  });

  // Activities state
  const [activities, setActivities] = useState([]);
  const [activitiesTotal, setActivitiesTotal] = useState(0);

  // Calendar state
  const [dailyStats, setDailyStats] = useState([]);

  // Analytics state
  const [analyticsOverview, setAnalyticsOverview] = useState(null);
  const [pageStats, setPageStats] = useState([]);
  const [dailyAnalytics, setDailyAnalytics] = useState([]);

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
      } else if (activeTab === 'calendar') {
        const data = await adminGetDailyStats();
        setDailyStats(data.dailyStats);
      } else if (activeTab === 'analytics') {
        const [overview, pages, daily] = await Promise.all([
          adminGetAnalyticsOverview(),
          adminGetPageStats(),
          adminGetDailyAnalytics(30)
        ]);
        setAnalyticsOverview(overview.analytics);
        setPageStats(pages.pages);
        setDailyAnalytics(daily.dailyStats);
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
      isActive: false,
      allowAddingTrees: true
    });
  };

  const startEditSeason = (season) => {
    setEditingSeason(season._id);
    setSeasonFormData({
      year: season.year,
      startDate: season.startDate.split('T')[0],
      endDate: season.endDate.split('T')[0],
      isActive: season.isActive,
      allowAddingTrees: season.allowAddingTrees !== undefined ? season.allowAddingTrees : true
    });
  };

  const cancelSeasonEdit = () => {
    setEditingSeason(null);
    setCreatingSeason(false);
    setSeasonFormData({ year: new Date().getFullYear(), startDate: '', endDate: '', isActive: false, allowAddingTrees: true });
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
        {['overview', 'calendar', 'analytics', 'teams', 'seasons', 'activities'].map(tab => (
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{stats.activeSeason.year}</p>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0 }}>
                        {new Date(stats.activeSeason.startDate).toLocaleDateString()} - {new Date(stats.activeSeason.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', margin: '0 0 0.25rem 0' }}>Tree Tracking</p>
                      <p style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: stats.activeSeason.allowAddingTrees ? 'var(--color-success)' : 'var(--color-error)',
                        margin: 0
                      }}>
                        {stats.activeSeason.allowAddingTrees ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
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
                    <div className="form-group">
                      <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={seasonFormData.allowAddingTrees}
                          onChange={(e) => setSeasonFormData({ ...seasonFormData, allowAddingTrees: e.target.checked })}
                        />
                        Allow Adding Trees
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
                      <th style={{ padding: '0.5rem', textAlign: 'center' }}>Trees Enabled</th>
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
                        <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                          {season.allowAddingTrees ? (
                            <span style={{ color: 'var(--color-success)' }}>✓</span>
                          ) : (
                            <span style={{ color: 'var(--color-error)' }}>✗</span>
                          )}
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
                      <strong>{activity.teamName}</strong>
                      <span style={{ color: 'var(--color-text-light)' }}> - {activity.playerName} </span>
                      <span>{activity.action === 'increment' ? 'added' : 'removed'} {activity.amount} tree(s)</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '0.25rem' }}>
                        {new Date(activity.createdAt).toLocaleString()}
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

          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <div className="card">
              <Calendar dailyStats={dailyStats} year={2025} />
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Site Analytics</h3>
                <button
                  onClick={loadData}
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1rem' }}
                  disabled={loading}
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>

              {analyticsOverview && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Overview</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="card">
                      <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Total Views</h4>
                      <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)', margin: 0 }}>
                        {analyticsOverview.totalViews}
                      </p>
                    </div>
                    <div className="card">
                      <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Unique Visitors</h4>
                      <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)', margin: 0 }}>
                        {analyticsOverview.uniqueVisitors}
                      </p>
                    </div>
                    <div className="card">
                      <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Last 24 Hours</h4>
                      <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-success)', margin: 0 }}>
                        {analyticsOverview.viewsLast24h}
                      </p>
                    </div>
                    <div className="card">
                      <h4 style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>Last 7 Days</h4>
                      <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-success)', margin: 0 }}>
                        {analyticsOverview.viewsLast7Days}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Page Views by Path */}
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Page Views by Path</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Page</th>
                        <th style={{ padding: '0.5rem', textAlign: 'center' }}>Total Views</th>
                        <th style={{ padding: '0.5rem', textAlign: 'center' }}>Unique Visitors</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageStats.map((page, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '0.5rem' }}>{page.path}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center' }}>{page.views}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'center' }}>{page.uniqueVisitors}</td>
                        </tr>
                      ))}
                      {pageStats.length === 0 && (
                        <tr>
                          <td colSpan="3" style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                            No data yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Daily Analytics Chart */}
              <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Daily Views (Last 30 Days)</h3>
                {dailyAnalytics.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '200px', minWidth: '600px' }}>
                      {dailyAnalytics.map((day, index) => {
                        const maxViews = Math.max(...dailyAnalytics.map(d => d.views));
                        const height = maxViews > 0 ? (day.views / maxViews) * 180 : 0;
                        return (
                          <div
                            key={index}
                            style={{
                              flex: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'flex-end'
                            }}
                          >
                            <div
                              style={{
                                width: '100%',
                                height: `${height}px`,
                                background: 'var(--color-primary)',
                                borderRadius: '4px 4px 0 0',
                                position: 'relative',
                                cursor: 'pointer'
                              }}
                              title={`${new Date(day.date).toLocaleDateString()}: ${day.views} views, ${day.uniqueVisitors} unique`}
                            />
                            <div style={{ fontSize: '0.65rem', marginTop: '4px', color: 'var(--color-text-light)', transform: 'rotate(-45deg)', transformOrigin: 'top left', whiteSpace: 'nowrap' }}>
                              {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', color: 'var(--color-text-light)', padding: '2rem' }}>
                    No data yet
                  </p>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
