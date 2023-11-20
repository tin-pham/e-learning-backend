import { Config } from 'jest';
import sharedConfig from '../jest.config';

const config: Config = {
  ...sharedConfig,
  rootDir: '../../',
  coverageDirectory: '../../reports/coverage',
  coverageReporters: ['html', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!*/node_modules/**',
    '!src/main.ts',
    '!src/base/**/*.ts',
    '!src/common/**/*.ts',
    '!src/database/**/*.ts',
    '!src/migrations/**/*.ts',
    '!src/config/**/*.ts',
  ],
  reporters: [
    'default',
    'jest-sonar',
    [
      'jest-junit',
      {
        outputDirectory: 'reports/junit',
        outputName: 'test-results.xml',
      },
    ],
    [
      '@jest-performance-reporter/core',
      {
        errorAfterMs: 1000,
        warnAfterMs: 500,
        logLevel: 'warn',
        maxItems: 5,
        jsonReportPath: 'reports/performance-report.json',
        csvReportPath: 'reports/performance-report.csv',
      },
    ],
  ],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
};

export default config;
