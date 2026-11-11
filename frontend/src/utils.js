// Funciones de ayuda para fechas y prioridades

export const PRIORIDADES = ['Alta', 'Media', 'Baja']

// Convierte "2026-11-08" o una fecha completa en un objeto Date (en hora local)
function toDate(value) {
  if (!value) return null
  const d = value.length === 10 ? new Date(`${value}T00:00:00`) : new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function formatDate(value) {
  const d = toDate(value)
  if (!d) return ''
  return d.toLocaleDateString('es', { day: 'numeric', month: 'short' })
}

// Devuelve cuántos días faltan para el vencimiento (negativo = vencida)
export function daysUntil(value) {
  const d = toDate(value)
  if (!d) return null
  const diff = startOfDay(d) - startOfDay(new Date())
  return Math.round(diff / 86400000)
}

// Texto y tipo para mostrar el vencimiento de una tarea
export function dueInfo(todo) {
  const days = daysUntil(todo.vencimiento)
  if (days === null) return { label: 'Sin fecha', tone: 'none' }
  if (todo.completada) return { label: formatDate(todo.vencimiento), tone: 'none' }
  if (days < 0) return { label: `Vencida · ${formatDate(todo.vencimiento)}`, tone: 'late' }
  if (days === 0) return { label: 'Vence hoy', tone: 'today' }
  if (days === 1) return { label: 'Vence mañana', tone: 'soon' }
  return { label: `Vence ${formatDate(todo.vencimiento)}`, tone: 'none' }
}

// Traduce al español los mensajes de error más comunes de Supabase Auth
const ERRORES_AUTH = {
  'invalid login credentials': 'Correo o contraseña incorrectos',
  'email not confirmed': 'Todavía no confirmaste tu correo. Revisa tu bandeja de entrada.',
  'email rate limit exceeded':
    'Se enviaron demasiados correos de confirmación. Espera un rato (aprox. 1 hora) e intenta de nuevo.',
  'user already registered': 'Ya existe una cuenta con ese correo. Inicia sesión.',
  'password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres',
  'unable to validate email address: invalid format': 'El correo no tiene un formato válido',
}

export function traducirError(mensaje) {
  const clave = String(mensaje || '').toLowerCase().replace(/\.$/, '')
  if (ERRORES_AUTH[clave]) return ERRORES_AUTH[clave]
  if (clave.startsWith('for security purposes')) {
    return 'Por seguridad, espera unos segundos antes de intentarlo de nuevo.'
  }
  return mensaje
}

// Valor para un <input type="date"> (AAAA-MM-DD)
export function toInputDate(value) {
  return value ? String(value).slice(0, 10) : ''
}
