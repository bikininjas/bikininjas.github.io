import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
// Mock CSS import
vi.mock('../src/app/globals.css', () => ({}));
// Mock Next.js font loader
vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: 'geist-sans' }),
  Geist_Mono: () => ({ variable: 'geist-mono' })
}));
import Layout from '../src/app/layout';

describe('Layout', () => {
  it('renders children', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
