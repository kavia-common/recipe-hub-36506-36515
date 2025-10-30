//
// Simple API client for the Recipe Hub frontend
//

// PUBLIC_INTERFACE
export const getApiBaseUrl = () => {
  /** Reads the API base URL from the environment. */
  const base = process.env.REACT_APP_API_BASE_URL || '';
  return base.replace(/\/+$/, '');
};

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = 'GET', headers = {}, body = undefined, auth = true } = {}) {
  /**
   * Generic API request that attaches token and handles 401 redirect.
   * - path: string path starting with / (e.g., /recipes)
   * - options: method, headers, body (object auto-jsonified), auth (boolean)
   * Returns: { ok, status, data } where data is parsed JSON or text on error
   */
  const base = getApiBaseUrl();
  const url = `${base}${path}`;
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (auth) {
    const token = localStorage.getItem('token');
    if (token) {
      finalHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const fetchOptions = {
    method,
    headers: finalHeaders,
  };

  if (body !== undefined) {
    fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (e) {
    return { ok: false, status: 0, data: { message: 'Network error', error: String(e) } };
  }

  if (response.status === 401) {
    // Unauthorized: clear token and redirect to login
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (e) {
      // ignore
    }
    if (typeof window !== 'undefined' && window.location && !window.location.pathname.startsWith('/login')) {
      window.location.href = '/login';
    }
  }

  let data;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    data = await response.text();
  }

  return { ok: response.ok, status: response.status, data };
}

// PUBLIC_INTERFACE
export const api = {
  /** Recipes endpoints */
  listRecipes: async ({ page = 1, limit = 12, search = '' } = {}) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (search) params.set('search', search);
    return apiRequest(`/recipes?${params.toString()}`, { method: 'GET', auth: false });
  },
  getRecipe: async (id) => apiRequest(`/recipes/${id}`, { method: 'GET', auth: false }),
  createRecipe: async (payload) => apiRequest('/recipes', { method: 'POST', body: payload, auth: true }),
  updateRecipe: async (id, payload) => apiRequest(`/recipes/${id}`, { method: 'PUT', body: payload, auth: true }),
  deleteRecipe: async (id) => apiRequest(`/recipes/${id}`, { method: 'DELETE', auth: true }),

  /** Auth endpoints */
  login: async (email, password) => apiRequest('/auth/login', { method: 'POST', auth: false, body: { email, password } }),
  register: async (name, email, password) => apiRequest('/auth/register', { method: 'POST', auth: false, body: { name, email, password } }),
};
