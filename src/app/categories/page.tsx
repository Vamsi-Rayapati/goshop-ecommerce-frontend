'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Laptop, Shirt, Home, Dumbbell, Coffee, Package } from 'lucide-react';
import { categoryApi, CategoryResponse } from '../../lib/api';

// Icon mapping for different category names
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('electronic') || name.includes('tech')) return Laptop;
  if (name.includes('fashion') || name.includes('clothing') || name.includes('apparel')) return Shirt;
  if (name.includes('home') || name.includes('garden') || name.includes('furniture')) return Home;
  if (name.includes('sport') || name.includes('fitness') || name.includes('gym')) return Dumbbell;
  if (name.includes('kitchen') || name.includes('cooking') || name.includes('dining')) return Coffee;
  if (name.includes('book') || name.includes('education')) return ShoppingBag;
  return Package; // Default icon
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryApi.getCategories();
        setCategories(response.categories);
      } catch (err) {
        setError('Failed to load categories. Please try again later.');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Shop by Category
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our wide range of product categories and find exactly what you&apos;re looking for
        </p>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600">Categories will appear here once they are added to the catalog.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = getCategoryIcon(category.name);
            
            return (
              <Link
                key={category.id}
                href={`/products?category=${category.name.toLowerCase()}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Category Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`https://via.placeholder.com/400x300/6366f1/white?text=${encodeURIComponent(category.name)}`}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  
                  {/* Icon Overlay */}
                  <div className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-md">
                    <IconComponent className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>

                {/* Category Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Explore our collection of {category.name.toLowerCase()} products
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      View products
                    </span>
                    <span className="text-indigo-600 font-medium group-hover:text-indigo-700">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-16 text-center bg-gray-50 rounded-lg p-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Can&apos;t find what you&apos;re looking for?
        </h2>
        <p className="text-gray-600 mb-6">
          Browse all our products or use our search feature to find specific items
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            View All Products
          </Link>
          <Link
            href="/"
            className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
