import React, { useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import Layout from '../../components/layout';
import CategoryNav from '../../components/CategoryNav';
import { getAllCategories, getAllCategorySlugs, getCategoryFromSlug, getPostsByCategorySlug } from '../../lib/posts';
import SEO from '../../components/SEO';
import PostCard from '../../components/PostCard'; // <-- Add this import

export async function getStaticPaths() {
  const categorySlugs = getAllCategorySlugs();
  
  const paths = categorySlugs.map((slug) => ({
    params: {
      category: slug,
    },
  }));
  
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const slug = params.category;
  const category = getCategoryFromSlug(slug);
  const postsData = getPostsByCategorySlug(slug);
  const categories = getAllCategories();
  
  return {
    props: {
      category,
      categorySlug: slug,
      postsData,
      categories,
    },
  };
}

export default function CategoryPage({ posts = [], category, categoryName, categories = [] }) { 
  const [searchTerm, setSearchTerm] = useState('');

  // Ensure 'posts' is an array before filtering, then filter
  const filteredPosts = Array.isArray(posts) 
    ? posts.filter(post => 
        // Ensure properties exist before calling methods
        (post?.title?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
        (post?.excerpt?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
        (Array.isArray(post?.categories) && post.categories.some(cat => (cat?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())))
      )
    : []; // Default to empty array if posts is not an array

  return (
    <Layout>
      <SEO title={`${categoryName} - My Blog`} description={`Posts about ${categoryName}`} />
      
      <section className="container">
        <div className="category-header" data-testid="post-parallax">
          <h1 className="category-title">{categoryName}</h1>
        </div>
        
        {/* Remove data-testid from this div */}
        <div> 
          <CategoryNav 
            categories={categories} 
            activeCategory={category} 
            onCategoryChange={(cat) => router.push(`/categories/${cat}`)}
          />
        </div>
        
        <div className="posts-grid">
          {/* Check filteredPosts length before mapping */}
          {filteredPosts.length > 0 ? ( 
            // Optional chaining on map is still good practice
            filteredPosts?.map(post => ( 
              <PostCard key={post?.id} post={post} /> // Add optional chaining for key too
            ))
          ) : (
            <p>No posts found in this category{searchTerm ? ' matching your search' : ''}.</p>
          )}
        </div>
      </section>
    </Layout>
  );
}

// Helper function to capitalize strings
function capitalize(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

CategoryPage.propTypes = {
  category: PropTypes.string.isRequired,
  categorySlug: PropTypes.string.isRequired,
  postsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      category: PropTypes.string,
      categorySlug: PropTypes.string
    })
  ).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired
};
