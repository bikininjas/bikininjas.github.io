import React from 'react';
import PropTypes from 'prop-types';
import styles from './CategoryNav.module.css';

const CategoryNav = ({ categories = [], activeCategory = '', onCategoryChange = () => {} }) => {
  return (
    <div className={`category-nav ${styles.categoryNav}`} data-testid="category-nav">
      <ul>
        <li>
          <a 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onCategoryChange('');
            }}
            aria-current={!activeCategory ? "page" : undefined}
            className={!activeCategory ? styles.active : ""}
          >
            All
          </a>
        </li>
        {categories.map((category) => (
          <li key={category}>
            <a 
              href={`/categories/${category.toLowerCase()}`}
              onClick={(e) => {
                e.preventDefault();
                onCategoryChange(category);
              }}
              aria-current={activeCategory === category ? "page" : undefined}
              className={activeCategory === category ? styles.active : ""}
            >
              {category}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

CategoryNav.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeCategory: PropTypes.string,
  onCategoryChange: PropTypes.func.isRequired
};

CategoryNav.defaultProps = {
  activeCategory: null
};

export default CategoryNav;
