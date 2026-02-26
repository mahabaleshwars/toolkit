/**
 * Options to control file hashing behavior
 */
export interface HashFileOptions {
  /**
   * Indicates whether to follow symbolic links when globbing paths.
   *
   * @default true
   */
  followSymbolicLinks?: boolean

  /**
   * Custom working directory for pattern resolution.
   * When specified, patterns will be resolved relative to this directory
   * and files outside GITHUB_WORKSPACE can be hashed.
   * This is particularly useful for composite actions that need to hash
   * their own files (e.g., requirements.txt, package.json) for caching.
   *
   * @example
   * // In a composite action, hash files from the action's directory
   * hashFiles('requirements.txt', {
   *   workingDirectory: process.env.GITHUB_ACTION_PATH
   * })
   */
  workingDirectory?: string
}
