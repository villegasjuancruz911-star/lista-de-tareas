// Funciones para comunicarse con la API de Express.
// Las rutas empiezan con /api y Vite las redirige al backend (ver vite.config.js).

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor. ¿Está encendido el backend?')
  }

  let data = {}
  try {
    data = await res.json()
  } catch {
    // La respuesta no era JSON
  }

  if (!res.ok) {
    const error = new Error(data.message || 'Ocurrió un error inesperado')
    error.status = res.status
    throw error
  }
  return data
}

export const api = {
  register: (email, password) =>
    request('/auth/register', { method: 'POST', body: { email, password } }),

  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),

  getTodos: (token) => request('/todos', { token }),

  createTodo: (token, todo) =>
    request('/todos', { method: 'POST', body: todo, token }),

  updateTodo: (token, id, changes) =>
    request(`/todos/${id}`, { method: 'PUT', body: changes, token }),

  deleteTodo: (token, id) =>
    request(`/todos/${id}`, { method: 'DELETE', token }),
}

// Guardar la sesión en el navegador para no tener que loguearse cada vez
const SESSION_KEY = 'mis-tareas-session'

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveSession(session) {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    else localStorage.removeItem(SESSION_KEY)
  } catch {
    // Si el navegador bloquea localStorage, la sesión solo dura mientras la página esté abierta
  }
}
