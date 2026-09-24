const API_BASE = '/api';

export function getAuthToken() {
  return localStorage.getItem('cgu_erp_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('cgu_erp_token', token);
  } else {
    localStorage.removeItem('cgu_erp_token');
  }
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('cgu_erp_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem('cgu_erp_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('cgu_erp_user');
  }
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Server error occurred');
  }
  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),

  // Metadata
  getMeta: () => request('/meta'),

  // Timetable
  getTimetable: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/timetable${query ? `?${query}` : ''}`);
  },
  checkConflict: (candidate) => request('/timetable/conflict-check', { method: 'POST', body: JSON.stringify(candidate) }),
  createSlot: (slotData) => request('/timetable', { method: 'POST', body: JSON.stringify(slotData) }),
  updateSlot: (id, slotData) => request(`/timetable/${id}`, { method: 'PUT', body: JSON.stringify(slotData) }),
  deleteSlot: (id) => request(`/timetable/${id}`, { method: 'DELETE' }),

  // Teacher Attendance
  getTeacherAttendance: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/attendance/teachers${query ? `?${query}` : ''}`);
  },
  punchAttendance: (data) => request('/attendance/teachers/punch', { method: 'POST', body: JSON.stringify(data) }),

  // Lecture Key Notes / Logbook
  getNotes: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/notes${query ? `?${query}` : ''}`);
  },
  createNote: (noteData) => request('/notes', { method: 'POST', body: JSON.stringify(noteData) }),
  deleteNote: (id) => request(`/notes/${id}`, { method: 'DELETE' }),

  // Substitutions
  getSubstitutions: () => request('/substitutions'),
  requestSubstitution: (subData) => request('/substitutions/request', { method: 'POST', body: JSON.stringify(subData) }),
  updateSubstitutionStatus: (id, status) => request(`/substitutions/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Analytics & Announcements
  getVcOverview: () => request('/analytics/vc-overview'),
  getAnnouncements: () => request('/announcements'),
  createAnnouncement: (annData) => request('/announcements', { method: 'POST', body: JSON.stringify(annData) })
};
