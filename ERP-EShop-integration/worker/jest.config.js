module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/*.ts'],
  roots: ["<rootDir>/src/"],
  setupFiles: ["<rootDir>/.jest/testEnvs.ts"],
  globalSetup: '<rootDir>/.jest/globalSetup.ts',
  setupFilesAfterEnv: ["<rootDir>/.jest/testLifecycle.ts"],
};
