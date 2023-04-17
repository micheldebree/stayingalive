#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import sharp from 'sharp'
import { toFilenames } from './utils.mjs'
import {
  forEachCellIn,
  forEachCellRowIn,
  parseHiresByte,
  forEachCharIn,
  hamming
} from './graphics.mjs'
import { toPetmate } from './petmate.mjs'

const threshold = 128
const charsetSize = 255
const cols = 40
const rows = 25
const width = cols * 8
const height = rows * 8
const supportedExtensions = ['.png']

// load and scale the image
async function loadFile (filename) {
  return sharp(filename)
    .resize(width, height)
    .removeAlpha()
    .greyscale()
    .normalise()
    // .median()
  // .threshold()
    .raw()
    .toBuffer({ resolveWithObject: true })
}

// measure 'distance' between two chars
// char1 and char2 are arrays of 8 bytes
function distance (char1, char2) {
  return char1.map((c, i) => hamming(c, char2[i])).reduce((acc, val) => acc + val, 0)
}

// match char (8 byte array) on each of the chars (array of 8 bytes arrays)
// and return the index of the best fit
function bestMatch (char, chars) {
  return chars
    .map((c, i) => [i, distance(char, c)])
    .reduce((acc, val) => val[1] < acc[1] ? val : acc, [-1, Number.MAX_VALUE])[0]
}

// async function saveCells (cells) {
//   await writeFile('tiles.bin', Uint8Array.from(cells.flat()))
// }

// read the characters from a binary character set
// return: an array of 8-byte arrays
async function readChars (filename) {
  const buffer = await readFile(filename)

  // read only the first charset
  const charData = Uint8Array.from(buffer).slice(0, charsetSize * 8)

  const chars = []
  forEachCharIn(charData, (i, charBytes) => chars.push(charBytes))
  return chars
}

// returns an array of screencodes
async function convertFile (filename, charSet) {
  console.log(`Converting ${filename}`)
  const image = await loadFile(filename)
  // console.log(image.info)
  if (image.data.length !== width * height * image.info.channels) {
    throw new Error('Wrong number of bytes in input.')
  }

  const chars = []
  forEachCellIn(image, offset => {
    const char = []
    forEachCellRowIn(image, offset, offset => char.push(parseHiresByte(image, offset, threshold)))
    chars.push(char)
  })

  // map characters to best match in charSet
  return chars.map(c => bestMatch(c, charSet))
}

(async function () {
  const inputName = process.argv[2]
  const filenames = await toFilenames(inputName, supportedExtensions)
  const charSet = await readChars('../res/characters.901225-01.bin')
  const screens = await Promise.all(filenames.map(async f => await convertFile(f, charSet)))
  await toPetmate(`${inputName}.petmate`, screens)
})()
