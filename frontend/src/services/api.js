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
export const register = async (teamName, password) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamName, password })
  });

  return handleResponse(response);
};

export const login = async (teamName, password) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamName, password })
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
