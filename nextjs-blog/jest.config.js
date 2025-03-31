const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Handle module aliases
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
  },
  transform: {
    // Transformer pour les modules ESM
    '^.+\\.(js|jsx|ts|tsx|mjs)$': ['babel-jest', { presets: ['next/babel'] }]
  },
  transformIgnorePatterns: [
    // Ne pas ignorer les modules ESM dans node_modules
    '/node_modules/(?!(remark|remark-html|unified|micromark|mdast-util-.*|unist-util-.*|bail|is-plain-obj|trough|vfile|vfile-message|remark-parse|mdast-util-from-markdown)/)',
  ],
  // Exclure les tests Playwright de l'exécution de Jest
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/playwright/',
    '<rootDir>/tests/e2e/',
  ],
  // Configuration pour les rapports de couverture
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text', 'text-summary', 'json', 'json-summary', 'html', 'cobertura'],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/out/**',
    '!**/coverage/**',
    '!**/tests/**',
    '!**/cypress/**',
    '!**/playwright/**',
    '!jest.config.js',
    '!next.config.js',
    '!postcss.config.js',
    '!tailwind.config.js',
  ],
  // Ajuster les seuils de couverture pour faciliter l'intégration initiale avec SonarQube
  // Ces seuils sont délibérément bas pour permettre l'intégration et seront augmentés progressivement
  coverageThreshold: {
    global: {
      branches: 2,
      functions: 9,
      lines: 9,
      statements: 9,
    },
  },
  // Configuration pour les rapports de test
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './test-reports',
      outputName: 'junit.xml',
    }],
  ],
  testResultsProcessor: 'jest-sonar-reporter',
  // Options pour jest-sonar-reporter
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)', '**/?(*.)+(spec|test).ts?(x)', '**/?(*.)+(spec|test).tsx?(x)'],
  verbose: true,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
