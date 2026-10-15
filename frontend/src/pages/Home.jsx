import { Link, useOutletContext } from 'react-router-dom'

function Home() {
  const customer = useOutletContext()

  return (
    <section className="account-card profile">
      <h2>Welcome, {customer.fullName}</h2>
      <p>Email: {customer.email}</p>
      <p>Phone: {customer.phone}</p>
      <Link className="button-link" to="/products">Browse Products</Link>
    </section>
  )
}

export default Home
