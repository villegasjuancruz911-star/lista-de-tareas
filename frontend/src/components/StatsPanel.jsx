import { PRIORIDADES, daysUntil, dueInfo } from '../utils'

// Panel derecho: nota del día, progreso y tareas por prioridad
function StatsPanel({ todos }) {
  const total = todos.length
  const hechas = todos.filter((t) => t.completada).length
  const porcentaje = total ? Math.round((hechas / total) * 100) : 0

  const pendientes = todos.filter((t) => !t.completada)
  const vencidas = pendientes.filter((t) => daysUntil(t.vencimiento) < 0 && t.vencimiento).length
  const paraHoy = pendientes.filter((t) => daysUntil(t.vencimiento) === 0).length

  // Próximas 3 tareas pendientes con fecha, ordenadas por vencimiento
  const proximas = pendientes
    .filter((t) => t.vencimiento)
    .sort((a, b) => String(a.vencimiento).localeCompare(String(b.vencimiento)))
    .slice(0, 3)

  const porPrioridad = PRIORIDADES.map((p) => ({
    nombre: p,
    cantidad: pendientes.filter((t) => t.Prioridad === p).length,
  }))
  const max = Math.max(1, ...porPrioridad.map((p) => p.cantidad))

  let nota = 'No tienes pendientes. ¡Buen trabajo! 🎉'
  if (pendientes.length) {
    nota = paraHoy
      ? `Tienes ${paraHoy} ${paraHoy === 1 ? 'tarea que vence' : 'tareas que vencen'} hoy.`
      : 'Nada vence hoy. Buen momento para adelantar trabajo.'
    if (vencidas) nota += ` Ojo: ${vencidas} ${vencidas === 1 ? 'está vencida' : 'están vencidas'}.`
  }

  return (
    <aside className="side-panel">
      <section className="card card-note">
        <h2 className="card-title">Nota de hoy</h2>
        <p className="note-text">{nota}</p>
      </section>

      <section className="card">
        <div className="card-head">
          <h2 className="card-title">Progreso</h2>
          <span className="badge">{porcentaje}%</span>
        </div>
        <div className="progress" role="progressbar" aria-valuenow={porcentaje} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: `${porcentaje}%` }} />
        </div>
        <p className="muted small">
          {hechas} de {total} {total === 1 ? 'tarea completada' : 'tareas completadas'}
        </p>
      </section>

      <section className="card">
        <h2 className="card-title">Próximos vencimientos</h2>
        {proximas.length ? (
          <ul className="upcoming">
            {proximas.map((t) => {
              const due = dueInfo(t)
              return (
                <li key={t.id}>
                  <span className={`prio-bar prio-${t.Prioridad?.toLowerCase()}`} />
                  <span className="upcoming-title">{t.titulo}</span>
                  <span className={`due due-${due.tone} small`}>{due.label.replace('Vence ', '')}</span>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="muted small">No hay pendientes con fecha.</p>
        )}
      </section>

      <section className="card">
        <h2 className="card-title">Pendientes por prioridad</h2>
        <div className="bars">
          {porPrioridad.map((p) => (
            <div key={p.nombre} className="bar-col">
              <span className="bar-value">{p.cantidad}</span>
              <div className="bar-track">
                <div
                  className={`bar-fill prio-${p.nombre.toLowerCase()}`}
                  style={{ height: `${(p.cantidad / max) * 100}%` }}
                />
              </div>
              <span className="bar-label">{p.nombre}</span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  )
}

export default StatsPanel
