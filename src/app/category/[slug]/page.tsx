import { getPostsByCategory, getAllCategories } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";
import CategoryList from "@/components/CategoryList";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const categories = getAllCategories().map((slug: string) => ({ slug }));
  return categories;
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const posts = getPostsByCategory(params.slug);
  if (!posts.length) return notFound();
  return (
    <div>
      <CategoryList categories={getAllCategories()} activeCategory={params.slug} />
      {posts.map(post => (
        <ArticleCard
          key={post.slug}
          slug={post.slug}
          title={post.meta.title}
          date={post.meta.date}
          excerpt={post.meta.excerpt}
          category={post.meta.category}
        />
      ))}
    </div>
  );
}
