import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../services/api'

function OrderSuccess() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    api(`/orders/${id}`).then((data) => setOrder(data.order)).catch(() => setOrder(null))
  }, [id])

  if (!order) return <p>Loading order...</p>

  return (
    <section className="success-card">
      <h2>Order Placed Successfully</h2>
      <p>Order ID: {order._id}</p>
      <p>Total: ₹{order.totalAmount}</p>
      <p>Status: {order.status}</p>
      <Link className="button-link" to="/orders">View My Orders</Link>
      <Link className="button-link" to="/products">Continue Shopping</Link>
    </section>
  )
}

export default OrderSuccess
