import React from 'react';

const TextWithHighlight = ({ text, highlight, className = '' }) => {
  if (!text) return null;
  
  // If no highlight term or it's empty, just return the text
  if (!highlight || highlight.trim() === '') {
    return (
      <span 
        className={`text-with-highlight ${className}`}
        data-testid="text-with-highlight" 
        role="text" 
        aria-busy="false"
      >
        {text}
      </span>
    );
  }

  // Case insensitive matching
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span 
      className={`text-with-highlight ${className}`}
      data-testid="text-with-highlight" 
      role="text" 
      aria-busy="false"
    >
      {parts.map((part, i) => (
        regex.test(part) ? (
          <span key={i} data-testid="highlight" className="highlighted">
            {part}
          </span>
        ) : (
          part
        )
      ))}
    </span>
  );
};

export default TextWithHighlight;