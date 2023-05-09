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
import { toFilenames, relativePath } from './utils.mjs'
import {
  readChars,
  hamming,
  parse8pixelRow,
  parseHiresByteFromPixelRow,
  countBits,
  imageCoordinatesToByteOffset, cellOffsets, pixelLuminance
} from './graphics.mjs'
import { quantize2index } from './quantizer.mjs'
import { toPetmate } from './petmate.mjs'

const threshold = 128
const allChars = Array(255).fill(0).map((_c, i) => i)
const supportedChars = allChars
// const supportedChars = allChars.slice(64, 128).concat(allChars.slice(192, 256))
const cols = 40
const rows = 25
const width = cols * 8
const height = rows * 8
const supportedExtensions = ['.png', '.jpg']

// load and scale the image
async function loadFile (filename) {
  return sharp(filename)
    .resize(width, height)
    .removeAlpha()
    // .greyscale()
    .normalise()
    .median(4)
    .raw()
    .toBuffer({ resolveWithObject: true })
}

// return the number of bits set in char in range [0..255]
function luminanceOfChar (char) {
  if (char.length > 8) {
    throw new Error(`Too many bytes in char: ${char.length}`)
  }
  return char
    .map(byte => countBits(byte))
    .reduce((a, v) => a + v, 0) * 4
}

// return the average channel value for a tile in range [0..255]
function luminanceOfTile (tile) {
  const pixels = tile.flat()

  if (pixels.length > 64) {
    throw new Error(`Too many pixels in tile: ${pixels.length}`)
  }

  const sum = pixels
    .map(p => pixelLuminance(p))
    .reduce((a, v) => a + v, 0)
  return sum / pixels.length
}

function averageColorOfTile (tile) {
  const pixels = tile.flat()
  const sum = pixels
    .reduce((a, v) => [a[0] + v[0], a[1] + v[1], a[2] + v[2]], [0, 0, 0])
  return [sum[0] / pixels.length, sum[1] / pixels.length, sum[2] / pixels.length]
}

function combinedDistance (tile, char) {
  return hammingDistance(tile, char) * 6 + luminanceDistance(tile, char)
}

// measure hamming distance between two chars
// char1 and char2 are arrays of 8 bytes
function hammingDistance (tile, char) {
  // convert tile to hires char. row is 8 x [r, g, b]
  const tileChar = tile.map(row => parseHiresByteFromPixelRow(row))
  return char.map((c, i) => hamming(c, tileChar[i])).reduce(
    (acc, val) => acc + val, 0)
}
function luminanceDistance (tile, char) {
  const tileLuminance = luminanceOfTile(tile)
  const charLuminance = luminanceOfChar(char)

  if (tileLuminance > 255) {
    throw new Error('Tile luminance out of range:' + tileLuminance)
  }
  if (charLuminance > 256) {
    throw new Error('Char luminance out of range:' + charLuminance)
  }

  return Math.abs(luminanceOfTile(tile) - luminanceOfChar(char))
}

// match char (8 byte array) on each of the supported chars (array of 8 bytes arrays)
// and return the index of the best fit
function bestMatch (tile, chars) {
  return supportedChars
    .map(i => [i, hammingDistance(tile, chars[i])])
    .reduce((acc, val) => val[1] < acc[1] ? val : acc, [-1, Number.MAX_VALUE])[0]
}

function bestColorMatch (tile) {
  return quantize2index(averageColorOfTile(tile))
}

// cut sharpImage in 8x8 pixel tiles, this is a three dimensional array:
// 8 rows of 8 pixels of [r, g, b]
function cutIntoTiles (sharpImage) {
  return cellOffsets(sharpImage).map(offset => {
    return Array(8).fill(0)
      .map((_v, y) => offset + imageCoordinatesToByteOffset(sharpImage, 0, y))
      .map(rowOffset => parse8pixelRow(sharpImage, rowOffset))
  })
}

// convert an image file to a 40x25 array of screencodes
async function convertFile (filename, charSet) {
  const image = await loadFile(filename)

  const tiles = cutIntoTiles(image)
  console.log(`${tiles.length} tiles`)
  // map tiles to best match in charSet
  const screenCodes = tiles.map(t => bestMatch(t, charSet))
  const colors = tiles.map(t => bestColorMatch(t))
  return { screenCodes, colors }
}

(async function () {
  const inputName = process.argv[2]
  const filenames = await toFilenames(inputName, supportedExtensions)
  const charSet = await readChars(relativePath('./characters.901225-01.bin'))
  // array of screens, one screen is a { screenCodes, colors }
  const screens = await Promise.all(filenames.map(f => convertFile(f, charSet)))
  await toPetmate(`${inputName}.petmate`, screens)
})()
