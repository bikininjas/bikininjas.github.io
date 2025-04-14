import { useState } from 'react';
import ErrorBoundary from './ErrorBoundary';

export default function SocialShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const shareTargets = [
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      icon: '🐦'
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      icon: '📘'
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      icon: '💼'
    }
  ];

  return (
    <ErrorBoundary>
      <div 
        className="social-share-buttons"
        role="group"
        aria-label="Share this article"
      >
        {shareTargets.map(({ name, url: shareUrl, icon }) => (
          <button
            key={name}
            onClick={() => window.open(shareUrl, '_blank', 'noopener,noreferrer')}
            aria-label={`Share on ${name}`}
            className="share-button"
          >
            {icon}
          </button>
        ))}
        <button
          onClick={handleCopy}
          aria-label="Copy link to clipboard"
          className="copy-button"
          aria-pressed={copied}
        >
          {copied ? '✅' : '📋'}
        </button>
      </div>
      <div role="status" aria-live="polite" className="sr-only">
        {copied && 'Link copied to clipboard'}
      </div>
    </ErrorBoundary>
  );
}