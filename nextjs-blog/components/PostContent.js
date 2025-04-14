import { useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './PostContent.module.css';
import Link from 'next/link';
import Image from 'next/image';
import ErrorBoundary from './ErrorBoundary';

/**
 * Component to render post content
 * @param {Object} props - Component props
 * @param {string} props.content - HTML content of the post
 * @returns {JSX.Element} - Rendered post content
 */
export default function PostContent({ title, date, contentHtml, category, categorySlug }) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <ErrorBoundary>
      <article className="post-content" role="article">
        <header>
          <h1>{title}</h1>
          <div className="post-meta">
            <time dateTime={date} aria-label="Publication date">
              {formattedDate}
            </time>
            {category && (
              <>
                <span className="separator" aria-hidden="true">•</span>
                <Link
                  href={`/categories/${categorySlug}`}
                  className="category-link"
                  aria-label={`View all posts in category ${category}`}
                >
                  {category}
                </Link>
              </>
            )}
          </div>
        </header>

        <div 
          className="post-body"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
          tabIndex={0}
        />
      </article>
    </ErrorBoundary>
  );
}

PostContent.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  contentHtml: PropTypes.string.isRequired,
  category: PropTypes.string,
  categorySlug: PropTypes.string,
};
