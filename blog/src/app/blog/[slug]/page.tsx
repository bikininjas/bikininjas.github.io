import { getAllPosts, getPostBySlug } from '../../posts';
import type { Post } from '../../posts';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../../Navbar';
import React from 'react';

export async function generateStaticParams() {
  return getAllPosts()
    .filter(post => typeof post.slug === 'string' && post.slug.trim() !== '')
    .map(post => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const post: Post | undefined = getPostBySlug(slug);
  if (!post) return notFound();

  return (
    <>
      <Navbar />
      <article className="w-[90vw] max-w-3xl mx-auto mt-10 bg-[var(--card-bg)] rounded-xl shadow neon-glow p-6">
        {post.image ? (
          <div className="relative w-full h-40 mb-6 rounded overflow-hidden bg-[var(--background-color)] flex items-center justify-center">
            <Image src={post.image} alt={post.title} fill className="object-cover" />
          </div>
        ) : (
          <div className="relative w-full h-40 mb-6 rounded overflow-hidden bg-[var(--background-color)] flex items-center justify-center">
            <Image src="/bikininjas-logos.png" alt="Site Logo" fill className="opacity-20 absolute inset-0 w-full h-full object-contain pointer-events-none select-none" />
          </div>
        )}
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories.map((cat) => (
            <span key={cat} className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              {cat}
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-400 mb-4 block">
          {(() => {
            const dateObj = typeof post.date === 'string' ? new Date(post.date) : post.date;
            return dateObj && !isNaN(dateObj.getTime())
              ? new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'Europe/Paris' }).format(dateObj)
              : '';
          })()}
        </span>
        <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </>
  );
}
