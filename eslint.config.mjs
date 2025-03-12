// eslint.config.mjs
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
// Next.js ESLint config is imported via FlatCompat.extends
import globals from 'globals';
import { FlatCompat } from '@eslint/eslintrc';

// Initialize the compatibility helper.
const compat = new FlatCompat({
  baseDirectory: new URL('.', import.meta.url).pathname, // Using URL API instead of import.meta.dir
  // Don't use eslint.configs.recommended as it might not be available in all ESLint versions
});

export default [
  // Configuration for JavaScript files (including next.config.js)
  {
    files: ['**/*.js', 'next.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  ...compat.extends(
    'next/core-web-vitals',
    'airbnb',
    'airbnb/hooks',
    'prettier',
    'plugin:@typescript-eslint/recommended'
  ),
  {
    files: ['**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react,
      '@typescript-eslint': typescriptEslint,
      prettier,
      'jsx-a11y': jsxA11y,
      // next plugin is not needed as we're using eslint-config-next
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          moduleDirectory: ['node_modules', '.'],
        },
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-props-no-spreading': 'off',
      'import/prefer-default-export': 'off',
      'no-param-reassign': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'react/jsx-filename-extension': [
        1,
        { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      ],
      'react/function-component-definition': [
        2,
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      '@typescript-eslint/no-unused-vars': ['error'],
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['hrefLeft', 'hrefRight'],
          aspects: ['invalidHref', 'preferButton'],
        },
      ],
    },
    ignores: ['node_modules/'],
  },
  {
    files: ['eslint.config.js'],
    rules: {
      'no-console': 'off',
    },
  },
];
