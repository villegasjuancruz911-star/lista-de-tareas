import { useState } from 'react'
import { dueInfo, formatDate } from '../utils'
import { IconCheck, IconEdit, IconTrash, IconClock, IconFlag } from './Icons'

function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  // Primer clic en borrar pide confirmación, el segundo borra
  const [confirming, setConfirming] = useState(false)

  const due = dueInfo(todo)
  const destacada = todo.Prioridad === 'Alta' && !todo.completada

  const classes = [
    'todo-card',
    destacada ? 'featured' : '',
    todo.completada ? 'done' : '',
  ].join(' ')

  return (
    <li className={classes}>
      <button
        className={`check ${todo.completada ? 'checked' : ''}`}
        onClick={() => onToggle(todo)}
        aria-label={todo.completada ? 'Marcar como pendiente' : 'Marcar como completada'}
        title={todo.completada ? 'Marcar como pendiente' : 'Marcar como completada'}
      >
        <IconCheck />
      </button>

      <div className="todo-body">
        <div className="todo-meta">
          <span className={`due due-${due.tone}`}>
            <span className="due-dot" /> {todo.completada ? 'Completada' : due.label}
          </span>
        </div>

        <h3 className="todo-title">{todo.titulo}</h3>
        {todo.descripcion && <p className="todo-desc">{todo.descripcion}</p>}

        <div className="todo-footer">
          <span className={`prio prio-${(todo.Prioridad || '').toLowerCase()}`}>
            <IconFlag /> {todo.Prioridad}
          </span>
          {todo.creacion && (
            <span className="created">
              <IconClock /> Creada {formatDate(todo.creacion)}
            </span>
          )}
        </div>
      </div>

      <div className="todo-actions">
        {confirming ? (
          <>
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(todo)}>
              Borrar
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setConfirming(false)}>
              No
            </button>
          </>
        ) : (
          <>
            <button className="icon-btn" onClick={() => onEdit(todo)} aria-label="Editar tarea" title="Editar">
              <IconEdit />
            </button>
            <button className="icon-btn" onClick={() => setConfirming(true)} aria-label="Eliminar tarea" title="Eliminar">
              <IconTrash />
            </button>
          </>
        )}
      </div>
    </li>
  )
}

export default TodoItem
