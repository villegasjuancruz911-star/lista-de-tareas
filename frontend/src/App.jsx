import { useCallback, useState } from 'react'
import './App.css'
import { loadSession, saveSession } from './api'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'

function App() {
  // La sesión guarda el token y el usuario que devuelve /api/auth/login
  const [session, setSession] = useState(() => loadSession())
  const [view, setView] = useState('login') // 'login' o 'register'
  const [notice, setNotice] = useState('')

  function handleLogin(newSession) {
    saveSession(newSession)
    setSession(newSession)
    setNotice('')
  }

  // useCallback para que la función no cambie en cada render (el Dashboard la usa en un useEffect)
  const handleLogout = useCallback(() => {
    saveSession(null)
    setSession(null)
    setView('login')
  }, [])

  function handleRegistered(message) {
    setNotice(message)
    setView('login')
  }

  if (session) {
    return <Dashboard session={session} onLogout={handleLogout} />
  }

  if (view === 'register') {
    return (
      <Register
        onRegistered={handleRegistered}
        onGoToLogin={() => setView('login')}
      />
    )
  }

  return (
    <Login
      notice={notice}
      onLogin={handleLogin}
      onGoToRegister={() => {
        setNotice('')
        setView('register')
      }}
    />
  )
}

export default App
