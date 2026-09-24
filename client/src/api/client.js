const API_BASE = '/api';

export function getAuthToken() {
  return localStorage.getItem('cgu_erp_token');
}

export function setAuthToken(token) {
  if (token) localStorage.setItem('cgu_erp_token', token);
  else localStorage.removeItem('cgu_erp_token');
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
  if (user) localStorage.setItem('cgu_erp_user', JSON.stringify(user));
  else localStorage.removeItem('cgu_erp_user');
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
    const err = new Error(data.message || data.error || 'Request failed');
    err.status = response.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),

  // Metadata (Courses, Branches, Years, Groups, Rooms, Faculty)
  getMeta: () => request('/meta'),

  // Admin Approval Queue
  getPendingUsers: () => request('/admin/pending-users'),
  approveUser: (id) => request(`/admin/approve-user/${id}`, { method: 'POST' }),
  rejectUser: (id) => request(`/admin/reject-user/${id}`, { method: 'POST' }),

  // Faculty Workload Engine
  getFacultyWorkload: () => request('/admin/faculty-workload'),

  // Available Free Faculty Finder for a specific slot
  getFreeFaculty: (day, slotId) => request(`/timetable/free-faculty?day=${encodeURIComponent(day)}&slotId=${encodeURIComponent(slotId)}`),

  // Timetable CRUD & Collision Handling
  getTimetable: (params = {}) => {
    const cleanParams = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== 'All') {
        cleanParams[k] = v;
      }
    }
    const query = new URLSearchParams(cleanParams).toString();
    return request(`/timetable${query ? `?${query}` : ''}`);
  },
  checkClash: (candidate) => request('/timetable/check-clash', { method: 'POST', body: JSON.stringify(candidate) }),
  createSlot: (slotData) => request('/timetable', { method: 'POST', body: JSON.stringify(slotData) }),
  updateSlot: (id, slotData) => request(`/timetable/${id}`, { method: 'PUT', body: JSON.stringify(slotData) }),
  deleteSlot: (id) => request(`/timetable/${id}`, { method: 'DELETE' }),

  // Semester Setup Case 1: Auto-generate routine for a branch/group
  autoGenerateRoutine: (course, branch, year, sectionId) => request('/timetable/auto-generate', {
    method: 'POST',
    body: JSON.stringify({ course, branch, year, sectionId })
  }),

  // Case 3: Reassign / Proxy Faculty on leave
  reassignFaculty: (slotId, newTeacherId, reason) => request(`/timetable/${slotId}/reassign`, {
    method: 'POST',
    body: JSON.stringify({ newTeacherId, reason })
  }),

  // Suspend or Switch to Online Mode
  setSlotMode: (slotId, mode, reason) => request(`/timetable/${slotId}/mode`, {
    method: 'POST',
    body: JSON.stringify({ mode, reason })
  }),

  // Campus Resource Occupancy Ledger
  getOccupancyLedger: () => request('/timetable/occupancy-ledger')
};
