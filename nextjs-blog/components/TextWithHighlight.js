import { useRef, useEffect, useState } from 'react';
import ErrorBoundary from './ErrorBoundary';

export default function TextWithHighlight({ 
  text, 
  highlight, 
  className = '', 
  highlightClass = 'highlighted',
  onHighlight = () => {}
}) {
  const [isReady, setIsReady] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    try {
      if (!textRef.current || !highlight) return;

      const regex = new RegExp(`(${highlight})`, 'gi');
      const parts = text.split(regex);

      if (parts.length > 1) {
        const elements = parts.map((part, i) => {
          if (part.toLowerCase() === highlight.toLowerCase()) {
            return `<mark class="${highlightClass}" role="mark" aria-label="Highlighted text: ${part}">${part}</mark>`;
          }
          return part;
        });

        textRef.current.innerHTML = elements.join('');
        setIsReady(true);
        onHighlight(elements.filter(el => el.includes('mark')).length);
      } else {
        textRef.current.textContent = text;
        setIsReady(true);
        onHighlight(0);
      }
    } catch (error) {
      console.error('Error in TextWithHighlight:', error);
      if (textRef.current) {
        textRef.current.textContent = text;
      }
      setIsReady(true);
      onHighlight(0);
    }
  }, [text, highlight, highlightClass, onHighlight]);

  return (
    <ErrorBoundary>
      <span
        ref={textRef}
        className={`text-with-highlight ${className}`}
        aria-busy={!isReady}
        role="text"
      >
        {text}
      </span>
    </ErrorBoundary>
  );
}