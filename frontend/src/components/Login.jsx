import { useState } from 'react'
import { api } from '../api'
import { traducirError } from '../utils'
import AuthLayout from './AuthLayout'

function Login({ onLogin, onGoToRegister, notice }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.login(email.trim(), password)
      onLogin({ token: data.session.access_token, user: data.user })
    } catch (err) {
      setError(traducirError(err.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Iniciar sesión" subtitle="Bienvenido de nuevo, ingresa tus datos.">
      <form className="form" onSubmit={handleSubmit}>
        {notice && <p className="alert alert-ok">{notice}</p>}

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
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p className="alert alert-error">{error}</p>}

        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>

        <p className="switch">
          ¿No tienes cuenta?{' '}
          <button type="button" className="link" onClick={onGoToRegister}>
            Crear una cuenta
          </button>
        </p>
      </form>
    </AuthLayout>
  )
}

export default Login
