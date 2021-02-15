// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
	projects: [
	  {
		preset: 'ts-jest',
		displayName: 'test',
		clearMocks: true,
		collectCoverage: true,
		collectCoverageFrom: ['src/**/*.ts'],
		coverageDirectory: 'coverage',
		coverageReporters: ['lcov'],
		testEnvironment: 'node',
	  },
	],
  }