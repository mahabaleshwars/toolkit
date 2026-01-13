import {Globber, DefaultGlobber} from './internal-globber'
import {GlobOptions} from './internal-glob-options'
import {HashFileOptions} from './internal-hash-file-options'
import {hashFiles as _hashFiles} from './internal-hash-files'

export {Globber, GlobOptions, HashFileOptions}

/**
 * Constructs a globber
 *
 * @param patterns  Patterns separated by newlines
 * @param options   Glob options
 */
export async function create(
  patterns: string,
  options?: GlobOptions
): Promise<Globber> {
  return await DefaultGlobber.create(patterns, options)
}

/**
 * Computes the sha256 hash of a glob pattern
 *
 * @param patterns  Patterns separated by newlines
 * @param options   Glob and hash options
 * @param currentWorkspace  Workspace for matching (deprecated, use options.workingDirectory)
 * @param verbose   Enables verbose logging
 */
export async function hashFiles(
  patterns: string,
  currentWorkspace?: string,
  options?: HashFileOptions
): Promise<string> {
  let followSymbolicLinks = true
  if (options && typeof options.followSymbolicLinks === 'boolean') {
    followSymbolicLinks = options.followSymbolicLinks
  }

  // If workingDirectory is specified, use it to adjust patterns
  const workingDir = options?.workingDirectory
  let adjustedPatterns = patterns

  if (workingDir) {
    // Adjust patterns to be relative to working directory
    const path = require('path')
    adjustedPatterns = patterns
      .split('\n')
      .filter(p => p.trim())
      .map(p => {
        // If pattern is already absolute, use as-is
        if (path.isAbsolute(p)) {
          return p
        }
        // Otherwise, join with working directory
        return path.join(workingDir, p)
      })
      .join('\n')
  }

  const globber = await create(adjustedPatterns, {followSymbolicLinks})

  // Pass options to internal hash function
  return _hashFiles(globber, currentWorkspace || '', false, {
    allowOutsideWorkspace: !!workingDir,
    customWorkspace: workingDir
  })
}
