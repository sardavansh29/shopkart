function SearchBar({ search, setSearch, category, setCategory }) {
  return (
    <div className="filters">
      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products..." />
      <select value={category} onChange={(event) => setCategory(event.target.value)}>
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Fashion">Fashion</option>
        <option value="Books">Books</option>
        <option value="Home">Home</option>
      </select>
    </div>
  )
}

export default SearchBar
