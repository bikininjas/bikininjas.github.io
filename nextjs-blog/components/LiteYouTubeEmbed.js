import { useEffect, useRef, useState } from 'react';

// Accept 'start' as a separate prop for convenience, but merge it into params
export default function LiteYouTubeEmbed({ id, title = '', params = {}, start }) {
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

    // Merge start prop into params if provided
    const finalParams = { autoplay: 1, ...params };
    if (start) {
      finalParams.start = start;
    }

    const params_str = Object.entries(finalParams)
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
      data-testid="lite-youtube-embed"
      // Add data-videoid attribute
      data-videoid={id}
      onClick={activate}
      onKeyDown={handleKeyDown}
      className="yt-lite"
      tabIndex={0}
      aria-label={`Play ${title}`}
    >
      {/* Play button SVG */}
      <svg viewBox="0 0 68 48" className="lyt-playbtn">
        <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.63-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#f00"></path>
        <path d="M 45,24 27,14 27,34" fill="#fff"></path>
      </svg>
      {/* Thumbnail image */}
      {isLoading && <div className="lyt-loading">Loading...</div>}
      {hasError && <div className="lyt-error">Error loading video</div>}
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        className="lyt-thumbnail"
        alt={`${title} thumbnail`}
        loading="lazy" // Add lazy loading
        onError={handleThumbnailError}
        onLoad={handleThumbnailLoad}
        // Ensure image is not focusable if it's decorative
        role="presentation"
      />
    </div>
  );
}