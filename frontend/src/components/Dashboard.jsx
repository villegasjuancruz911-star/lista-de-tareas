import { useEffect, useState } from 'react'
import { api } from '../api'
import { PRIORIDADES } from '../utils'
import TodoList from './TodoList'
import TodoForm from './TodoForm'
import StatsPanel from './StatsPanel'
import {
  Logo, IconList, IconClock, IconCheckCircle, IconLogout, IconPlus, IconCalendar, IconHome,
} from './Icons'

const ESTADOS = [
  { value: 'todas', label: 'Todas', icon: IconList },
  { value: 'pendientes', label: 'Pendientes', icon: IconClock },
  { value: 'completadas', label: 'Completadas', icon: IconCheckCircle },
]

function Dashboard({ session, onLogout }) {
  const { token, user } = session

  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [estado, setEstado] = useState('todas')
  const [prioridad, setPrioridad] = useState('todas')

  // null = formulario cerrado, {} = tarea nueva, {id,...} = editar tarea
  const [editing, setEditing] = useState(null)

  // Si el token venció, volvemos al login
  function handleError(err) {
    if (err.status === 401) onLogout()
    else setError(err.message)
  }

  // Traer las tareas del backend al cargar la página
  useEffect(() => {
    api
      .getTodos(token)
      .then((data) => setTodos(data.todos || []))
      .catch((err) => {
        if (err.status === 401) onLogout()
        else setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [token, onLogout])

  async function handleSave(values) {
    if (editing && editing.id) {
      const data = await api.updateTodo(token, editing.id, values)
      setTodos((prev) => prev.map((t) => (t.id === editing.id ? data.todo : t)))
    } else {
      const data = await api.createTodo(token, values)
      setTodos((prev) => [data.todo, ...prev])
    }
    setEditing(null)
  }

  async function handleToggle(todo) {
    const completada = !todo.completada
    // Cambiamos la tarea en pantalla al instante y, si falla, la devolvemos
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? { ...t, completada } : t)))
    try {
      await api.updateTodo(token, todo.id, { completada })
    } catch (err) {
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? todo : t)))
      handleError(err)
    }
  }

  async function handleDelete(todo) {
    try {
      await api.deleteTodo(token, todo.id)
      setTodos((prev) => prev.filter((t) => t.id !== todo.id))
    } catch (err) {
      handleError(err)
    }
  }

  const counts = {
    todas: todos.length,
    pendientes: todos.filter((t) => !t.completada).length,
    completadas: todos.filter((t) => t.completada).length,
  }

  // Aplicar los filtros y mostrar primero las pendientes
  const visibles = todos
    .filter((t) => estado === 'todas' || (estado === 'completadas' ? t.completada : !t.completada))
    .filter((t) => prioridad === 'todas' || t.Prioridad === prioridad)
    .sort((a, b) => Number(a.completada) - Number(b.completada))

  const nombre = user?.email?.split('@')[0] || 'tú'
  const fecha = new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })
  const hoy = fecha.charAt(0).toUpperCase() + fecha.slice(1)

  return (
    <div className="shell glass">
      {/* ---------- Menú lateral ---------- */}
      <aside className="sidebar">
        <div className="brand">
          <Logo />
          <span>Mis Tareas</span>
        </div>

        <nav className="nav" aria-label="Filtrar por estado">
          {ESTADOS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              className={`nav-item ${estado === value ? 'active' : ''}`}
              onClick={() => setEstado(value)}
            >
              <span className="nav-icon"><Icon /></span>
              <span className="nav-label">{label}</span>
              <span className="nav-count">{counts[value]}</span>
            </button>
          ))}
        </nav>

        <button className="nav-item logout" onClick={onLogout}>
          <span className="nav-icon"><IconLogout /></span>
          <span className="nav-label">Cerrar sesión</span>
        </button>
      </aside>

      {/* ---------- Contenido principal ---------- */}
      <main className="main">
        <header className="topbar">
          <div className="crumbs">
            <span><IconHome /> Inicio</span>
            <span className="sep">/</span>
            <span>Panel</span>
            <span className="sep">/</span>
            <span className="date-chip"><IconCalendar /> {hoy}</span>
          </div>
          <div className="user-chip" title={user?.email}>
            <span className="user-email">{user?.email}</span>
            <span className="avatar">{nombre.charAt(0).toUpperCase()}</span>
          </div>
        </header>

        <section className="hero">
          <h1 className="hero-title">
            Hola, <span className="gradient-text">{nombre}</span>
          </h1>
          <p className="muted">
            Organiza y planifica tus tareas de forma simple. Tienes{' '}
            <strong>{counts.pendientes}</strong> {counts.pendientes === 1 ? 'pendiente' : 'pendientes'}.
          </p>
        </section>

        <div className="toolbar">
          <div className="filters">
            <label className="pill-select">
              <span className={`dot dot-${estado}`} />
              <select value={estado} onChange={(e) => setEstado(e.target.value)} aria-label="Estado">
                {ESTADOS.map((e) => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
            </label>

            <label className="pill-select">
              <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)} aria-label="Prioridad">
                <option value="todas">Toda prioridad</option>
                {PRIORIDADES.map((p) => (
                  <option key={p} value={p}>Prioridad {p.toLowerCase()}</option>
                ))}
              </select>
            </label>
          </div>

          <button className="btn btn-primary btn-glow" onClick={() => setEditing({})}>
            <IconPlus /> Nueva tarea
          </button>
        </div>

        {error && (
          <p className="alert alert-error" role="alert">
            {error}{' '}
            <button className="link" onClick={() => setError('')}>Cerrar</button>
          </p>
        )}

        <TodoList
          todos={visibles}
          loading={loading}
          hasAny={todos.length > 0}
          onToggle={handleToggle}
          onEdit={(todo) => setEditing(todo)}
          onDelete={handleDelete}
          onCreate={() => setEditing({})}
        />
      </main>

      {/* ---------- Panel derecho con el resumen ---------- */}
      <StatsPanel todos={todos} />

      {editing && (
        <TodoForm
          todo={editing.id ? editing : null}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}

export default Dashboard
