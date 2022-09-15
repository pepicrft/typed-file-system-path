import { test, it, expect, describe } from 'vitest'
import {
  relativePath,
  absolutePath,
  InvalidAbsolutePathError,
  InvalidRelativePathError,
} from './index.js'

describe('AbsolutePath', () => {
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
  ])('dirname returns %s when the path is %s', (dirname, testPath) => {
    expect(absolutePath(testPath).dirname).toEqual(dirname)
  })

  test.each([
    ['index', '/project/src/index.ts'],
    ['index', 'C:\\project\\src\\index.ts'],
  ])('basename returns %s when the path is %s', (basename, testPath) => {
    expect(absolutePath(testPath).basenameWithoutExtension).toEqual(basename)
  })
})

describe('RelativePath', () => {
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
  ])('dirname returns %s when the path is %s', (dirname, testPath) => {
    expect(relativePath(testPath).dirname).toEqual(dirname)
  })

  test.each([
    ['index', 'project/src/index.ts'],
    ['index', 'project\\src\\index.ts'],
  ])('basename returns %s when the path is %s', (basename, testPath) => {
    expect(relativePath(testPath).basenameWithoutExtension).toEqual(basename)
  })

  test('appending appends the new relative path', () => {
    // Given
    const first = relativePath('first')
    const second = relativePath('second')

    // When
    const got = first.appending(second)

    // Then
    expect(got.path).toEqual('first/second')
  })
})
