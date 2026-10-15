import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOrders = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true)
      setError('')
    }

    try {
      const data = await api('/orders')
      setOrders(data.orders)
    } catch {
      setError('Unable to load orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    api('/orders')
      .then((data) => setOrders(data.orders))
      .catch(() => setError('Unable to load orders.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading orders...</p>
  if (error) return <section><p className="notice error">{error}</p><button onClick={loadOrders}>Try Again</button></section>
  if (orders.length === 0) return <section><h2>You have not placed any orders yet.</h2><Link className="button-link" to="/products">Start Shopping</Link></section>

  return (
    <section>
      <h2>My Orders</h2>
      {orders.map((order) => (
        <article className="order-card" key={order._id}>
          <h3>Order #{order._id}</h3>
          <p>{new Date(order.createdAt).toLocaleDateString()}</p>
          {order.items.map((item) => <p key={item._id}>{item.name} × {item.quantity}</p>)}
          <p>Total: ₹{order.totalAmount}</p>
          <p>Status: {order.status}</p>
          <Link className="button-link" to={`/orders/${order._id}`}>View Details</Link>
        </article>
      ))}
    </section>
  )
}

export default Orders
