import { Logo, IconCheckCircle } from './Icons'

// Marco común para las pantallas de Login y Register
function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="auth">
      <section className="auth-card glass">
        <div className="auth-intro">
          <div className="brand">
            <Logo />
            <span>Mis Tareas</span>
          </div>
          <h1 className="hero-title">
            Haz las cosas <span className="gradient-text">simples</span>
          </h1>
          <p className="muted">
            Organiza tus pendientes, ponles prioridad y fecha, y marca lo que ya terminaste.
          </p>
          <ul className="auth-points">
            <li><IconCheckCircle /> Tus tareas son privadas</li>
            <li><IconCheckCircle /> Prioridad Alta, Media o Baja</li>
            <li><IconCheckCircle /> Filtra por estado y prioridad</li>
          </ul>
        </div>

        <div className="auth-form-wrap">
          <h2>{title}</h2>
          <p className="muted small">{subtitle}</p>
          {children}
        </div>
      </section>
    </main>
  )
}

export default AuthLayout
