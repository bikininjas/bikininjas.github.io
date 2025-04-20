import { notFound } from "next/navigation";
import { getPostHtml, getPostSlugs } from "@/lib/posts";
import Head from "next/head";

export async function generateStaticParams() {
  const slugs = getPostSlugs().map(slug => ({ slug: slug.replace(/\.md$/, "") }));
  return slugs;
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostHtml(params.slug);
  if (!post) return notFound();
  return (
    <article className="prose prose-invert mx-auto">
      <Head>
        <title>{post.meta.title} | BikiNinjas Blog</title>
        <meta name="description" content={post.meta.excerpt} />
      </Head>
      <h1>{post.meta.title}</h1>
      <div className="text-gray-400 text-sm mb-4">{post.meta.date} | {post.meta.category}</div>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}
