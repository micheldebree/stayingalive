#!/usr/bin/env node
import { readFile, writeFile, lstat, readdir } from 'node:fs/promises'
import sharp from 'sharp'
import path from 'path'
import {
  forEachCellIn,
  forEachCellRowIn,
  parseHiresByte,
  forEachCharIn,
  hamming
} from './graphics.mjs'

const threshold = 127
const charsetSize = 255
const supportedFormats = ['.png']

async function loadFile (filename) {
  return sharp(filename)
  .resize(320, 200)
  .removeAlpha()
  .greyscale()
  .normalise()
  // .median()
  // .threshold()
  .raw()
  .toBuffer({ resolveWithObject: true })
}

// char1 and char2 are arrays of 8 bytes
function distance (char1, char2) {
  let result = 0
  for (let i = 0; i < 8; i++) {
    result += hamming(char1[i], char2[i])
  }
  return result
}

// match char (8 byte arrat) on each of the chars (array of 8 bytes arrays)
// and return the index of the best fit
function match (char, chars) {
  return chars
  .map((c, i) => [i, distance(char, c)])
  .reduce((acc, val) => val[1] < acc[1] ? val : acc, [-1, Number.MAX_VALUE])[0]
}

function toFramebuf (screenCodes, name) {
  const framebuf = []
  for (let y = 0; y < 25; y++) {
    const row = []
    for (let x = 0; x < 40; x++) {
      const code = screenCodes[y * 40 + x]
      row.push({ code, color: 1 })
    }
    framebuf.push(row)
  }
  return {
    width: 40,
    height: 25,
    backgroundColor: 0,
    borderColor: 0,
    charset: 'upper',
    name,
    framebuf,
    customFonts: {}
  }
}

async function toPetmate (filename, screens) {

  const framebufs = screens.map((screen, i) => toFramebuf(screen, `screen_${i}`))
  const screenNumbers = Array.from(Array(screens.length).keys())

  const result = {
    version: 2,
    screens: screenNumbers,
    framebufs
  }

  await writeFile(filename, JSON.stringify(result))
  console.log(filename)
}

// async function saveCells (cells) {
//   await writeFile('tiles.bin', Uint8Array.from(cells.flat()))
// }

async function readChars (filename) {
  const buffer = await readFile(filename)

  // read only the first charset
  const charData = Uint8Array.from(buffer).slice(0, charsetSize * 8)

  const chars = []
  forEachCharIn(charData, (i, charBytes) => {
    chars.push(charBytes)
  })
  // console.log(`${chars.length} characters read from ${filename}`)
  return chars
}

async function convertFiles (filenames, charSet) {
  const screens = await Promise.all(filenames.map(async f => await convertFile(f, charSet)))
  await toPetmate('test.petmate', screens)
}

// returns an array of screencodes
async function convertFile (filename, charSet) {
  console.log(`Converting ${filename}`)
  const image = await loadFile(filename)
  // console.log(image.info)
  if (image.data.length !== 320 * 200 * image.info.channels) {
    throw new Error('Wrong number of bytes in input.')
  }

  const chars = []
  forEachCellIn(image, offset => {
    const char = []
    forEachCellRowIn(image, offset, offset => {
      char.push(parseHiresByte(image, offset, threshold))
    })
    chars.push(char)
  })

  // console.log(`${chars.length} cells parsed`)

  // map characters to best match in charSet
  return chars.map(c => match(c, charSet))
  // await toPetmate(`${filename}.petmate`, codes)

  // await saveCells(cells)
}

// convert a folder or a single filename to a list of filenames
async function toFilenames (inputName) {
  const stats = await lstat(inputName)
  if (stats.isFile()) {
    return [inputName]
  }
  if (stats.isDirectory()) {
    const filenames = await readdir(inputName)
    const filtered = filenames
    .filter(f => supportedFormats.includes(path.extname(f)))
    .map(f => path.join(inputName, f))
    if (filtered.length === 0) {
      throw new Error(
        `No files of type ${supportedFormats} found in ${inputName}`)
    }
    return filtered
  }
  throw new Error('Unsupported filetype')
}

(async function () {
  const inputName = process.argv[2]
  const filenames = await toFilenames(inputName)
  const charSet = await readChars('../res/characters.901225-01.bin')

  filenames.forEach(f => console.log(f))

  await convertFiles(filenames, charSet)
})()
