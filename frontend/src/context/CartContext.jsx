import { useCallback, useState } from 'react'
import api from '../services/api'
import CartContext from './cart'

function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refreshCart = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await api('/cart')
      setCart(data.cart)
      return data.cart
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCart = useCallback(async (path, options) => {
    setLoading(true)
    setError('')

    try {
      const data = await api(path, options)
      setCart(data.cart)
      return data
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    } finally {
      setLoading(false)
    }
  }, [])

  const addToCart = (productId) => updateCart(`/cart/${productId}`, { method: 'POST' })
  const removeFromCart = (productId) => updateCart(`/cart/${productId}`, { method: 'DELETE' })
  const setQuantity = (productId, quantity) => updateCart(`/cart/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  })

  return (
    <CartContext.Provider value={{ cart, loading, error, refreshCart, addToCart, removeFromCart, setQuantity, clearCart: () => setCart([]) }}>
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider
