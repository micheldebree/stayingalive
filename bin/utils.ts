import { lstat, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'
import { Stats } from 'fs'

// Return the filename, or return the files in the folder if a folder is supplied
// inputName: name of a file or a folder
// supportedExtensions: array of strings of extensions that are supported
export async function toFilenames (fileOrFolderName: string, supportedExtensions: string[]): Promise<string[]> {
  const stats: Stats = await lstat(fileOrFolderName)
  if (stats.isFile() && supportedExtensions.includes(path.extname(fileOrFolderName))) {
    return [fileOrFolderName]
  }
  if (stats.isDirectory()) {
    const filenames: string[] = await readdir(fileOrFolderName)
    const filtered: string[] = filenames
      .filter(f => supportedExtensions.includes(path.extname(f)))
      .map(f => path.join(fileOrFolderName, f))
    if (filtered.length === 0) {
      throw new Error(
          `No files of type ${supportedExtensions} found in ${fileOrFolderName}`)
    }
    return filtered
  }
  throw new Error(`Unsupported filetype: ${fileOrFolderName}`)
}

// get a path relative to this module
export function relativePath (filename: string): string {
  const __filename: string = fileURLToPath(import.meta.url)
  const __dirname: string = path.dirname(__filename)
  return path.join(__dirname, filename)
}
