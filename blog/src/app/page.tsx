import * as React from "react";
import Navbar from "./Navbar";
import ParallaxBanner from "./ParallaxBanner";
import { getAllPosts } from "./posts";
import Image from "next/image";
import SocialLinks from "./SocialLinks";
import WidgetsPanel from "./WidgetsPanel";

export default function Home() {
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const selectedCategory = searchParams ? searchParams.get('category') : null;
  const posts = getAllPosts();
  console.log('Homepage posts:', posts.map(p => p.slug));
  console.log('Homepage full posts:', posts);
  // Patch: Always show all posts, regardless of date
  const filteredPosts = selectedCategory ? posts.filter(post => post.categories.includes(selectedCategory)) : posts;
  // Do not slice, limit, or filter by date. All posts will be shown.
  return (
    <>
      <Navbar />
      <ParallaxBanner />
      <main className="w-full px-2 sm:px-4 py-12 bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-8 max-w-screen-2xl mx-auto items-start">
          {/* Left: Social Links */}
          <aside className="md:col-span-3 hidden md:block self-start mb-8">
            <SocialLinks />
          </aside>
          {/* Center: Blog Posts */}
          <section className="col-span-1 md:col-span-6 self-start">
            <h2 className="text-2xl font-bold mb-6 cyberpunk-heading text-center">Latest Blog Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {filteredPosts.length === 0 ? (
                <div className="col-span-full text-center text-[var(--neon-cyan)] text-lg">Aucun article dans cette catégorie.</div>
              ) : (
                filteredPosts.map((post) => (
                  <a
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group rounded-3xl border-2 border-[var(--neon-blue)] bg-[var(--card-bg)]/80 backdrop-blur-md shadow-2xl transition hover:shadow-[0_0_60px_12px_var(--neon-pink)] hover:border-[var(--neon-pink)] focus:outline-none focus:ring-2 focus:ring-[var(--neon-blue)] flex flex-col min-h-[520px] w-full text-xl p-0 overflow-hidden relative neon-glow glass-card cyberpunk-card hover:scale-[1.04] hover:brightness-110 duration-200"
                    tabIndex={0}
                  >
                    {/* Banner Image with Overlay */}
                    <div className="relative w-full h-48 md:h-56 overflow-hidden">
                      <Image
                        src={post.image || "/bikininjas-logos.png"}
                        alt={post.title}
                        fill
                        className="object-cover w-full h-full"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{objectFit: 'cover'}}
                      />
                      <div className="absolute inset-0 bg-black/60 group-hover:bg-[var(--neon-pink)]/30 transition-all duration-200" />
                      {/* Categories as glowing badges */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                        {post.categories.map((cat) => (
                          <span key={cat} className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[var(--neon-blue)]/60 text-[var(--neon-pink)] shadow-[0_0_8px_var(--neon-blue)] border border-[var(--neon-pink)]">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Card Content */}
                    <div className="flex-1 flex flex-col justify-between px-7 pt-6 pb-5">
                      <div>
                        <h3 className="text-2xl font-extrabold mb-3 neon-text drop-shadow-md text-[var(--neon-pink)] group-hover:text-[var(--neon-blue)] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-[var(--neon-cyan)] mb-6 font-mono text-base leading-relaxed opacity-90">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="flex items-end justify-between mt-4">
                        <span className="text-xs text-[var(--neon-purple)] opacity-80">
                          {post.date}
                        </span>
                        <span className="inline-block ml-2">
                          <span className="px-4 py-1 rounded-lg bg-[var(--neon-blue)]/50 text-[var(--neon-pink)] font-bold text-xs shadow hover:bg-[var(--neon-pink)]/70 hover:text-[var(--neon-blue)] transition-all border border-[var(--neon-pink)] cursor-pointer">
                            Lire la suite
                          </span>
                        </span>
                      </div>
                    </div>
                  </a>
                ))
              )}
            </div>
          </section>
          {/* Right: Widgets */}
          <aside className="md:col-span-3 hidden md:block self-start mb-8">
            <WidgetsPanel />
          </aside>
        </div>
      </main>
    </>
  );
}
