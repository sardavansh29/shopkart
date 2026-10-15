import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import api from '../services/api'

function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      setError('')
      const params = new URLSearchParams()

      if (search) params.set('search', search)
      if (category) params.set('category', category)

      try {
        const data = await api(`/products?${params.toString()}`)
        setProducts(data.products)
      } catch {
        setError('Something went wrong while loading products.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [search, category])

  return (
    <section>
      <h2>Products</h2>
      <SearchBar search={search} setSearch={setSearch} category={category} setCategory={setCategory} />
      {loading && <p>Loading products...</p>}
      {error && <p className="notice error">{error}</p>}
      {!loading && !error && products.length === 0 && <p>No products found.</p>}
      <div className="grid">
        {products.map((product) => <ProductCard key={product._id} product={product} />)}
      </div>
    </section>
  )
}

export default Products
