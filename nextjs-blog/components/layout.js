import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import CategoryNav from './CategoryNav'; // Assuming CategoryNav is used here based on other context

// Use default parameters for props
export default function Layout({ children, categories = [], title = 'BikiNinjas Blog' }) {
  return (
    <div className="container">
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="BikiNinjas Blog - Articles about tech, games, and development" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main role="main" className="main-content" id="main-content">
        {/* Conditionally render CategoryNav if categories are provided */}
        {categories.length > 0 && (
          <aside role="complementary" aria-label="Categories">
            <CategoryNav categories={categories} />
          </aside>
        )}
        
        <div className="content-wrapper">
          {children}
        </div>
      </main>

      <footer role="contentinfo" className="footer">
        <p>© {new Date().getFullYear()} BikiNinjas. All rights reserved.</p>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  // Update categories prop type to match the expected object shape
  categories: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  })),
  title: PropTypes.string
};

// Remove the deprecated defaultProps
// Layout.defaultProps = {
//   categories: [],
//   title: 'BikiNinjas Blog'
// };
