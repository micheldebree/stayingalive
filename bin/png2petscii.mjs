#!/usr/bin/env node


import sharp from 'sharp'
import {toFilenames, relativePath} from './utils.mjs'
import {
  readChars,
  hamming,
  parse8pixelRow,
  parseHiresByteFromPixelRow,
  countBits,
  imageCoordinatesToByteOffset, cellOffsets, pixelLuminance
} from './graphics.mjs'
import {quantize, quantize2index} from './quantizer.mjs'
import {toPetmate} from './petmate.mjs'

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
async function loadFile(filename) {
  return sharp(filename)
  .resize(width, height)
  .removeAlpha()
  // .greyscale()
  .normalise()
  .median(2)
  .raw()
  .toBuffer({resolveWithObject: true})
}

// return the number of bits set in char in range [0..255]
function luminanceOfChar(char) {
  if (char.length > 8) {
    throw new Error(`Too many bytes in char: ${char.length}`)
  }
  return char
  .map(byte => countBits(byte))
  .reduce((a, v) => a + v, 0) * 4
}

// return the average channel value for a tile in range [0..255]
function luminanceOfTile(tile) {
  const pixels = tile.flat()

  if (pixels.length > 64) {
    throw new Error(`Too many pixels in tile: ${pixels.length}`)
  }

  const sum = pixels
  .map(p => pixelLuminance(p))
  .reduce((a, v) => a + v, 0)
  return sum / pixels.length
}

// TODO: discard background color?
function averageColorOfTile(tile) {
  const pixels = tile.flat()
  const sum = pixels
  .reduce((a, v) => [a[0] + v[0], a[1] + v[1], a[2] + v[2]], [0, 0, 0])
  return [sum[0] / pixels.length, sum[1] / pixels.length,
    sum[2] / pixels.length]
}

// pixels is an array of color indices
function mostOccuringColorIndex(pixels) {
  const counts = Array(16).fill(0)
  pixels.forEach(p => counts[p]++)

  return counts
    .map((c, i) => [i, c])
    .reduce((a, v) => v[1] > a[1] ? v : a, [0, 0])[0]
}

function bestBackgroundColor(sharpImage) {
  return mostOccuringColorIndex(quantize(sharpImage))
}

function combinedDistance(tile, char, backgroundColor) {
  return hammingDistance(tile, char, backgroundColor) * 6 + luminanceDistance(tile, char)
}

// measure hamming distance between a tile and a char
// char1 and char2 are arrays of 8 bytes
// backgroundColor is [r, g, b] and used to determine which pixels are considered 'set' and which are background
function hammingDistance(tile, char, backgroundColor) {
  // convert tile to hires char. row is 8 x [r, g, b]


  const tileChar = tile.map(row => parseHiresByteFromPixelRow(row, backgroundColor))
  return char
  .map((c, i) => hamming(c, tileChar[i]))
  .reduce( (acc, val) => acc + val, 0)
}

function luminanceDistance(tile, char) {
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
function bestMatch(tile, chars, backgroundColor) {
  return supportedChars
  .map(i => [i, hammingDistance(tile, chars[i], backgroundColor)])
  .reduce((acc, val) => val[1] < acc[1] ? val : acc, [-1, Number.MAX_VALUE])[0]
}

function bestColorMatch(tile, backgroundColor) {
  const nonBackgroundPixels  = tile
    .flatMap(row => row.map(p => quantize2index(p)))
    .filter(c => c !== backgroundColor)


  return mostOccuringColorIndex(nonBackgroundPixels)

  // return quantize2index(averageColorOfTile(tile))
}

// cut sharpImage in 8x8 pixel tiles, this is a three dimensional array:
// 8 rows of 8 pixels of [r, g, b]
function cutIntoTiles(sharpImage) {
  return cellOffsets(sharpImage).map(offset => {
    return Array(8).fill(0)
    .map((_v, y) => offset + imageCoordinatesToByteOffset(sharpImage, 0, y))
    .map(rowOffset => parse8pixelRow(sharpImage, rowOffset))
  })
}

// convert an image file to a 40x25 array of screencodes
async function convertFile(filename, charSet) {
  const image = await loadFile(filename)
  const tiles = cutIntoTiles(image)
  // map tiles to best match in charSet
  const backgroundColor = bestBackgroundColor(image)
  const screenCodes = tiles.map(t => bestMatch(t, charSet, backgroundColor))
  const colors = tiles.map(t => bestColorMatch(t))
  // TODO: do not consider background when matching color?
  return {screenCodes, colors, backgroundColor}
}

(async function () {
  const inputName = process.argv[2]
  const filenames = await toFilenames(inputName, supportedExtensions)
  const charSet = await readChars(relativePath('./characters.901225-01.bin'))
  // array of screens, one screen is a { screenCodes, colors, backgroundColor }
  const screens = await Promise.all(filenames.map(f => convertFile(f, charSet)))
  await toPetmate(`${inputName}.petmate`, screens)
})()
