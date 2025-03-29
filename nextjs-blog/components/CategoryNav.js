import Link from 'next/link';
import PropTypes from 'prop-types';
import { slugify } from '../lib/utils';

export default function CategoryNav({ categories, currentCategory }) {
  return (
    <nav className="category-nav">
      <h2 className="category-nav-title">Categories</h2>
      <ul className="category-list">
        <li className={`category-item ${currentCategory === 'all' ? 'active' : ''}`}>
          <Link href="/" className="category-link">
            All Posts
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
