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

// Valor para un <input type="date"> (AAAA-MM-DD)
export function toInputDate(value) {
  return value ? String(value).slice(0, 10) : ''
}
