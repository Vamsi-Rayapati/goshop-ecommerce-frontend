import { categoryApi, productsApi, CategoryResponse, ProductResponse } from '../../lib/api';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { Suspense } from 'react';
import SortSelect from './SortSelect';

interface ProductsPageProps {
  searchParams: { category_id?: string; sort?: string };
}

// Helper function to convert sort parameter to API format
function getSortParams(sort: string): { sortBy: string; sortOrder: string } {
  switch (sort) {
    case 'price-low':
      return { sortBy: 'price', sortOrder: 'asc' };
    case 'price-high':
      return { sortBy: 'price', sortOrder: 'desc' };
    case 'rating':
      return { sortBy: 'rating', sortOrder: 'desc' };
    default:
      return { sortBy: 'name', sortOrder: 'asc' };
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  let categories: CategoryResponse[] = [];
  let products: ProductResponse[] = [];
  let categoriesError: string | null = null;
  let productsError: string | null = null;
  
  const categoryIdFromUrl = searchParams.category_id;
  const sortFromUrl = searchParams.sort || 'name';
  
  // Parse category ID
  const selectedCategoryId: number | 'All' = categoryIdFromUrl 
    ? (isNaN(parseInt(categoryIdFromUrl)) ? 'All' : parseInt(categoryIdFromUrl))
    : 'All';

  // Get sort parameters for API
  const { sortBy, sortOrder } = getSortParams(sortFromUrl);

  // Fetch categories
  try {
    const response = await categoryApi.getCategories();
    categories = response.categories;
  } catch (err) {
    console.error('Error fetching categories:', err);
    
    if (err && typeof err === 'object' && 'message' in err) {
      categoriesError = `Categories API Error: ${err.message}`;
    } else if (err instanceof Error) {
      categoriesError = `Network Error: ${err.message}`;
    } else {
      categoriesError = 'Failed to load categories. Please check your API connection.';
    }
  }

  // Fetch products
  try {
    const response = await productsApi.getProducts(
      1, // page_no
      50, // page_size
      selectedCategoryId === 'All' ? undefined : selectedCategoryId,
      sortBy,
      sortOrder
    );
    products = response.products;
  } catch (err) {
    console.error('Error fetching products:', err);
    
    if (err && typeof err === 'object' && 'message' in err) {
      productsError = `Products API Error: ${err.message}`;
    } else if (err instanceof Error) {
      productsError = `Network Error: ${err.message}`;
    } else {
      productsError = 'Failed to load products. Please check your API connection.';
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>
        
        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Category Filter */}
          {categoriesError ? (
            <div className="text-sm text-red-600">{categoriesError}</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {/* All Categories Button */}
              <Link
                href="/products"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategoryId === 'All'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </Link>
              
              {/* Category Buttons */}
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category_id=${category.id}${sortFromUrl !== 'name' ? `&sort=${sortFromUrl}` : ''}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategoryId === category.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          {/* Sort Dropdown - Client component for interactivity */}
          <SortSelect 
            currentSort={sortFromUrl} 
            categoryId={categoryIdFromUrl} 
          />
        </div>
      </div>

      {/* Products Grid or Error Messages */}
      {productsError ? (
        <div className="text-center py-12">
          <div className="bg-red-50 rounded-lg p-12">
            <ShoppingCart className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Products</h3>
            <p className="text-red-700">{productsError}</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-12">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-600">
              {selectedCategoryId === 'All' 
                ? 'No products found in the catalog.' 
                : `No products found in this category.`}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: ProductResponse) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image_url || '/placeholder-product.svg'}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.svg';
                    }}
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
                      {product.rating} ({product.reviews_count} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <p className="text-xl font-bold text-indigo-600 mb-3">
                    ${product.price}
                  </p>

                  {/* Add to Cart Button - This will need client-side functionality */}
                  <button
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    disabled
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart (Coming Soon)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
