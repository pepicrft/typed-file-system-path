# typed-file-system-path

[![typed-file-system-path](https://github.com/craftweg/typed-file-system-path/actions/workflows/typed-file-system-path.yml/badge.svg)](https://github.com/craftweg/typed-file-system-path/actions/workflows/typed-file-system-path.yml)

`typed-file-system-path` takes inspiration from [Path.swift](https://github.com/apple/swift-tools-support-core/blob/main/Sources/TSCBasic/Path.swift) in [swift-tools-support-core](https://github.com/apple/swift-tools-support-core/blob/main/Sources/TSCBasic/Path.swift) and provides typed primitives to work with file-system paths instead of strings.

## Usage


```ts
import { relativePath, absolutePath } from "typed-file-system-path"

// Initialize an absolute path
// @throws InvalidAbsolutePathError if the path is not absolute.
const dirAbsolutePath = absolutePath("/path/to/dir")

// Initialize a relative path
// @throws InvalidRelativePathError if the path is not relative.
const fileRelativePath = relativePath("./tsconfig.json")

/** Functions common across absolute and relative paths **/
path.parentDirectory // The parent directory path
path.extension // The path extension or undefined otherwise
path.basename // The path's last component
path.basenameWithoutExtension // The path's last component without the extension

path.appending("src", "index.ts") // Returns a new path appending a relative path
path.appending("src/index.ts")
path.appending(relativePath("src/index.ts"))
```


## Setup for development

1. Clone the repo: `git clone https://github.com/craftweg/typed-file-system-path`.
2. Install dependencies: `pnpm install`.
3. Build the project: `pnpm build`.
4. Test the project: `pnpm test`.


