import { Config } from 'jest';
import sharedConfig from '../jest.config';

const config: Config = {
  ...sharedConfig,
  rootDir: '../../',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};

export default config;
