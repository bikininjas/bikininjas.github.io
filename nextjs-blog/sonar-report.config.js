module.exports = {
  reportPath: 'coverage',
  reportFile: 'sonar-report.xml',
  indent: 2,
  sonar56x: true,
  relativePaths: true,
  coverageDirectory: './coverage',
  backslashReplacementsEnabled: true,
  log: 'info',
  sources: [
    'components',
    'lib',
    'pages',
    'styles',
    'utils'
  ],
  exclusions: [
    'node_modules/**',
    '.next/**',
    'out/**',
    'coverage/**',
    'tests/**',
    'cypress/**',
    'playwright/**',
    '**/*.test.js',
    '**/*.spec.js',
    '**/*.cy.js'
  ]
};
