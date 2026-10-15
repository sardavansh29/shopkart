import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'

function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    api(`/orders/${id}`).then((data) => setOrder(data.order)).catch(() => setOrder(null))
  }, [id])

  if (!order) return <p>Loading order...</p>

  return (
    <section>
      <h2>Order #{order._id}</h2>
      {order.items.map((item) => <p key={item._id}>{item.name} × {item.quantity} — ₹{item.price * item.quantity}</p>)}
      <p>Total: ₹{order.totalAmount}</p>
      <p>Payment: {order.paymentStatus}</p>
      <p>Status: {order.status}</p>
    </section>
  )
}

export default OrderDetails
