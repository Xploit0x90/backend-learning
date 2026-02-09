/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  // Resolve .js imports to .ts source (codebase uses .js in imports for ESM output)
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  // ignore test/helpers and controller specs that target old repository-based architecture
  testPathIgnorePatterns: [
    '<rootDir>/test/helpers/',
    '<rootDir>/test/event.controller.spec.ts',
    '<rootDir>/test/participant.controller.spec.ts',
    '<rootDir>/test/tag.controller.spec.ts',
  ],
  coveragePathIgnorePatterns: ['<rootDir>/test/helpers/'],
};
