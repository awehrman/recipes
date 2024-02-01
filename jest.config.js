/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.+(ts|js)', '**/?(*.)+(spec|test).+(ts|js)'],
  moduleDirectories: ['node_modules', 'src'],
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{js,ts}', '!**/*.d.ts'],
  modulePathIgnorePatterns: ['<rootDir>/lib/'],
  transform: {
    '^.+\\.(js|ts)$': [
      'babel-jest',
      { configFile: './babel.config.testing.js' }
    ]
  }
};
