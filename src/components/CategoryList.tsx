import * as React from 'react';
import Link from 'next/link';

interface CategoryListProps {
  categories: string[];
  activeCategory?: string;
}

export default function CategoryList({ categories, activeCategory }: CategoryListProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map(category => (
        <Link key={category} href={`/category/${category}`}>
          <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gray-700 hover:bg-blue-600 text-white transition-colors ${activeCategory === category ? 'bg-blue-600' : ''}`}>
            {category}
          </span>
        </Link>
      ))}
    </div>
  );
}
