import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostContent from '../../components/PostContent';

describe('PostContent Component', () => {
  it('renders HTML content correctly', () => {
    const htmlContent = '<p>Test content</p>';
    const { container } = render(<PostContent content={htmlContent} />);
    
    expect(container.querySelector('p')).toBeInTheDocument();
    expect(container.querySelector('p')).toHaveTextContent('Test content');
  });

  it('renders complex HTML with multiple elements', () => {
    const complexHtml = `
      <h2>Test Heading</h2>
      <p>Paragraph 1</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    `;
    
    const { container } = render(<PostContent content={complexHtml} />);
    
    expect(container.querySelector('h2')).toBeInTheDocument();
    expect(container.querySelector('h2')).toHaveTextContent('Test Heading');
    expect(container.querySelector('p')).toBeInTheDocument();
    expect(container.querySelector('p')).toHaveTextContent('Paragraph 1');
    expect(container.querySelectorAll('li').length).toBe(2);
  });

  it('renders embedded content correctly', () => {
    const embedHtml = `
      <div class="embed-container video-container">
        <lite-youtube videoid="test123"></lite-youtube>
      </div>
    `;
    
    const { container } = render(<PostContent content={embedHtml} />);
    
    expect(container.querySelector('.embed-container')).toBeInTheDocument();
    expect(container.querySelector('.video-container')).toBeInTheDocument();
    expect(container.querySelector('lite-youtube')).toBeInTheDocument();
    expect(container.querySelector('lite-youtube')).toHaveAttribute('videoid', 'test123');
  });
});
