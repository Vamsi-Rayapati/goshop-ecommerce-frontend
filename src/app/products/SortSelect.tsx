'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface SortSelectProps {
  currentSort: string;
  categoryId?: string;
}

export default function SortSelect({ currentSort, categoryId }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams);
    
    if (newSort === 'name') {
      params.delete('sort');
    } else {
      params.set('sort', newSort);
    }
    
    if (categoryId) {
      params.set('category_id', categoryId);
    }
    
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm font-medium text-gray-700">
        Sort by:
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={handleSortChange}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="name">Name</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Rating</option>
      </select>
    </div>
  );
}
