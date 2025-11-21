const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new APIError(data.message || 'An error occurred', response.status);
  }

  return data;
};

// Auth API
export const register = async (teamName, email, password) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamName, email, password })
  });

  return handleResponse(response);
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  return handleResponse(response);
};

// Team API
export const getTeam = async () => {
  const response = await fetch(`${API_URL}/api/teams/me`, {
    headers: getAuthHeader()
  });

  return handleResponse(response);
};

export const addPlayer = async (name) => {
  const response = await fetch(`${API_URL}/api/teams/players`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ name })
  });

  return handleResponse(response);
};

export const updatePlayer = async (playerId, name) => {
  const response = await fetch(`${API_URL}/api/teams/players/${playerId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ name })
  });

  return handleResponse(response);
};

export const deletePlayer = async (playerId) => {
  const response = await fetch(`${API_URL}/api/teams/players/${playerId}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });

  return handleResponse(response);
};

export const incrementPlayerCount = async (playerId, amount = 1) => {
  const response = await fetch(`${API_URL}/api/teams/players/${playerId}/increment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ amount })
  });

  return handleResponse(response);
};

export const decrementPlayerCount = async (playerId, amount = 1) => {
  const response = await fetch(`${API_URL}/api/teams/players/${playerId}/decrement`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ amount })
  });

  return handleResponse(response);
};

// Leaderboard API
export const getTeamLeaderboard = async (season = null) => {
  const url = season
    ? `${API_URL}/api/leaderboards/teams?season=${season}`
    : `${API_URL}/api/leaderboards/teams`;

  const response = await fetch(url);
  return handleResponse(response);
};

export const getPlayerLeaderboard = async (season = null) => {
  const url = season
    ? `${API_URL}/api/leaderboards/players?season=${season}`
    : `${API_URL}/api/leaderboards/players`;

  const response = await fetch(url);
  return handleResponse(response);
};

export const getSeasons = async () => {
  const response = await fetch(`${API_URL}/api/leaderboards/seasons`);
  return handleResponse(response);
};

// Activities API
export const getRecentActivities = async (limit = 20) => {
  const response = await fetch(`${API_URL}/api/activities/recent?limit=${limit}`);
  return handleResponse(response);
};

// Contact API
export const sendContactMessage = async (name, email, message) => {
  const response = await fetch(`${API_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message })
  });

  return handleResponse(response);
};

// Auth helpers
export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};

// Admin Auth API
export const adminLogin = async (username, password) => {
  const response = await fetch(`${API_URL}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  return handleResponse(response);
};

export const saveAdminToken = (token) => {
  localStorage.setItem('adminToken', token);
};

export const removeAdminToken = () => {
  localStorage.removeItem('adminToken');
};

export const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

export const isAdminAuthenticated = () => {
  return !!getAdminToken();
};

const getAdminAuthHeader = () => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Admin Teams API
export const adminGetAllTeams = async () => {
  const response = await fetch(`${API_URL}/api/admin/teams`, {
    headers: getAdminAuthHeader()
  });
  return handleResponse(response);
};

export const adminGetTeam = async (teamId) => {
  const response = await fetch(`${API_URL}/api/admin/teams/${teamId}`, {
    headers: getAdminAuthHeader()
  });
  return handleResponse(response);
};

export const adminUpdateTeam = async (teamId, updates) => {
  const response = await fetch(`${API_URL}/api/admin/teams/${teamId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminAuthHeader()
    },
    body: JSON.stringify(updates)
  });
  return handleResponse(response);
};

export const adminDeleteTeam = async (teamId) => {
  const response = await fetch(`${API_URL}/api/admin/teams/${teamId}`, {
    method: 'DELETE',
    headers: getAdminAuthHeader()
  });
  return handleResponse(response);
};

export const adminDeletePlayer = async (teamId, playerId) => {
  const response = await fetch(`${API_URL}/api/admin/teams/${teamId}/players/${playerId}`, {
    method: 'DELETE',
    headers: getAdminAuthHeader()
  });
  return handleResponse(response);
};

// Admin Seasons API
export const adminGetAllSeasons = async () => {
  const response = await fetch(`${API_URL}/api/admin/seasons`, {
    headers: getAdminAuthHeader()
  });
  return handleResponse(response);
};

export const adminCreateSeason = async (seasonData) => {
  const response = await fetch(`${API_URL}/api/admin/seasons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminAuthHeader()
    },
    body: JSON.stringify(seasonData)
  });
  return handleResponse(response);
};

export const adminUpdateSeason = async (seasonId, updates) => {
  const response = await fetch(`${API_URL}/api/admin/seasons/${seasonId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminAuthHeader()
    },
    body: JSON.stringify(updates)
  });
  return handleResponse(response);
};

export const adminDeleteSeason = async (seasonId) => {
  const response = await fetch(`${API_URL}/api/admin/seasons/${seasonId}`, {
    method: 'DELETE',
    headers: getAdminAuthHeader()
  });
  return handleResponse(response);
};

// Admin Activities API
export const adminGetActivities = async (limit = 100, skip = 0) => {
  const response = await fetch(`${API_URL}/api/admin/activities?limit=${limit}&skip=${skip}`, {
    headers: getAdminAuthHeader()
  });
  return handleResponse(response);
};

export const adminDeleteActivity = async (activityId) => {
  const response = await fetch(`${API_URL}/api/admin/activities/${activityId}`, {
    method: 'DELETE',
    headers: getAdminAuthHeader()
  });
  return handleResponse(response);
};

export const adminGetDailyStats = async (seasonId = null) => {
  const url = seasonId
    ? `${API_URL}/api/admin/daily-stats?seasonId=${seasonId}`
    : `${API_URL}/api/admin/daily-stats`;
  const response = await fetch(url, {
    headers: getAdminAuthHeader()
  });
  return handleResponse(response);
};

// Admin Stats API
export const adminGetStats = async () => {
  const response = await fetch(`${API_URL}/api/admin/stats`, {
    headers: getAdminAuthHeader()
  });
  return handleResponse(response);
};
