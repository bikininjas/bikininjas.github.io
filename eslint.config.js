// eslint.config.js
import eslint from 'eslint';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import next from 'eslint-plugin-next';
import globals from 'globals';

export default [
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 'latest', // ou 2022, etc.
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json', // Ajustez le chemin si nécessaire
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
      next,
    },
    settings: {
      react: {
        version: 'detect', // Détecte automatiquement la version de React
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          moduleDirectory: ['node_modules', '.'],
        },
      },
    },
    rules: {
      ...eslint.configs['eslint:recommended'].rules,
      ...react.configs['jsx-runtime'].rules, // Ajout pour le nouveau runtime JSX
      ...react.configs['recommended'].rules,
      ...typescriptEslint.configs['recommended'].rules,
      ...next.configs['core-web-vitals'].rules,
      ...next.configs['recommended'].rules,
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
    // Configuration spécifique pour les fichiers de configuration (si nécessaire)
    files: ['eslint.config.js'],
    rules: {
      'no-console': 'off',
    },
  },
];
