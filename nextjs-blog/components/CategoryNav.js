import React from 'react';
import PropTypes from 'prop-types';
import styles from './CategoryNav.module.css';

const CategoryNav = ({ categories = [], activeCategory, onCategoryChange }) => {
  return (
    <nav className="category-nav" data-testid="category-nav">
      <ul>
        {categories.map((category) => (
          <li key={category.slug}>
            <a
              href={`/categories/${category.slug}`}
              onClick={(e) => {
                e.preventDefault();
                if (onCategoryChange) {
                  onCategoryChange(category.slug);
                }
              }}
              className={category.slug === activeCategory ? 'active' : ''}
              aria-current={category.slug === activeCategory ? 'page' : undefined}
            >
              {category.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

CategoryNav.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  activeCategory: PropTypes.string,
  onCategoryChange: PropTypes.func.isRequired
};

CategoryNav.defaultProps = {
  activeCategory: null
};

export default CategoryNav;
