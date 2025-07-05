'use client';

import { useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';

// Mock product data - replace with actual API call later
const mockProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 99.99,
    image: 'https://via.placeholder.com/300x300/6366f1/white?text=Headphones',
    rating: 4.5,
    reviews: 128,
    category: 'Electronics'
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 199.99,
    image: 'https://via.placeholder.com/300x300/6366f1/white?text=Smart+Watch',
    rating: 4.8,
    reviews: 89,
    category: 'Electronics'
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: 79.99,
    image: 'https://via.placeholder.com/300x300/6366f1/white?text=Running+Shoes',
    rating: 4.3,
    reviews: 156,
    category: 'Sports'
  },
  {
    id: 4,
    name: 'Coffee Maker',
    price: 149.99,
    image: 'https://via.placeholder.com/300x300/6366f1/white?text=Coffee+Maker',
    rating: 4.6,
    reviews: 92,
    category: 'Home'
  },
  {
    id: 5,
    name: 'Backpack',
    price: 59.99,
    image: 'https://via.placeholder.com/300x300/6366f1/white?text=Backpack',
    rating: 4.4,
    reviews: 74,
    category: 'Fashion'
  },
  {
    id: 6,
    name: 'Laptop Stand',
    price: 39.99,
    image: 'https://via.placeholder.com/300x300/6366f1/white?text=Laptop+Stand',
    rating: 4.2,
    reviews: 45,
    category: 'Electronics'
  }
];

const categories = ['All', 'Electronics', 'Sports', 'Home', 'Fashion'];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');

  const filteredProducts = mockProducts.filter(product => 
    selectedCategory === 'All' || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleAddToCart = (productId: number) => {
    // TODO: Implement cart functionality
    console.log('Adding product to cart:', productId);
    alert('Product added to cart!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>
        
        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Product Image */}
            <div className="aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              
              {/* Rating */}
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <p className="text-xl font-bold text-indigo-600 mb-3">
                ${product.price}
              </p>

              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product.id)}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}
