import * as React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center shadow-md">
      <Link href="/">
        <span className="text-xl font-bold tracking-tight">BikiNinjas Blog</span>
      </Link>
      <nav className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/categories">Categories</Link>
        {/* Add more nav items as needed */}
      </nav>
    </header>
  );
}
