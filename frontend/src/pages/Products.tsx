import React, { useEffect, useState } from 'react';

interface Product {
  product_id: number;
  name: string;
  description?: string;
  price: number;
  category_id: number;
  image_url?: string;
  brand?: string;
  currency_id?: number;
}

interface Category {
  category_id: number;
  name: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name',
    order: 'asc',
  });

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchProducts = () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.order) params.append('order', filters.order);

      fetch(`/api/products?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => {
          setProducts([]);
          setLoading(false);
        });
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-cyan-400 mb-8">Latest Tech Products</h1>

      <div className="max-w-7xl mx-auto mb-8 p-4 bg-gray-800 rounded-lg shadow-md flex flex-wrap items-center justify-center gap-4">
        <input type="text" name="search" placeholder="Search products..." value={filters.search} onChange={handleFilterChange} className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        <select name="category" value={filters.category} onChange={handleFilterChange} className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <input type="text" name="brand" placeholder="Brand" value={filters.brand} onChange={handleFilterChange} className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        <input type="number" name="minPrice" placeholder="Min Price" value={filters.minPrice} onChange={handleFilterChange} className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        <input type="number" name="maxPrice" placeholder="Max Price" value={filters.maxPrice} onChange={handleFilterChange} className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>
        <select name="order" value={filters.order} onChange={handleFilterChange} className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.product_id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              {product.image_url && <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />}
              <div className="p-4">
                <h2 className="text-xl font-bold text-cyan-400">{product.name}</h2>
                <p className="text-gray-400 mt-1">{product.brand}</p>
                <p className="text-gray-300 mt-2">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-lg font-semibold text-white">${product.price.toLocaleString()}</p>
                  <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;