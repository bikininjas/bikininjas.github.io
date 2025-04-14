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

export default function CategoryPage({ 
  categoryPosts = [], 
  category = '', 
  allCategories = [] 
}) {
  // Ensure categoryPosts is an array
  const posts = Array.isArray(categoryPosts) ? categoryPosts : [];
  
  return (
    <>
      <SEO 
        title={`${category || 'Category'} - My Blog`} 
        description={`All posts in the ${category || 'selected'} category`}
      />
      
      <Layout>
        <section className="container">
          <div data-testid="post-parallax" className="category-header">
            <h1 className="category-title">{category}</h1>
          </div>
          
          <CategoryNav 
            categories={allCategories} 
            activeCategory={category} 
          />
          
          <div className="posts-grid">
            {posts.map(post => (
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
            
            {posts.length === 0 && (
              <div className="no-results">
                <p>No posts found in this category.</p>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
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
