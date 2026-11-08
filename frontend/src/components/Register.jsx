import { useState } from 'react'
import { api } from '../api'
import AuthLayout from './AuthLayout'

function Register({ onRegistered, onGoToLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      const data = await api.register(email.trim(), password)
      onRegistered(
        data.needsEmailConfirmation
          ? 'Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.'
          : 'Cuenta creada. Ya puedes iniciar sesión.',
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Crear cuenta" subtitle="Regístrate para empezar a organizar tus tareas.">
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Correo electrónico</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            autoComplete="email"
            required
          />
        </label>

        <label className="field">
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            required
          />
        </label>

        <label className="field">
          <span>Repetir contraseña</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            required
          />
        </label>

        {error && <p className="alert alert-error">{error}</p>}

        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>

        <p className="switch">
          ¿Ya tienes cuenta?{' '}
          <button type="button" className="link" onClick={onGoToLogin}>
            Iniciar sesión
          </button>
        </p>
      </form>
    </AuthLayout>
  )
}

export default Register
