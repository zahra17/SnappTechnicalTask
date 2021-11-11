module.exports = {
  setupFilesAfterEnv: ['jest-extended'],
  // collectCoverage: true,
  coverageDirectory: './coverage',
  testPathIgnorePatterns: ['<rootDir>/cypress/'],
  moduleNameMapper: {
    '\\.(c|sc|sa)ss$': 'identity-obj-proxy',
    '\\.(png|svg|pdf|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.js',
  },
}
