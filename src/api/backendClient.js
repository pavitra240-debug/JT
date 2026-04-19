async function apiFetch(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : null;

  if (!res.ok) {
    const err = new Error(data?.error || 'request_failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const publicApi = {
  homeData: () => apiFetch('/api/public/home-data'),
  createBooking: (payload) => apiFetch('/api/public/bookings', { method: 'POST', body: payload }),
  createMessage: (payload) => apiFetch('/api/public/messages', { method: 'POST', body: payload }),
};

export const adminAuthApi = {
  login: ({ email, password }) => apiFetch('/api/secret-admin/login', { method: 'POST', body: { email, password } }),
  logout: () => apiFetch('/api/secret-admin/logout', { method: 'POST' }),
  me: () => apiFetch('/api/secret-admin/me'),
};

export const adminApi = {
  cars: {
    list: () => apiFetch('/api/secret-admin/cars'),
    create: (payload) => apiFetch('/api/secret-admin/cars', { method: 'POST', body: payload }),
    update: (id, payload) => apiFetch(`/api/secret-admin/cars/${id}`, { method: 'PUT', body: payload }),
    remove: (id) => apiFetch(`/api/secret-admin/cars/${id}`, { method: 'DELETE' }),
  },
  buses: {
    list: () => apiFetch('/api/secret-admin/buses'),
    create: (payload) => apiFetch('/api/secret-admin/buses', { method: 'POST', body: payload }),
    update: (id, payload) => apiFetch(`/api/secret-admin/buses/${id}`, { method: 'PUT', body: payload }),
    remove: (id) => apiFetch(`/api/secret-admin/buses/${id}`, { method: 'DELETE' }),
  },
  packages: {
    list: () => apiFetch('/api/secret-admin/packages'),
    create: (payload) => apiFetch('/api/secret-admin/packages', { method: 'POST', body: payload }),
    update: (id, payload) => apiFetch(`/api/secret-admin/packages/${id}`, { method: 'PUT', body: payload }),
    remove: (id) => apiFetch(`/api/secret-admin/packages/${id}`, { method: 'DELETE' }),
  },
  bookings: {
    list: () => apiFetch('/api/secret-admin/bookings'),
    update: (id, payload) => apiFetch(`/api/secret-admin/bookings/${id}`, { method: 'PUT', body: payload }),
    remove: (id) => apiFetch(`/api/secret-admin/bookings/${id}`, { method: 'DELETE' }),
  },
  messages: {
    list: () => apiFetch('/api/secret-admin/messages'),
    remove: (id) => apiFetch(`/api/secret-admin/messages/${id}`, { method: 'DELETE' }),
  },
};

