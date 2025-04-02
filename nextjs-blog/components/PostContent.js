import { useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './PostContent.module.css';

/**
 * Component to render post content
 * @param {Object} props - Component props
 * @param {string} props.content - HTML content of the post
 * @returns {JSX.Element} - Rendered post content
 */
export default function PostContent({ content }) {
  const contentRef = useRef(null);

  return (
    <div 
      ref={contentRef}
      className={styles.postContent}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}



PostContent.propTypes = {
  content: PropTypes.string.isRequired,
};
