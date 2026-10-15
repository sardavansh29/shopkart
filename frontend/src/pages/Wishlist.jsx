import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function Wishlist() {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadWishlist = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true)
      setError('')
    }

    try {
      const data = await api('/wishlist')
      setWishlist(data.wishlist)
    } catch {
      setError("Unable to load wishlist.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    api('/wishlist')
      .then((data) => setWishlist(data.wishlist))
      .catch(() => setError('Unable to load wishlist.'))
      .finally(() => setLoading(false))
  }, [])

  const removeProduct = async (productId) => {
    try {
      await api(`/wishlist/${productId}`, { method: 'DELETE' })
      setWishlist(wishlist.filter((product) => product._id !== productId))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  if (loading) return <p>Loading your wishlist...</p>
  if (error) return <section><p className="notice error">{error}</p><button onClick={loadWishlist}>Try Again</button></section>

  if (wishlist.length === 0) {
    return <section><h2>Your wishlist is empty ❤️</h2><p>Start saving products you love.</p><Link className="button-link" to="/products">Browse Products</Link></section>
  }

  return (
    <section>
      <h2>My Wishlist</h2>
      <p>{wishlist.length} products saved</p>
      <div className="grid">
        {wishlist.map((product) => (
          <article className="product-card" key={product._id}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.category}</p>
            <p>₹{product.price}</p>
            <p>{product.stock} units left</p>
            <Link className="button-link" to={`/products/${product._id}`}>View Details</Link>
            <button onClick={() => removeProduct(product._id)}>Remove from Wishlist</button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Wishlist
