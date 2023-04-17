import { lstat, readdir } from 'node:fs/promises'
import path from 'path'

// Return the filename, or return the files in the folder if a folder is supplied
// inputName: name of a file or a folder
// supportedExtensions: array of strings of extensions that are supported
export async function toFilenames (fileOrFolderName, supportedExtensions) {
  const stats = await lstat(fileOrFolderName)
  if (stats.isFile() && supportedExtensions.includes(path.extname(fileOrFolderName))) {
    return [fileOrFolderName]
  }
  if (stats.isDirectory()) {
    const filenames = await readdir(fileOrFolderName)
    const filtered = filenames
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
