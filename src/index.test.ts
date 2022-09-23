import { test, expect, describe } from 'vitest'
import {
  relativePath,
  absolutePath,
  InvalidAbsolutePathError,
  InvalidRelativePathError,
} from './index.js'

describe('AbsolutePath', () => {
  test('toString returns the right value', () => {
    // Given
    const path = absolutePath('/project')

    // When
    const got = path.toString()

    // Then
    expect(got).toEqual('/project')
  })

  test.each([['relative/path'], ['relative\\path']])(
    "throws an error if it's initialized with the relative path %s",
    (relativePath) => {
      // When
      expect(() => {
        absolutePath(relativePath)
      }).to.toThrowError(new InvalidAbsolutePathError(relativePath))
    }
  )

  test.each([
    ['.ts', '/project/src/index.ts'],
    ['.ts', 'C:\\project\\src\\index.ts'],
    [undefined, '/project/src/index'],
  ])('extension returns %s when the path is %s', (extension, testPath) => {
    expect(absolutePath(testPath).extension).toEqual(extension)
  })

  test.each([
    ['/project/src', '/project/src/index.ts'],
    ['C:/project/src', 'C:\\project\\src\\index.ts'],
  ])(
    'parentDirectory returns %s when the path is %s',
    (parentDirectory, testPath) => {
      expect(absolutePath(testPath).parentDirectory).toEqual(parentDirectory)
    }
  )

  test.each([
    ['index', '/project/src/index.ts'],
    ['index', 'C:\\project\\src\\index.ts'],
  ])('basename returns %s when the path is %s', (basename, testPath) => {
    expect(absolutePath(testPath).basenameWithoutExtension).toEqual(basename)
  })

  test.each([
    [true, '/'],
    [false, '/project'],
    [true, 'C:\\'],
    [false, 'C:\\project'],
  ])('isRoot returns %s when the path is %s', (isRoot, testPath) => {
    expect(absolutePath(testPath).isRoot).toEqual(isRoot)
  })

  test('appending returns the right value', () => {
    expect(
      absolutePath('/project').appending('src', 'index.ts').pathString
    ).toEqual('/project/src/index.ts')
    expect(
      absolutePath('/project').appending(relativePath('src/index.ts'))
        .pathString
    ).toEqual('/project/src/index.ts')
  })
})

describe('RelativePath', () => {
  test('toString returns the right value', () => {
    // Given
    const path = relativePath('project')

    // When
    const got = path.toString()

    // Then
    expect(got).toEqual('project')
  })

  test.each([['/relative/path', 'C:\\relative\\path']])(
    "throws an error if it's initialized with the absolute path %s",
    (testPath) => {
      // When
      expect(() => {
        relativePath(testPath)
      }).to.toThrowError(new InvalidRelativePathError(testPath))
    }
  )

  test.each([
    ['.ts', 'src/index.ts'],
    ['.ts', 'project\\src\\index.ts'],
    [undefined, 'src/index'],
  ])('extension returns %s when the path is %s', (extension, testPath) => {
    expect(relativePath(testPath).extension).toEqual(extension)
  })

  test.each([
    ['project/src', 'project/src/index.ts'],
    ['project/src', 'project\\src\\index.ts'],
  ])(
    'parentDirectory returns %s when the path is %s',
    (parentDirectory, testPath) => {
      expect(relativePath(testPath).parentDirectory).toEqual(parentDirectory)
    }
  )

  test.each([
    ['index', 'project/src/index.ts'],
    ['index', 'project\\src\\index.ts'],
  ])('basename returns %s when the path is %s', (basename, testPath) => {
    expect(relativePath(testPath).basenameWithoutExtension).toEqual(basename)
  })

  test('appending returns the right value', () => {
    expect(
      relativePath('project').appending('src', 'index.ts').pathString
    ).toEqual('project/src/index.ts')
    expect(
      relativePath('project').appending(relativePath('src/index.ts')).pathString
    ).toEqual('project/src/index.ts')
  })
})
