import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['src/controllers/**/authController.ts','src/services/**/authService.ts', "src/repositories/userRepository.ts"], // เก็บ coverage เฉพาะ controller ก็ได้
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  testPathIgnorePatterns: ['/node_modules/'],
};

export default config;
