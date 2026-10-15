import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import ProtectedLayout from './components/ProtectedLayout'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Home from './pages/Home'
import Login from './pages/Login'
import OrderDetails from './pages/OrderDetails'
import Orders from './pages/Orders'
import OrderSuccess from './pages/OrderSuccess'
import ProductDetails from './pages/ProductDetails'
import Products from './pages/Products'
import Register from './pages/Register'
import Wishlist from './pages/Wishlist'

function App() {
  return (
    <main>
      <header>
        <h1>ShopKart</h1>
        <p>Customer Portal</p>
      </header>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </main>
  )
}

export default App
