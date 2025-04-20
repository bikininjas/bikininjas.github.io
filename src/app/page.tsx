import { useState } from "react";
import { getAllPosts, getAllCategories } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";
import CategoryList from "@/components/CategoryList";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

const POSTS_PER_PAGE = 5;

export default function HomePage() {
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredPosts = allPosts.filter(post =>
    post.meta.title.toLowerCase().includes(search.toLowerCase()) ||
    post.meta.excerpt.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  return (
    <div>
      <SearchBar onSearch={setSearch} />
      <CategoryList categories={categories} />
      {paginatedPosts.map(post => (
        <ArticleCard
          key={post.slug}
          slug={post.slug}
          title={post.meta.title}
          date={post.meta.date}
          excerpt={post.meta.excerpt}
          category={post.meta.category}
        />
      ))}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
