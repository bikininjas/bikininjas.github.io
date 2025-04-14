import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ImagePreview({ src, alt = '' }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsPreviewOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsPreviewOpen(true);
    }
  };

  return (
    <>
      <div
        className={`aspect-ratio-box cursor-pointer transition-transform duration-300 ${isHovered ? 'hover:scale-105' : ''}`}
        data-testid="image-preview"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={src}
          alt={alt}
          width={300}
          height={200}
          onClick={() => setIsPreviewOpen(true)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        />
      </div>

      {isPreviewOpen && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setIsPreviewOpen(false)}
        >
          <Image
            src={src}
            alt={`${alt} (preview)`}
            width={800}
            height={600}
            className="max-h-[90vh] w-auto"
          />
        </div>
      )}
    </>
  );
}