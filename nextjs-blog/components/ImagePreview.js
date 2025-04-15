import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './ImagePreview.module.css';

export default function ImagePreview({ src, alt, width, height, className = '', loading = 'lazy' }) {
  const [showModal, setShowModal] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    console.error(`Failed to load image: ${src}`);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        closeModal();
      }
    };
    if (showModal) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [showModal]);

  if (!src || !alt) {
    console.warn('ImagePreview requires src and alt props.');
    return null;
  }

  return (
    <>
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${styles.previewImage} ${className}`}
        onClick={openModal}
        onError={handleError}
        loading={loading}
        style={{ cursor: 'pointer' }}
        // Ensure no direct 'props.' access is used around here (line 53).
        // Example: If there was 'data-prop={props.someValue}', change it to
        // use a destructured prop if 'someValue' is passed in, or remove/refactor.
      />

      {showModal && (
        <div className={styles.modalOverlay} onClick={closeModal} role="dialog" aria-modal="true" aria-label={`Image preview: ${alt}`}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal} aria-label="Close image preview">
              &times;
            </button>
            <img src={imgSrc} alt={alt} className={styles.modalImage} onError={handleError} />
          </div>
        </div>
      )}
    </>
  );
}

ImagePreview.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
};