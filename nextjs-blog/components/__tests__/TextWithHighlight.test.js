import React from 'react';
import { render, screen } from '@testing-library/react';
import TextWithHighlight from '../TextWithHighlight';

describe('TextWithHighlight', () => {
  it('renders text without highlight when no highlight term is provided', () => {
    render(<TextWithHighlight text="This is a test text" />);
    
    expect(screen.getByText('This is a test text')).toBeInTheDocument();
    expect(screen.queryByTestId('highlight')).not.toBeInTheDocument();
  });

  it('renders text with highlighted term when highlight term matches', () => {
    render(<TextWithHighlight text="This is a test text" highlight="test" />);
    
    // The component should split the text and highlight the matching part
    const highlight = screen.getByTestId('highlight');
    expect(highlight).toBeInTheDocument();
    expect(highlight).toHaveTextContent('test');
  });

  it('handles case insensitive highlighting', () => {
    render(<TextWithHighlight text="This is a Test text" highlight="test" />);
    
    const highlight = screen.getByTestId('highlight');
    expect(highlight).toBeInTheDocument();
    expect(highlight.textContent.toLowerCase()).toBe('test');
  });

  it('highlights multiple occurrences of the term', () => {
    render(<TextWithHighlight text="Test this test again" highlight="test" />);
    
    const highlights = screen.getAllByTestId('highlight');
    expect(highlights).toHaveLength(2);
    expect(highlights[0].textContent.toLowerCase()).toBe('test');
    expect(highlights[1].textContent.toLowerCase()).toBe('test');
  });

  it('renders correctly when highlight term is not found', () => {
    render(<TextWithHighlight text="This is a text" highlight="not-found" />);
    
    expect(screen.getByText('This is a text')).toBeInTheDocument();
    expect(screen.queryByTestId('highlight')).not.toBeInTheDocument();
  });

  it('handles empty text gracefully', () => {
    render(<TextWithHighlight text="" highlight="test" />);
    
    // Should render an empty container
    const container = screen.getByTestId('text-with-highlight') || document.querySelector('.text-container');
    expect(container).toBeInTheDocument();
    expect(container.textContent).toBe('');
  });
});
