import { test, expect, describe } from 'vitest'
import { relativePath } from './index.js'

describe('RelativePath', () => {
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
