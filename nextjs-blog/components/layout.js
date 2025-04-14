import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import Navbar from './Navbar';
import CategoryNav from './CategoryNav';

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
        <aside role="complementary" aria-label="Categories">
          <CategoryNav categories={categories} />
        </aside>
        
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
  categories: PropTypes.array,
  title: PropTypes.string
};

Layout.defaultProps = {
  categories: [],
  title: 'BikiNinjas Blog'
};
