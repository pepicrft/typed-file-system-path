import { dirname, join as joinPath } from 'pathe'

import { ExtendableError } from 'ts-error'

/**
 * It represents an error that's raied when an absolute path is initialized
 * with a path that's not absolute.
 */
export class InvalidAbsolutePathError extends ExtendableError {
  constructor(path: string) {
    super(`The following path is an invalid absolute path: ${path}`)
  }
}

/**
 * It represents an error that's raised when a relative path is initialized
 * with a path that's not relative.
 */
export class InvalidRelativePathError extends ExtendableError {
  constructor(path: string) {
    super(`The following path is an invalid relative path: ${path}`)
  }
}

interface AbsolutePath {
  /** Returns the path to the parent directory */
  readonly dirname: string

  /**
   * Returns the path relative to an absolute path.
   */
  relativeTo: (path: AbsolutePath) => RelativePath
}

interface RelativePath {
  /**
   * Appends a relative path to the current path.
   */
  appending: (path: RelativePath) => RelativePath
}

class AbsolutePathImplementation implements AbsolutePath {
  path: string
  constructor(path: string) {
    this.path = path
  }

  get dirname(): string {
    return dirname(this.path)
  }

  relativeTo(path: AbsolutePath): RelativePath {
    return relativePath('')
  }
}

class RelativePathImplementation implements RelativePath {
  path: string
  constructor(path: string) {
    this.path = path
  }

  appending(path: RelativePath): RelativePath {
    return joinPath(this.path, path)
  }
}

/**
 * It initializes an absolute path instance and returns it.
 * @param path {string} The absolute path represented by a string.
 * @returns Initialized absolte path.
 */
export const absolutePath = (path: string): AbsolutePath => {
  return new AbsolutePathImplementation(path)
}

/**
 * It initializes a relative path instance and returns it.
 * @param path {string} The relative path represented by a string.
 * @returns Initialized relative path.
 */
export const relativePath = (path: string): RelativePath => {
  return new RelativePathImplementation(path)
}
