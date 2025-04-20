import * as React from 'react';
import Link from 'next/link';

interface ArticleCardProps {
  readonly slug: string;
  readonly title: string;
  readonly date: string;
  readonly excerpt: string;
  readonly category: string;
}

export default function ArticleCard({ slug, title, date, excerpt, category }: ArticleCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-6 hover:shadow-lg transition-shadow">
      <Link href={`/${slug}`}>
        <h2 className="text-2xl font-bold text-white mb-2 hover:text-blue-400">{title}</h2>
      </Link>
      <div className="text-sm text-gray-400 mb-1">{date} | <Link href={`/category/${category}`}>{category}</Link></div>
      <p className="text-gray-300 mb-2">{excerpt}</p>
      <Link href={`/${slug}`} className="text-blue-400 hover:underline">Read more →</Link>
    </div>
  );
}
