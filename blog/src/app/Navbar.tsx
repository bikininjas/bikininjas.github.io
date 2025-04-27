import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "./posts";

export default function Navbar() {
  // Get all unique categories from posts
  const categories = Array.from(
    new Set(getAllPosts().flatMap((post) => post.categories))
  ).sort((a, b) => a.localeCompare(b));

  return (
    <nav className="w-full flex items-center justify-between py-6 px-4 sm:px-8 bg-[var(--header-bg)]/60 backdrop-blur-md border-b border-[var(--neon-blue)] shadow-xl neon-glow rounded-b-2xl glass-navbar">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/bikininjas-logos.png"
          alt="BikiniNinjas Logo"
          width={48}
          height={48}
          className="rounded-full shadow neon-glow border-2 border-[var(--neon-blue)] transition-transform duration-700 hover:rotate-[360deg]"
          priority
        />
        <span className="text-3xl font-extrabold tracking-tight font-sans neon-text drop-shadow-lg">Bikininjas</span>
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/" className="hover:text-[var(--neon-pink)] font-semibold text-lg transition-colors">Accueil</Link>
        <Link href="/" className="hover:text-[var(--neon-pink)] font-semibold text-lg transition-colors">Blog</Link>
        <div className="relative group">
          <button className="px-4 py-2 rounded-xl text-[var(--neon-cyan)] bg-[var(--card-bg)]/60 border border-[var(--neon-blue)] shadow glass-navbar hover:bg-[var(--card-bg)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--neon-blue)] font-semibold backdrop-blur-md">
            Catégories
          </button>
          <div className="absolute left-0 mt-3 min-w-[170px] bg-[var(--card-bg)]/80 border border-[var(--neon-blue)] rounded-xl shadow-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-20 backdrop-blur-lg glass-dropdown">
            {categories.map((cat) => (
              <Link key={cat} href={`/?category=${encodeURIComponent(cat)}`} className="block px-4 py-2 text-sm text-gray-100 hover:bg-[var(--neon-blue)]/30 hover:text-[var(--neon-pink)] transition-colors rounded-lg">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
