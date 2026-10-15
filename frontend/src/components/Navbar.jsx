import { Link, useNavigate } from 'react-router-dom'
import useCart from '../hooks/useCart'
import api from '../services/api'

function Navbar() {
  const navigate = useNavigate()
  const { cart, clearCart } = useCart()
  const count = cart.reduce((total, item) => total + item.quantity, 0)

  const logout = async () => {
    await api('/customers/logout', { method: 'POST' })
    clearCart()
    navigate('/login')
  }

  return (
    <nav>
      <Link to="/home"><strong>ShopKart</strong></Link>
      <div className="nav-links">
        <Link to="/products">Products</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/cart">Cart ({count})</Link>
        <Link to="/orders">Orders</Link>
      </div>
      <button onClick={logout}>Logout</button>
    </nav>
  )
}

export default Navbar
