import { Link } from 'react-router-dom'
import useCart from '../hooks/useCart'

function Cart() {
  const { cart, loading, error, refreshCart, removeFromCart, setQuantity } = useCart()
  const items = cart.filter((item) => item.product)
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0)

  if (loading) return <p>Loading your cart...</p>
  if (error) return <section><p className="notice error">Unable to load your cart.</p><button onClick={refreshCart}>Try Again</button></section>

  if (items.length === 0) {
    return <section><h2>Your cart is empty 🛒</h2><p>Looks like you haven't added anything yet.</p><Link className="button-link" to="/products">Browse Products</Link></section>
  }

  return (
    <section>
      <h2>My Cart</h2>
      {items.map((item) => (
        <article className="cart-item" key={item.product._id}>
          <img src={item.product.image} alt={item.product.name} />
          <div>
            <h3>{item.product.name}</h3>
            <p>₹{item.product.price}</p>
            <button disabled={item.quantity === 1} onClick={() => setQuantity(item.product._id, item.quantity - 1)}>-</button>
            <span>{item.quantity}</span>
            <button disabled={item.quantity === item.product.stock} onClick={() => setQuantity(item.product._id, item.quantity + 1)}>+</button>
            <button onClick={() => removeFromCart(item.product._id)}>Remove</button>
          </div>
          <strong>₹{item.product.price * item.quantity}</strong>
        </article>
      ))}
      <section className="summary">
        <h3>Order Summary</h3>
        <p>Items: {totalItems}</p>
        <p>Subtotal: ₹{subtotal}</p>
        <Link className="button-link" to="/checkout">Proceed to Checkout</Link>
      </section>
    </section>
  )
}

export default Cart
