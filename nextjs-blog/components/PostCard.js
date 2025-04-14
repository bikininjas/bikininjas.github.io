import { useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import ErrorBoundary from './ErrorBoundary';
import styles from '../styles/Card.module.css';

export default function PostCard({ post }) {
  const { id, date, title, excerpt, categories, coverImage } = post;
  const [isHovered, setIsHovered] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleImageError = () => {
    setHasImageError(true);
  };

  const defaultImage = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=60';

  // Default images for different categories if no specific cover image is provided
  const categoryImages = {
    'IA': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    'Développement de Jeux': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    'Jeux Vidéo': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    'Technologie': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    'Modding': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    'Santé Mentale': 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=800&q=80',
    'Société': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    'Unreal Engine': 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=800&q=80',
    'Unity': 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?auto=format&fit=crop&w=800&q=80',
    // Ajout des catégories en français pour assurer la compatibilité
    'Game Development': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    'Gaming': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    'Tech': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    'Mental Health': 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=800&q=80',
    'AI': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80'
  };
  
  // Determine which image to use
  let backgroundImage = coverImage;
  
  // If no cover image is specified, use a category image
  if (!backgroundImage && categories && categories.length > 0) {
    // Try to find an image for the first category that has a matching image
    for (const category of categories) {
      if (categoryImages[category]) {
        backgroundImage = categoryImages[category];
        break;
      }
    }
  }
  
  // If still no image, use a default
  if (!backgroundImage) {
    backgroundImage = defaultImage;
  }

  return (
    <ErrorBoundary>
      <article 
        className={`${styles.card} ${isHovered ? styles.hovered : ''} ${backgroundImage ? styles.cardWithBg : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={backgroundImage ? { 
          '--bg-image': `url(${backgroundImage})` 
        } : {}}
      >
        <Link 
          href={`/posts/${id}`}
          aria-label={`Read more about ${title}`}
          className={styles.cardLink}
        >
          <div className={styles.cardImageContainer}>
            <img
              src={hasImageError ? defaultImage : (backgroundImage || defaultImage)}
              alt={`Featured image for ${title}`}
              className={styles.cardImage}
              onError={handleImageError}
              loading="lazy"
            />
          </div>
          <div className={styles.cardContent}>
            {categories && categories.length > 0 && (
              <div className={styles.cardCategories}>
                {categories.slice(0, 2).map(category => (
                  <span key={category} className={styles.cardCategory}>
                    {category}
                  </span>
                ))}
              </div>
            )}
            <h3 className={styles.cardTitle}>{title}</h3>
            <div className={styles.cardMeta}>
              <time 
                dateTime={date}
                aria-label={`Published on ${formattedDate}`}
                className={styles.cardDate}
              >
                {formattedDate}
              </time>
              {categories && categories.length > 0 && (
                <>
                  <span className={styles.separator} aria-hidden="true">•</span>
                  <span className={styles.category} aria-label={`Category: ${categories[0]}`}>
                    {categories[0]}
                  </span>
                </>
              )}
            </div>
            <p className={styles.cardExcerpt}>{excerpt}</p>
            <span 
              className={styles.readMore}
              aria-hidden="true"
            >
              Read more →
            </span>
          </div>
        </Link>
      </article>
    </ErrorBoundary>
  );
}

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string,
    categories: PropTypes.arrayOf(PropTypes.string),
    coverImage: PropTypes.string
  }).isRequired
};
