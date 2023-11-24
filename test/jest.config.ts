import { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '^src$': '<rootDir>/src',
    '^src/(.+)$': '<rootDir>/src/$1',
  },
  modulePathIgnorePatterns: ['src/typings'],
  testPathIgnorePatterns: [
    '/node_modules./',
    '<rootDir>/(coverage|dist|lib|tmp)./',
  ],
};

export default config;
