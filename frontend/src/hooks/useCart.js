import { useContext } from 'react'
import CartContext from '../context/cart'

const useCart = () => useContext(CartContext)

export default useCart
