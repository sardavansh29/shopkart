import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useCart from '../hooks/useCart'
import api from '../services/api'

const loadRazorpay = () => new Promise((resolve) => {
  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.onload = () => resolve(true)
  script.onerror = () => resolve(false)
  document.body.appendChild(script)
})

function Checkout() {
  const navigate = useNavigate()
  const { cart, clearCart } = useCart()
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const items = cart.filter((item) => item.product)
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const change = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const placeOrder = async (event) => {
    event.preventDefault()
    setError('')

    if (!items.length) {
      setError('Your cart is empty')
      return
    }

    if (Object.values(form).some((value) => !value.trim())) {
      setError('All shipping fields are required')
      return
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setError('Phone must contain 10 digits')
      return
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      setError('Pincode must contain 6 digits')
      return
    }

    setLoading(true)
    const loaded = await loadRazorpay()

    if (!loaded) {
      setError('Could not load Razorpay')
      setLoading(false)
      return
    }

    try {
      const data = await api('/orders/create-payment-order', {
        method: 'POST',
        body: JSON.stringify({ shippingAddress: form }),
      })

      const payment = new window.Razorpay({
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'ShopKart',
        description: 'ShopKart Order',
        order_id: data.razorpayOrderId,
        prefill: { name: form.fullName, contact: form.phone },
        modal: { ondismiss: () => setLoading(false) },
        handler: async (response) => {
          try {
            await api('/orders/verify-payment', {
              method: 'POST',
              body: JSON.stringify({
                shopKartOrderId: data.shopKartOrderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })
            clearCart()
            navigate(`/order-success/${data.shopKartOrderId}`)
          } catch (requestError) {
            setError(requestError.message)
            setLoading(false)
          }
        },
      })

      payment.on('payment.failed', () => {
        setError('Payment failed. Your cart was not cleared.')
        setLoading(false)
      })
      payment.open()
    } catch (requestError) {
      setError(requestError.message)
      setLoading(false)
    }
  }

  return (
    <section className="checkout">
      <div>
        <h2>Checkout</h2>
        {error && <p className="notice error">{error}</p>}
        <form onSubmit={placeOrder}>
          <input name="fullName" value={form.fullName} onChange={change} placeholder="Full Name" />
          <input name="phone" value={form.phone} onChange={change} placeholder="Phone Number" />
          <input name="addressLine1" value={form.addressLine1} onChange={change} placeholder="Address" />
          <input name="city" value={form.city} onChange={change} placeholder="City" />
          <input name="state" value={form.state} onChange={change} placeholder="State" />
          <input name="pincode" value={form.pincode} onChange={change} placeholder="Pincode" />
          <button disabled={loading}>{loading ? 'Opening Payment...' : 'Place Order'}</button>
        </form>
      </div>
      <section className="summary">
        <h3>Order Summary</h3>
        {items.map((item) => <p key={item.product._id}>{item.product.name} × {item.quantity} — ₹{item.product.price * item.quantity}</p>)}
        <strong>Total: ₹{total}</strong>
      </section>
    </section>
  )
}

export default Checkout
