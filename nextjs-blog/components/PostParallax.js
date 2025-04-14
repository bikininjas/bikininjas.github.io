import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ParallaxHero.module.css';
import ErrorBoundary from './ErrorBoundary';

const PostParallax = ({ title, date, category, categories, backgroundImage }) => {
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef(null);
  const parallaxRef = useRef(null);

  useEffect(() => {
    try {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      });

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      const handleScroll = () => {
        if (!isInView || !parallaxRef.current) return;
        const scrolled = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.3}px)`;
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        observer.disconnect();
        window.removeEventListener('scroll', handleScroll);
      };
    } catch (error) {
      setHasError(true);
      console.error('PostParallax error:', error);
    }
  }, [isInView]);

  // Default category images - same as in PostCard component
  const categoryImages = {
    'AI': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1920&q=80',
    'Game Development': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1920&q=80',
    'Gaming': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80',
    'Tech': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80',
    'Modding': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80',
    'Mental Health': 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1920&q=80',
    'Society': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1920&q=80',
    'Unreal Engine': 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1920&q=80',
    'Unity': 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?auto=format&fit=crop&w=1920&q=80'
  };

  // Determine which image to use
  let finalBackgroundImage = backgroundImage;
  
  // If no background image is specified, use a category image
  if (!finalBackgroundImage) {
    // Try to use the first category from categories array if available
    if (categories && categories.length > 0) {
      finalBackgroundImage = categoryImages[categories[0]] || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80';
    } 
    // Fall back to single category if categories array is not available
    else if (category) {
      finalBackgroundImage = categoryImages[category] || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80';
    }
    // Default fallback
    else {
      finalBackgroundImage = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80';
    }
  }

  if (hasError) {
    return (
      <div className="post-header-fallback" role="banner">
        <h1>{title}</h1>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div 
        ref={containerRef}
        className={styles.parallaxContainer}
        role="banner"
        aria-label="Post header image"
      >
        <div 
          ref={parallaxRef}
          className={styles.parallaxBackground}
          style={{ 
            backgroundImage: `url(${finalBackgroundImage})`,
            backgroundPosition: '50% 50%'
          }}
          aria-hidden="true"
        />
        <div 
          className={styles.parallaxContent}
          aria-label="Post title"
        >
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.postMeta}>
            {date && <time className={styles.date}>{date}</time>}
            {/* Display category information */}
            {(() => {
              if (categories && categories.length > 0) {
                return <span className={styles.category}>{categories[0]}</span>;
              } else if (category) {
                return <span className={styles.category}>{category}</span>;
              }
              return null;
            })()}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

PostParallax.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string,
  category: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.string),
  backgroundImage: PropTypes.string
};

export default PostParallax;
