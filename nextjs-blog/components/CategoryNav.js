import React, { useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { slugify } from '../lib/utils';

export default function CategoryNav({ categories, currentCategory }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsOpen(!isOpen);
    }
  };

  return (
    <nav className="category-nav" role="navigation" aria-label="Categories">
      <button
        className="category-nav-toggle"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls="category-list"
      >
        Catégories
        <span className={`arrow ${isOpen ? 'up' : 'down'}`} aria-hidden="true"></span>
      </button>

      <ul id="category-list" className={`category-list ${isOpen ? 'show' : ''}`}>
        <li className={`category-item ${currentCategory === 'all' ? 'active' : ''}`}>
          <Link 
            href="/" 
            className="category-link"
            aria-current={currentCategory === 'all' ? 'page' : undefined}
          >
            Tous les Articles
          </Link>
        </li>
        {categories.map((category) => (
          <li 
            key={category} 
            className={`category-item ${currentCategory === category ? 'active' : ''}`}
          >
            <Link 
              href={`/categories/${slugify(category)}`}
              className="category-link"
              aria-current={currentCategory === category ? 'page' : undefined}
            >
              {category}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

CategoryNav.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentCategory: PropTypes.string
};

CategoryNav.defaultProps = {
  currentCategory: 'all'
};
