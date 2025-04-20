import { getAllCategories } from "@/lib/posts";
import CategoryList from "@/components/CategoryList";

export default function CategoriesPage() {
  const categories = getAllCategories();
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      <CategoryList categories={categories} />
    </div>
  );
}
