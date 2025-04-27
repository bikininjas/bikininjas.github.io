import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        '**/jest.setup.ts',
        '**/vitest.setup.ts',
        '**/vitest.dts',
        '**/next.config.*',
        '**/playwright.config.*',
        '**/postcss.config.*',
        '**/__mocks__/**',
      ],
    },
    include: ['tests/**/*.test.{ts,tsx}'],
    mockReset: true,
  },
  resolve: {
    alias: {
      // Mock CSS imports to avoid PostCSS errors
      '\\.css$': './__mocks__/styleMock.js',
    },
  },
});
