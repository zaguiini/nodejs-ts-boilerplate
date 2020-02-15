const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('./tsconfig')

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: ['./'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
}
