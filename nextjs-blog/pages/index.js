import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Layout from '../components/layout';
import CategoryNav from '../components/CategoryNav';
import ParallaxHero from '../components/ParallaxHero';
import PostCard from '../components/PostCard';
import { getSortedPostsData, getAllCategories } from '../lib/posts';
import SEO from '../components/SEO';
import Hero from '../components/Hero';

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  const categories = getAllCategories();
  return {
    props: {
      allPostsData,
      categories,
    },
  };
}

export default function Home({ allPostsData = [], allCategories = [] }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const filteredPosts = allPostsData.filter(post => {
    const matchesCategory = activeCategory === null || post.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  return (
    <>
      <SEO title="Home - My Blog" description="Welcome to my blog!" />
      <Layout>
        <Hero title="Welcome to My Blog" subtitle="Thoughts, stories and ideas" />
        
        <section className="container">
          <SearchBar 
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search posts..."
          />
          
          <CategoryNav 
            categories={allCategories} 
            activeCategory={activeCategory} 
            onCategoryChange={handleCategoryChange}
          />
          
          <div className="posts-grid">
            {filteredPosts.map(post => (
              <Link href={`/posts/${post.slug}`} key={post.slug}>
                <PostCard 
                  title={post.title}
                  date={post.date}
                  excerpt={post.excerpt}
                  coverImage={post.coverImage}
                  slug={post.slug}
                  category={post.category}
                />
              </Link>
            ))}
            {filteredPosts.length === 0 && (
              <div className="no-results">
                <p>No posts found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
}

Home.propTypes = {
  allPostsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      category: PropTypes.string
    })
  ).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired
};
