import { useEffect, useState } from 'react'
import { PRIORIDADES, toInputDate } from '../utils'
import { IconClose } from './Icons'

// Formulario para crear (todo = null) o editar una tarea
function TodoForm({ todo, onSave, onClose }) {
  const [titulo, setTitulo] = useState(todo?.titulo || '')
  const [descripcion, setDescripcion] = useState(todo?.descripcion || '')
  const [vencimiento, setVencimiento] = useState(toInputDate(todo?.vencimiento))
  const [prioridad, setPrioridad] = useState(todo?.Prioridad || 'Media')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // Cerrar con la tecla Escape
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!titulo.trim()) {
      setError('El título es obligatorio')
      return
    }
    setError('')
    setSaving(true)
    try {
      await onSave({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        Prioridad: prioridad,
        vencimiento: vencimiento || null,
      })
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal glass" onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-labelledby="form-title">
        <header className="modal-head">
          <h2 id="form-title">{todo ? 'Editar tarea' : 'Nueva tarea'}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar">
            <IconClose />
          </button>
        </header>

        <label className="field">
          <span>Título</span>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: Estudiar para el parcial"
            maxLength={120}
            autoFocus
          />
        </label>

        <label className="field">
          <span>Descripción <em>(opcional)</em></span>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Agrega detalles de la tarea…"
            rows={3}
          />
        </label>

        <div className="field-row">
          <label className="field">
            <span>Fecha de vencimiento</span>
            <input type="date" value={vencimiento} onChange={(e) => setVencimiento(e.target.value)} />
          </label>

          <fieldset className="field">
            <span>Prioridad</span>
            <div className="segmented">
              {PRIORIDADES.map((p) => (
                <button
                  type="button"
                  key={p}
                  className={`seg seg-${p.toLowerCase()} ${prioridad === p ? 'active' : ''}`}
                  onClick={() => setPrioridad(p)}
                  aria-pressed={prioridad === p}
                >
                  {p}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {error && <p className="alert alert-error">{error}</p>}

        <footer className="modal-foot">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" disabled={saving}>
            {saving ? 'Guardando…' : todo ? 'Guardar cambios' : 'Crear tarea'}
          </button>
        </footer>
      </form>
    </div>
  )
}

export default TodoForm
