import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ParallaxHero.module.css';

const ParallaxHero = ({ title = 'Welcome', subtitle = 'Explore our stories', backgroundImage }) => {
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
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
      };

      const handleResize = () => {
        if (containerRef.current) {
          containerRef.current.style.height = `${window.innerHeight / 2}px`;
        }
      };

      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);
      handleResize();

      return () => {
        observer.disconnect();
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    } catch (error) {
      setHasError(true);
      console.error('ParallaxHero error:', error);
    }
  }, [isInView]);

  if (hasError) {
    return (
      <div className="hero-fallback" role="banner">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={styles.parallaxContainer}
      data-testid="hero-container"
      role="banner"
      aria-label="Hero section"
    >
      <div
        ref={parallaxRef}
        className={styles.parallaxBackground}
        data-testid="hero-parallax"
        aria-hidden="true"
        style={{ 
          backgroundImage: `url(${backgroundImage || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'})`,
          transform: `translateY(${offset * 0.3}px)`,
          backgroundPosition: '50% 50%'
        }}
      />
      <div className={styles.parallaxContent}>
        <div className={styles.logoContainer}>
          <img 
            src="/images/bikininjas-logo.png" 
            alt="BikiNinjas Logo" 
            className={styles.logo}
          />
        </div>
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
