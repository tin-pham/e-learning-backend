import { Config } from 'jest';
import sharedConfig from '../jest.config';

const config: Config = {
  ...sharedConfig,
  rootDir: '../../',
  coverageDirectory: 'reports/coverage',
  coverageReporters: ['text', 'lcov', 'cobertura'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!*/node_modules/**',
    '!src/main.ts',
    '!src/app.module.ts',
    '!src/base/**/*.ts',
    '!src/common/**/*.ts',
    '!src/database/**/*.ts',
    '!src/migrations/**/*.ts',
    '!src/**/*.repository.ts',
    '!src/**/*.controller.ts',
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
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};

export default config;
