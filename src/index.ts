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
  readonly pathString: string

  /**
   * Returns true if the path represents a root directory.
   * @example
   * // returns true
   * absolutePath('/').isRoot
   * @example
   * // returns false
   * absolutePath('/project').isRoot
   */
  readonly isRoot: boolean

  /**
   * Appends a relative path to the current absolute path.
   * @example
   * // returns absolutepath('/project/src/index.ts')
   * absolutePath('/project').appending("src", "index.ts")
   *
   * @example
   * // returns absolutepath('/project/src/index.ts')
   * absolutePath('/project').appending(relativePath("src/index.ts"))
   */
  appending: <T extends string | RelativePath>(...path: T[]) => AbsolutePath
}

export interface RelativePath extends Path {
  /**
   * The raw string representing the path.
   */
  readonly pathString: string

  /**
   * Appends a relative path to the current relative path.
   * @example
   * // returns absolutepath('project/src/index.ts')
   * relativePath('project').appending("src", "index.ts")
   *
   * @example
   * // returns relativePath('project/src/index.ts')
   * relativePath('project').appending(relativePath("src/index.ts"))
   */
  appending: <T extends string | RelativePath>(...path: T[]) => RelativePath
}

class AbsolutePathImplementation implements AbsolutePath {
  pathString: string
  constructor(path: string) {
    if (!isAbsolute(path)) {
      throw new InvalidAbsolutePathError(path)
    }
    this.pathString = normalize(path)
  }

  toString(): string {
    return `AbsolutePath(${this.pathString})`
  }

  get extension(): string | undefined {
    const extension = extname(this.pathString)
    return extension === '' ? undefined : extension
  }

  get parentDirectory(): string {
    return dirname(this.pathString)
  }

  get basename(): string {
    return basename(this.pathString)
  }

  get isRoot(): boolean {
    // Strips out the C: prefix in Windows paths
    const regex = /^([A-Z]:)?(?<path>.+)$/
    return this.pathString.match(regex)?.groups?.path === '/'
  }

  get basenameWithoutExtension(): string {
    return this.basename.split('.')[0]
  }

  appending<T extends string | RelativePath>(...paths: T[]): AbsolutePath {
    const pathComponents = paths.map((path) => {
      if (typeof path === 'string') {
        return path
      } else {
        return path.pathString
      }
    })
    return new AbsolutePathImplementation(
      joinPath(this.pathString, ...pathComponents)
    )
  }
}

class RelativePathImplementation implements RelativePath {
  pathString: string
  constructor(path: string) {
    if (isAbsolute(path)) {
      throw new InvalidRelativePathError(path)
    }
    this.pathString = path
  }

  toString(): string {
    return `RelativePath(${this.pathString})`
  }

  get extension(): string | undefined {
    const extension = extname(this.pathString)
    return extension === '' ? undefined : extension
  }

  get parentDirectory(): string {
    return dirname(this.pathString)
  }

  get basename(): string {
    return basename(this.pathString)
  }

  get basenameWithoutExtension(): string {
    return this.basename.split('.')[0]
  }

  appending<T extends string | RelativePath>(...paths: T[]): RelativePath {
    const pathComponents = paths.map((path) => {
      if (typeof path === 'string') {
        return path
      } else {
        return path.pathString
      }
    })
    return new RelativePathImplementation(
      joinPath(this.pathString, ...pathComponents)
    )
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
