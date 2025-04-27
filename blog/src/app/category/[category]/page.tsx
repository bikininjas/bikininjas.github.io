import { getAllPosts } from '../../posts';
import Navbar from '../../Navbar';
import ParallaxBanner from '../../ParallaxBanner';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

export async function generateStaticParams() {
  const categories = Array.from(new Set(getAllPosts().flatMap(post => post.categories)));
  return categories.map(category => ({ category }));
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const posts = getAllPosts().filter(post => post.categories.includes(params.category));
  return (
    <>
      <Navbar />
      <ParallaxBanner />
      <main className="w-[90vw] px-2 sm:px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Articles dans la catégorie "{params.category}"</h2>
        <div className="bg-[var(--card-bg)] rounded-3xl shadow neon-glow p-12 flex flex-col h-full glass-card max-w-7xl w-full mx-auto">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-3xl border-2 border-[var(--neon-blue)] bg-[var(--card-bg)]/60 backdrop-blur-md shadow-2xl transition hover:shadow-[0_0_60px_12px_var(--neon-pink)] hover:border-[var(--neon-pink)] focus:outline-none focus:ring-2 focus:ring-[var(--neon-blue)] flex flex-col min-h-[480px] text-lg p-9 overflow-hidden relative neon-glow glass-card cyberpunk-card hover:scale-[1.04] hover:brightness-110 duration-200 w-full"
              tabIndex={0}
            >
              <div className="relative w-full h-1/2 min-h-[120px] flex items-center justify-center bg-[var(--background-color)]">
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover w-full h-full"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{objectFit: 'cover'}}
                  />
                ) : (
                  <Image
                    src="/bikininjas-logos.png"
                    alt="Site Logo"
                    fill
                    className="opacity-20 absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{objectFit: 'contain'}}
                  />
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between p-4 z-10">
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.categories.map((cat) => (
                      <span key={cat} className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">{post.excerpt}</p>
                </div>
                <span className="text-xs text-gray-400 mt-2 block">
                  {(() => {
                    const dateObj = typeof post.date === 'string' ? new Date(post.date) : post.date;
                    return dateObj && !isNaN(dateObj.getTime())
                      ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'Europe/Paris' }).format(dateObj)
                      : '';
                  })()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
