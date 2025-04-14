import { useEffect, useRef, useState } from 'react';

export default function LiteYouTubeEmbed({ id, title = '', params = {} }) {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Only run this effect in browser environments
    if (typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          containerRef.current?.classList.add('lyt-observed');
        }
      });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleThumbnailError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleThumbnailLoad = () => {
    setIsLoading(false);
  };

  const activate = () => {
    if (!containerRef.current || typeof document === 'undefined') return;
    
    containerRef.current.classList.add('lyt-activated');
    const iframe = document.createElement('iframe');
    iframe.title = title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;

    const params_str = Object.entries({ autoplay: 1, ...params })
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    iframe.src = `https://www.youtube.com/embed/${id}?${params_str}`;

    containerRef.current.append(iframe);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      activate();
    }
  };

  return (
    <div
      ref={containerRef}
      data-testid="lite-youtube"
      onClick={activate}
      onKeyDown={handleKeyDown}
      className="yt-lite"
      tabIndex={0}
      aria-label={`Play ${title}`}
    >
      {isLoading && <div className="lyt-loading">Loading...</div>}
      {hasError && <div className="lyt-error">Error loading video</div>}
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        className="lyt-thumbnail"
        alt={`${title} thumbnail`}
        onError={handleThumbnailError}
        onLoad={handleThumbnailLoad}
      />
    </div>
  );
}