import { useState } from 'react'
import { Link } from 'react-router-dom'
import useCart from '../hooks/useCart'
import api from '../services/api'

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [saving, setSaving] = useState(false)
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState('')

  const addWishlist = async () => {
    setSaving(true)
    setMessage('')

    try {
      await api(`/wishlist/${product._id}`, { method: 'POST' })
      setMessage('Added to Wishlist')
    } catch (requestError) {
      setMessage(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const addCart = async () => {
    setAdding(true)
    setMessage('')

    try {
      await addToCart(product._id)
      setMessage('Added to Cart')
    } catch (requestError) {
      setMessage(requestError.message)
    } finally {
      setAdding(false)
    }
  }

  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.category}</p>
      <p>₹{product.price}</p>
      <p>{product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}</p>
      <Link className="button-link" to={`/products/${product._id}`}>View Details</Link>
      <button onClick={addWishlist} disabled={saving}>{saving ? 'Saving...' : 'Add to Wishlist'}</button>
      <button onClick={addCart} disabled={adding || product.stock === 0}>{adding ? 'Adding...' : 'Add to Cart'}</button>
      {message && <p className="message">{message}</p>}
    </article>
  )
}

export default ProductCard
