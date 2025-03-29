import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ParallaxHero.module.css';

const PostParallax = ({ title, date, category, backgroundImage }) => {
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
  if (!finalBackgroundImage && category) {
    finalBackgroundImage = categoryImages[category] || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&q=80';
  }

  return (
    <div className={styles.parallaxContainer}>
      <div 
        className={styles.parallaxBackground}
        style={{ 
          backgroundImage: `url(${finalBackgroundImage})`,
          transform: `translateY(${offset * 0.3}px)`,
          backgroundPosition: '50% 50%'
        }}
      />
      <div className={styles.parallaxContent}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.postMeta}>
          {date && <time className={styles.date}>{date}</time>}
          {category && <span className={styles.category}>{category}</span>}
        </div>
      </div>
    </div>
  );
};

PostParallax.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string,
  category: PropTypes.string,
  backgroundImage: PropTypes.string
};

export default PostParallax;
