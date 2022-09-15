import {
  dirname,
  normalize,
  basename,
  extname,
  join as joinPath,
  isAbsolute,
} from 'pathe'

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

export interface Path {
  /**
   * Returns the extension of the path or undefined if the
   * path doesn't have a extension. Note that the extension
   * includes the dot prefix.
   * @example
   * // returns .ts
   * absolutePath('/project/src/index.ts').extension
   *
   * @example
   * // returns .ts
   * absolutePath('C:\\project\\src\\index.ts').extension
   */
  readonly extension?: string

  /**
   * Returns the path to the parent directory. In other words,
   * it removes the last component from the path.
   * @example
   * // returns /project/src
   * absolutePath('/project/src/index.ts').parentDirectory
   *
   * @example
   * // returns C:/project/src
   * absolutePath('C:\\project\\src\\index.ts').parentDirectory
   */
  readonly parentDirectory: string

  /**
   * Returns the last component of the path:
   * @example
   * // returns index.ts
   * absolutePath('/project/src/index.ts').basename
   *
   * @example
   * // returns index.ts
   * absolutePath('C:\\project\\src\\index.ts').basename
   */
  readonly basename: string

  /**
   * Returns the last component of the path without the extension.
   * @example
   * // returns index
   * absolutePath('/project/src/index.ts').basenameWithoutExtension
   *
   * @example
   * // returns index
   * absolutePath('C:\\project\\src\\index.ts').basenameWithoutExtension
   */
  readonly basenameWithoutExtension: string
}

export interface AbsolutePath extends Path {
  /**
   * The raw string representing the path.
   */
  readonly path: string

  /**
   * Returns the path relative to an absolute path.
   */
  relativeTo: (path: AbsolutePath) => RelativePath
}

export interface RelativePath extends Path {
  /**
   * The raw string representing the path.
   */
  readonly path: string

  /**
   * Appends a relative path to the current path.
   */
  appending: (path: RelativePath) => RelativePath
}

class AbsolutePathImplementation implements AbsolutePath {
  path: string
  constructor(path: string) {
    if (!isAbsolute(path)) {
      throw new InvalidAbsolutePathError(path)
    }
    this.path = normalize(path)
  }

  get extension(): string | undefined {
    const extension = extname(this.path)
    return extension === '' ? undefined : extension
  }

  get parentDirectory(): string {
    return dirname(this.path)
  }

  get basename(): string {
    return basename(this.path)
  }

  get basenameWithoutExtension(): string {
    return this.basename.split('.')[0]
  }

  relativeTo(path: AbsolutePath): RelativePath {
    return relativePath('')
  }
}

class RelativePathImplementation implements RelativePath {
  path: string
  constructor(path: string) {
    if (isAbsolute(path)) {
      throw new InvalidRelativePathError(path)
    }
    this.path = path
  }

  get extension(): string | undefined {
    const extension = extname(this.path)
    return extension === '' ? undefined : extension
  }

  get parentDirectory(): string {
    return dirname(this.path)
  }

  get basename(): string {
    return basename(this.path)
  }

  get basenameWithoutExtension(): string {
    return this.basename.split('.')[0]
  }

  appending(path: RelativePath): RelativePath {
    return new RelativePathImplementation(joinPath(this.path, path.path))
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
