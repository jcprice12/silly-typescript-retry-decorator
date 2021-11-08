/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
module.exports = {
  preset: 'ts-jest',
  rootDir: 'src',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: '../coverage',
  coverageProvider: 'babel',
  coverageReporters: ['lcov', 'text'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  coveragePathIgnorePatterns: ['<rootDir>/*.index.ts'],
  collectCoverageFrom: ['**/*.ts']
};
