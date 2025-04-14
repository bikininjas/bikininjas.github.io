import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import Layout from '../../components/layout';
import CategoryNav from '../../components/CategoryNav';
import { getAllCategories, getAllCategorySlugs, getCategoryFromSlug, getPostsByCategorySlug } from '../../lib/posts';
import SEO from '../../components/SEO';

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

export default function Category({ allPosts, categories, categoryData }) {
  // Make sure categoryData is properly structured and the title is passed
  const categoryTitle = categoryData?.title || capitalize(categoryData?.slug || '');
  
  return (
    <Layout>
      <SEO title={`${categoryTitle} - My Blog`} description={`Posts about ${categoryTitle}`} />
      
      <section className="container">
        <div className="category-header" data-testid="post-parallax">
          <h1 className="category-title">{categoryTitle}</h1>
        </div>
        
        <div data-testid="category-nav">
          <CategoryNav 
            categories={categories} 
            activeCategory={categoryData?.slug} 
            onCategoryChange={(cat) => router.push(`/categories/${cat}`)}
          />
        </div>
        
        <div className="posts-grid">
          {allPosts.map(post => (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <div key={post.id} data-testid="post-card">
                <PostCard 
                  title={post.title}
                  date={post.date}
                  excerpt={post.excerpt}
                  coverImage={post.coverImage}
                  slug={post.slug}
                  category={post.category}
                />
              </div>
            </Link>
          ))}
          
          {allPosts.length === 0 && (
            <div className="no-results">
              <p>No posts found in this category.</p>
            </div>
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

Category.propTypes = {
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
