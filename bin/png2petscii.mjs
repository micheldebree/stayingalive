#!/usr/bin/env node
import sharp from 'sharp'
import { toFilenames, relativePath } from './utils.mjs'
import {
  readChars,
  forEachCellIn,
  forEachCellRowIn,
  parseHiresByte,
  hamming
} from './graphics.mjs'
import { toPetmate } from './petmate.mjs'

const threshold = 128
const allChars = Array(255).fill(0).map((c, i) => i)
const supportedChars = allChars
// const supportedChars = allChars.slice(64, 128).concat(allChars.slice(192, 256))
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
    .raw()
    .toBuffer({ resolveWithObject: true })
}

// measure hamming distance between two chars
// char1 and char2 are arrays of 8 bytes
function distance (char1, char2) {
  return char1.map((c, i) => hamming(c, char2[i])).reduce((acc, val) => acc + val, 0)
}

// match char (8 byte array) on each of the supported chars (array of 8 bytes arrays)
// and return the index of the best fit
function bestMatch (char, chars) {
  return supportedChars
    .map(i => [i, distance(char, chars[i])])
    .reduce((acc, val) => val[1] < acc[1] ? val : acc, [-1, Number.MAX_VALUE])[0]
}

// convert an image file to a 40x25 array of screencodes
async function convertFile (filename, charSet) {
  const image = await loadFile(filename)
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
  const charSet = await readChars(relativePath('./characters.901225-01.bin'))
  const screens = await Promise.all(filenames.map(f => convertFile(f, charSet)))
  await toPetmate(`${inputName}.petmate`, screens)
})()
