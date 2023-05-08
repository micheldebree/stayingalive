#!/usr/bin/env node

// ways to add color:
//
// 1. Shape
// - determine background color (quantize image, count nr occurences per color)
// - subtract background color from tile, match remaining 'on' pixels to
// character
// - average remaining 'on' pixels color and quantize to color
//
// --> for tiles with no background color, this will result in block character
//
// 2. Luminace
// - calculate 'luminance'
// - determine background color (quantize image, count nr occurences per color)
// - quantize tile
// - subtract background color from tile
// - determine tile luminance from remaining pixels
// - get closest color for remaining pixels
// -

// Types:
// - pixel: [r, g, b]
// - color: same as pixel, but not part of a particular image
// - tile: an 8x8 pixel area, 8 rows of 8 [r, g, b] pixels
// - row: 8 pixels, corresponding to a bitmap byte

import sharp from 'sharp'
import {toFilenames, relativePath} from './utils.mjs'
import {
  readChars,
  forEachCellIn,
  forEachCellRowIn,
  parseHiresByte,
  hamming, parse8pixelRow, parseHiresByteFromPixelRow, countBits
} from './graphics.mjs'
import {toPetmate} from './petmate.mjs'

const threshold = 128
const allChars = Array(255).fill(0).map((c, i) => i)
// const supportedChars = allChars
const supportedChars = allChars.slice(64, 128).concat(allChars.slice(192, 256))
const cols = 40
const rows = 25
const width = cols * 8
const height = rows * 8
const supportedExtensions = ['.png', '.jpg']

// load and scale the image
async function loadFile(filename) {
  return sharp(filename)
  .resize(width, height)
  .removeAlpha()
  .greyscale()
  .normalise()
  .raw()
  .toBuffer({resolveWithObject: true})
}

// return the number of bits set in char in range [0..255]
function luminanceOfChar(char) {
  return char
      .map(byte => countBits(byte))
      .reduce((a, v) => a + v, 0)
      * 4
}

// return the average channel value for a tile in range [0..255]
function luminanceOfTile(tile) {
  const pixels = tile.flat()
  const sum = pixels
  .map(p => p[0])
  .reduce((a, v) => a + v, 0)
  return sum / pixels.length
}

// measure hamming distance between two chars
// char1 and char2 are arrays of 8 bytes
function distance(tile, char) {
  // convert tile to hires char. row is 8 x [r, g, b]
  const tileChar = tile.map(row => parseHiresByteFromPixelRow(row))
  return char.map((c, i) => hamming(c, tileChar[i])).reduce(
      (acc, val) => acc + val, 0)
}

// match char (8 byte array) on each of the supported chars (array of 8 bytes arrays)
// and return the index of the best fit
function bestMatch(tile, chars) {
  return supportedChars
  .map(i => [i, distance(tile, chars[i])])
  .reduce((acc, val) => val[1] < acc[1] ? val : acc, [-1, Number.MAX_VALUE])[0]
}

// cut sharpImage in 8x8 pixel tiles, this is a three dimensional array:
// 8 rows of 8 pixels of [r, g, b]
function cutIntoTiles(sharpImage) {
  const tiles = []
  // TODO: generate array of offsets and use map
  forEachCellIn(sharpImage, offset => {
    const tile = []
    forEachCellRowIn(sharpImage, offset,
        offset => tile.push(parse8pixelRow(sharpImage, offset)))
    tiles.push(tile)
  })
  return tiles
}

// convert an image file to a 40x25 array of screencodes
async function convertFile(filename, charSet) {
  const image = await loadFile(filename)

  const tiles = cutIntoTiles(image)
  // map tiles to best match in charSet
  return tiles.map(c => bestMatch(c, charSet))
}

(async function () {
  const inputName = process.argv[2]
  const filenames = await toFilenames(inputName, supportedExtensions)
  const charSet = await readChars(relativePath('./characters.901225-01.bin'))
  const screens = await Promise.all(filenames.map(f => convertFile(f, charSet)))
  await toPetmate(`${inputName}.petmate`, screens)
})()
