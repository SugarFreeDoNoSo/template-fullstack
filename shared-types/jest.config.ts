export default {
  displayName: 'shared-types',
  preset: '../jest.preset.js',
  testEnvironment: 'node',
  setupFiles: ['reflect-metadata'],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../coverage/shared-types',
};
