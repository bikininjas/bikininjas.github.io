import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ParallaxHero.module.css';

const ParallaxHero = ({ title, subtitle, backgroundImage }) => {
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

  return (
    <div className={styles.parallaxContainer}>
      <div 
        className={styles.parallaxBackground}
        style={{ 
          backgroundImage: `url(${backgroundImage || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'})`,
          transform: `translateY(${offset * 0.3}px)`,
          backgroundPosition: '50% 50%'
        }}
      />
      <div className={styles.parallaxContent}>
        <h1 className={styles.title}>{title || 'BikiNinjas'}</h1>
        <p className={styles.subtitle}>{subtitle || 'Gaming, Development & Digital Wellbeing'}</p>
      </div>
    </div>
  );
};

ParallaxHero.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  backgroundImage: PropTypes.string
};

export default ParallaxHero;
