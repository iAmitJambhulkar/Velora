const API_BASE = 'http://localhost:5000/api';

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('velora_token');
  }
  return null;
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('velora_token');
      localStorage.removeItem('velora_user');
      window.location.href = '/login';
    }
    throw new Error('Session expired. Please log in again.');
  }

  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    if (!response.ok) {
      throw new Error(text || `Request failed with status ${response.status}`);
    }
    return text;
  }

  if (!response.ok) {
    throw new Error(json.message || 'API request failed');
  }

  return json;
};
