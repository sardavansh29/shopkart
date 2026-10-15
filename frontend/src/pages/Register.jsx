import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  })
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const register = async (event) => {
    event.preventDefault()

    if (!form.fullName || !form.email || !form.password || !form.phone) {
      setError('All fields are required')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      await api('/customers/register', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      navigate('/login')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <section className="auth-card">
      <h2>Register</h2>
      {error && <p className="notice error">{error}</p>}
      <form onSubmit={register}>
        <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" />
        <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email" />
        <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Password" />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" />
        <button>Create Account</button>
      </form>
      <p className="switch-page">Already registered? <Link to="/login">Login</Link></p>
    </section>
  )
}

export default Register
