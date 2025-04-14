/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SEO from '../../components/SEO';

// Mock next/head
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }) => <div data-testid="head">{children}</div>,
  }
});

describe('SEO Component', () => {
  const defaultProps = {
    title: 'Test Page',
    description: 'Test description',
    canonical: 'https://example.com/test',
    ogImage: 'https://example.com/image.jpg'
  };

  const getAllMetaTags = (container) => {
    return container.querySelectorAll('meta');
  };

  const getMetaContent = (container, name) => {
    return container.querySelector(`meta[name="${name}"]`)?.getAttribute('content') ||
           container.querySelector(`meta[property="${name}"]`)?.getAttribute('content');
  };

  test('renders all required meta tags', () => {
    const { container } = render(<SEO {...defaultProps} />);
    const metaTags = getAllMetaTags(container);

    expect(container.querySelector('title')).toHaveTextContent('Test Page | BikinCode');
    expect(getMetaContent(container, 'description')).toBe(defaultProps.description);
    expect(getMetaContent(container, 'og:title')).toBe('Test Page | BikinCode');
    expect(getMetaContent(container, 'twitter:card')).toBe('summary_large_image');
  });

  test('handles missing title gracefully', () => {
    const { title, ...propsWithoutTitle } = defaultProps;
    const { container } = render(<SEO {...propsWithoutTitle} />);

    expect(container.querySelector('title')).toHaveTextContent('BikinCode');
  });

  test('sets noindex meta tag when specified', () => {
    const { container } = render(<SEO {...defaultProps} noindex={true} />);
    expect(getMetaContent(container, 'robots')).toBe('noindex,nofollow');
  });

  test('includes og:image tags when image is provided', () => {
    const { container } = render(<SEO {...defaultProps} />);
    
    expect(getMetaContent(container, 'og:image')).toBe(defaultProps.ogImage);
    expect(getMetaContent(container, 'og:image:alt')).toBe(`Image for ${defaultProps.title}`);
  });

  test('excludes og:image tags when no image is provided', () => {
    const { ogImage, ...propsWithoutImage } = defaultProps;
    const { container } = render(<SEO {...propsWithoutImage} />);
    
    expect(getMetaContent(container, 'og:image')).toBeUndefined();
    expect(getMetaContent(container, 'og:image:alt')).toBeUndefined();
  });

  test('sets correct og:type', () => {
    const { container } = render(<SEO {...defaultProps} ogType="article" />);
    expect(getMetaContent(container, 'og:type')).toBe('article');
  });

  test('sets default og:type to website', () => {
    const { container } = render(<SEO {...defaultProps} />);
    expect(getMetaContent(container, 'og:type')).toBe('website');
  });

  test('includes accessibility meta tags', () => {
    const { container } = render(<SEO {...defaultProps} />);
    
    expect(getMetaContent(container, 'viewport')).toBe('width=device-width, initial-scale=1');
    expect(container.querySelector('html')).toHaveAttribute('lang', 'en');
  });

  test('renders children components', () => {
    const { container } = render(
      <SEO {...defaultProps}>
        <meta name="custom" content="test" />
      </SEO>
    );

    expect(getMetaContent(container, 'custom')).toBe('test');
  });

  test('handles canonical URL', () => {
    const { container } = render(<SEO {...defaultProps} />);
    expect(container.querySelector('link[rel="canonical"]')).toHaveAttribute('href', defaultProps.canonical);
  });

  test('renders within error boundary', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    const { container } = render(
      <SEO {...defaultProps}>
        <ErrorComponent />
      </SEO>
    );

    expect(container.querySelector('title')).toBeInTheDocument();
  });
});