# typed-file-system-path

[![typed-file-system-path](https://github.com/craftweg/typed-file-system-path/actions/workflows/typed-file-system-path.yml/badge.svg)](https://github.com/craftweg/typed-file-system-path/actions/workflows/typed-file-system-path.yml)

`typed-file-system-path` takes inspiration from [Path.swift](https://github.com/apple/swift-tools-support-core/blob/main/Sources/TSCBasic/Path.swift) in [swift-tools-support-core](https://github.com/apple/swift-tools-support-core/blob/main/Sources/TSCBasic/Path.swift) and provides typed primitives to work with file-system paths instead of strings.

## Usage

```ts
import { relativePath, absolutePath } from "typed-file-system-path"

// Initialize an absolute path
// Throws if the path is not absolute
const dirAbsolutePath = absolutePath("/path/to/dir")

// Initialize a relative path
// Throws if the path is not relative
const fileRelativePath = relativePath("./tsconfig.json")

/** Absolute path convenient functions **/


/** Relative path convenient functions **/
```


## Setup for development

1. Clone the repo: `git clone https://github.com/craftweg/typed-file-system-path`.
2. Install dependencies: `pnpm install`.
3. Build the project: `pnpm build`.
4. Test the project: `pnpm test`.


