import { useState, useRef } from 'react';
import ErrorBoundary from './ErrorBoundary';

const SocialShareButtons = ({ url, title }) => {
  const [copyStatus, setCopyStatus] = useState('');
  const statusRef = useRef(null);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus('Link copied to clipboard!');
      
      // Clear the message after 3 seconds
      setTimeout(() => {
        setCopyStatus('');
      }, 3000);
    } catch (err) {
      setCopyStatus('Failed to copy link. Please try again.');
    }
  };

  const openSocialShare = (socialUrl) => {
    window.open(socialUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <ErrorBoundary>
      <div className="social-share-buttons" role="group" aria-label="Share this article">
        <button 
          className="share-button"
          aria-label="Share on Twitter"
          onClick={() => openSocialShare(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`)}
        >
          🐦
        </button>
        <button 
          className="share-button"
          aria-label="Share on Facebook"
          onClick={() => openSocialShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)}
        >
          📘
        </button>
        <button 
          className="share-button"
          aria-label="Share on LinkedIn"
          onClick={() => openSocialShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)}
        >
          💼
        </button>
        <button 
          className="copy-button"
          aria-label="Copy link to clipboard"
          aria-pressed={copyStatus === 'Link copied to clipboard!'}
          onClick={handleCopyLink}
        >
          📋
        </button>
      </div>
      <div 
        role="status" 
        aria-live="polite" 
        className={copyStatus ? "status-message" : "sr-only"}
        ref={statusRef}
      >
        {copyStatus}
      </div>
    </ErrorBoundary>
  );
};

export default SocialShareButtons;