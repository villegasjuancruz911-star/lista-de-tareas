import TodoItem from './TodoItem'
import { IconPlus } from './Icons'

function TodoList({ todos, loading, hasAny, onToggle, onEdit, onDelete, onCreate }) {
  if (loading) {
    return (
      <div className="todo-list">
        {[1, 2, 3].map((n) => (
          <div key={n} className="todo-card skeleton" />
        ))}
      </div>
    )
  }

  if (todos.length === 0) {
    return (
      <div className="empty glass-soft">
        <div className="empty-orb" />
        {hasAny ? (
          <>
            <h3>No hay tareas con estos filtros</h3>
            <p className="muted small">Prueba cambiando el estado o la prioridad.</p>
          </>
        ) : (
          <>
            <h3>Todavía no tienes tareas</h3>
            <p className="muted small">Crea la primera y empieza a organizar tu semana.</p>
            <button className="btn btn-primary" onClick={onCreate}>
              <IconPlus /> Crear tarea
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

export default TodoList
