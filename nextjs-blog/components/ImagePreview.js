import React, { useState, useEffect, useRef } from 'react';
import styles from './ImagePreview.module.css';

const ImagePreview = ({ src, alt, ...props }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const modalOverlayRef = useRef(null);
  
  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  // Close on escape key press
  useEffect(() => {
    const handleEscPress = (e) => {
      if (isModalOpen && e.key === 'Escape') {
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleEscPress);
    return () => window.removeEventListener('keydown', handleEscPress);
  }, [isModalOpen]);
  
  // Close on click outside
  useEffect(() => {
    if (!isModalOpen) return;
    
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target) && 
          modalOverlayRef.current && modalOverlayRef.current.contains(e.target)) {
        closeModal();
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isModalOpen]);
  
  return (
    <>
      <img 
        src={src} 
        alt={alt} 
        loading="lazy"
        onClick={() => setIsModalOpen(true)} 
        {...props} 
      />
      
      {isModalOpen && (
        <div 
          className={`image-modal ${isModalOpen ? 'open' : ''}`}
          data-testid="image-modal" 
          role="dialog"
          aria-modal="true"
          aria-labelledby="image-preview-title"
        >
          <button 
            className={styles.closeButton} 
            onClick={closeModal}
            aria-label="Close image preview"
          >
            &times;
          </button>
          <img 
            src={src} 
            alt={alt} 
            className={styles.modalImage} 
          />
        </div>
      )}
    </>
  );
};

export default ImagePreview;