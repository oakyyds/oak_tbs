import type { Config } from 'jest';
import { httpCall } from './src/http';

const config: Config = {
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2020',
        },
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: [
    '<rootDir>/**/*.test.{ts,js}'
  ],
  testEnvironment: 'node',
  moduleFileExtensions: [
    'ts',
    'js',
    'json',
    'node'
  ],
  moduleDirectories: [
    'node_modules',
    'src'
  ],
  globals: {
    httpCall,
  }
};

export default config;
