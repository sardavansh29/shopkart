import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useCart from '../hooks/useCart'
import api from '../services/api'

function ProductDetails() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api(`/products/${id}`)
      .then(setProduct)
      .catch(() => setMessage('Could not load product'))
      .finally(() => setLoading(false))
  }, [id])

  const addWishlist = async () => {
    try {
      await api(`/wishlist/${id}`, { method: 'POST' })
      setMessage('Added to Wishlist')
    } catch (requestError) {
      setMessage(requestError.message)
    }
  }

  const addCart = async () => {
    try {
      await addToCart(id)
      setMessage('Added to Cart')
    } catch (requestError) {
      setMessage(requestError.message)
    }
  }

  if (loading) return <p>Loading product...</p>
  if (!product) return <p>{message}</p>

  return (
    <section className="details">
      <img src={product.image} alt={product.name} />
      <div>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>₹{product.price}</p>
        <p>{product.category}</p>
        <p>{product.stock} units left</p>
        <button onClick={addWishlist}>Add to Wishlist</button>
        <button onClick={addCart} disabled={product.stock === 0}>Add to Cart</button>
        {message && <p className="message">{message}</p>}
      </div>
    </section>
  )
}

export default ProductDetails
