import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import useCart from '../hooks/useCart'
import api from '../services/api'

function ProtectedLayout() {
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const { refreshCart } = useCart()

  useEffect(() => {
    api('/customers/me')
      .then((data) => {
        setCustomer(data)
        refreshCart().catch(() => {})
      })
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false))
  }, [refreshCart])

  if (loading) {
    return <p>Loading...</p>
  }

  if (!customer) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <Navbar />
      <Outlet context={customer} />
    </>
  )
}

export default ProtectedLayout
