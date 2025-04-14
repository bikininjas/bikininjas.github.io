import React from 'react';

const Hero = ({ title, subtitle }) => {
  return (
    <div className="hero" data-testid="hero">
      <div className="hero-content">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
};

export default Hero;
