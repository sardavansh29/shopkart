import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const login = async (event) => {
    event.preventDefault()

    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    try {
      await api('/customers/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      navigate('/home')
    } catch {
      setError('Invalid Credentials')
    }
  }

  return (
    <section className="auth-card">
      <h2>Login</h2>
      {error && <p className="notice error">{error}</p>}
      <form onSubmit={login}>
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email" />
        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" />
        <button>Login</button>
      </form>
      <p className="switch-page">New customer? <Link to="/register">Register</Link></p>
    </section>
  )
}

export default Login
