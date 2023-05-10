#!/usr/bin/env node

import sharp from 'sharp'
import {toFilenames, relativePath} from './utils.mjs'
import {
  readChars,
  hamming,
  parse8pixelRow,
  parseHiresByteFromPixelRow,
  countBits,
  imageCoordinatesToByteOffset,
  cellOffsets,
  pixelLuminance,
  byte2Pixels,
  distance, Byte, PixelColor, Tile, SharpImage, Char, CharSet
} from './graphics.js'
import {palette, quantize, quantize2index} from './quantizer.js'
import {toPetmate, ScreenCell, Screen} from './petmate.js'


const threshold: number = 128
const allChars: Byte[] = Array(255).fill(0).map((_c, i) => i)
const supportedChars: Byte[] = allChars
// const supportedChars = allChars.slice(64, 128).concat(allChars.slice(192, 256))
const cols: number = 40
const rows: number = 25
const width: number = cols * 8
const height: number = rows * 8
const supportedExtensions: string[] = ['.png', '.jpg']

// load and scale the image
async function loadFile(filename: string): Promise<SharpImage> {
  return sharp(filename)
  .resize(width, height)
  .removeAlpha()
  // .greyscale()
  .normalise()
  .median(2)
  .raw()
  .toBuffer({resolveWithObject: true})
}

// return the number of bits set in Char in range [0..255]
function luminanceOfChar(char: Char): number {
  if (char.length > 8) {
    throw new Error(`Too many bytes in char: ${char.length}`)
  }
  return char
  .map(b => countBits(b))
  .reduce((a, v) => a + v, 0) * 4
}

// return the average channel value for a tile in range [0..255]
function luminanceOfTile(tile: Tile): number {
  const pixels: PixelColor[] = tile.flat()

  if (pixels.length > 64) {
    throw new Error(`Too many pixels in tile: ${pixels.length}`)
  }

  const sum: number = pixels
  .map(p => pixelLuminance(p))
  .reduce((a, v) => a + v, 0)
  return sum / pixels.length
}

// TODO: discard background color?
function averageColorOfTile(tile: Tile): PixelColor {
  const pixels: PixelColor[] = tile.flat()
  const sum: PixelColor = pixels
  .reduce((a, v) => [a[0] + v[0], a[1] + v[1], a[2] + v[2]], [0, 0, 0])
  return [sum[0] / pixels.length, sum[1] / pixels.length, sum[2] / pixels.length]
}

// pixels is an array of color indices
function mostOccuringColorIndex(pixels: number[]): number {
  const counts: number[] = Array(16).fill(0)
  pixels.forEach(p => counts[p]++)

  return counts
  .map((c, i) => [i, c])
  .reduce((a, v) => v[1] > a[1] ? v : a, [0, 0])[0]
}

function bestBackgroundColor(img: SharpImage): number {
  return mostOccuringColorIndex(quantize(img))
}

function combinedDistance(tile: Tile, char: Char, backgroundColor: PixelColor): number {
  return hammingDistance(tile, char, backgroundColor) * 6
      + luminanceDistance(tile, char)
}

// convert a Char (8 bytes) to a colored tile (8 x 8 [r, g, b] pixels)
function char2Tile(char: Char, color: PixelColor, backgroundColor: PixelColor): Tile {
  return Array.from(char).map(b => byte2Pixels(b, color, backgroundColor))
}

// which
function colorDistance(tile: Tile, char: Char, color: PixelColor, backgroundColor: PixelColor) {
  const charColor: PixelColor = averageColorOfTile(char2Tile(char, color, backgroundColor))
  const tileColor: PixelColor = averageColorOfTile(tile)
  return distance(charColor, tileColor)
}

// measure hamming distance between a tile and a Char
// char1 and char2 are arrays of 8 bytes
// backgroundColor is [r, g, b] and used to determine which pixels are considered 'set' and which are background
function hammingDistance(tile: Tile, char: Char, backgroundColor: PixelColor): number {
  // convert tile to hires Char. row is 8 x [r, g, b]

  const tileChar: Char = tile.map(
      row => parseHiresByteFromPixelRow(row, backgroundColor))

  return char
  .map((c, i) => hamming(c, tileChar[i]))
  .reduce((acc, val) => acc + val, 0)
}

function luminanceDistance(tile: Tile, char: Char): number {
  const tileLuminance: number = luminanceOfTile(tile)
  const charLuminance: number = luminanceOfChar(char)


  if (tileLuminance > 255) {
    throw new Error('Tile luminance out of range:' + tileLuminance)
  }
  if (charLuminance > 256) {
    throw new Error('Char luminance out of range:' + charLuminance)
  }

  return Math.abs(luminanceOfTile(tile) - luminanceOfChar(char))
}

// match Char (8 Byte array) on each of the supported chars (array of 8 bytes arrays)
// and return the index of the best fit
function bestMatch(tile: Tile, chars: CharSet, backgroundColor: PixelColor) {
  return supportedChars
  .map(i => [i, hammingDistance(tile, chars[i], backgroundColor)])
  .reduce((acc, val) => val[1] < acc[1] ? val : acc, [-1, Number.MAX_VALUE])[0]
}

// get the combination of color and Char that best matches the tile color
function bestColorMatch(tile: Tile, chars: CharSet, backgroundColor: PixelColor): ScreenCell {

  type WeightedScreenCell = { cell: ScreenCell, distance: number }

  let allDistances: Array<WeightedScreenCell> = []

  supportedChars.forEach(charIndex => {
    const distances: Array<WeightedScreenCell> = palette.map((color, colorIndex) => {
      return {
        cell: {code: charIndex, color: colorIndex},
        distance: colorDistance(tile, chars[charIndex], color, backgroundColor)
      }
    })

    allDistances = [...allDistances, ...distances]
  })

  const winner: WeightedScreenCell = allDistances.reduce((a, v) => v.distance < a.distance ? v : a, {
    cell: {
      code: 0,
      color: 0
    }, distance: Number.MAX_VALUE
  })

  return winner.cell

}

// get the most occuring color for the tile, excluding background color
function bestColorMatchForTile(tile, backgroundColor) {
  // const nonBackgroundPixels = tile
  // .flatMap(row => row.map(p => quantize2index(p)))
  // .filter(c => c !== backgroundColor)
  //
  // return mostOccuringColorIndex(nonBackgroundPixels)

  return quantize2index(averageColorOfTile(tile))
}

// cut SharpImage in 8x8 PixelColor tiles, this is a three dimensional array:
// 8 rows of 8 pixels of [r, g, b]
function cutIntoTiles(img: SharpImage): Array<Tile> {
  return cellOffsets(img).map(offset => {
    return Array(8).fill(0)
    .map((_v, y) => offset + imageCoordinatesToByteOffset(img, 0, y))
    .map(rowOffset => parse8pixelRow(img, rowOffset))
  })
}

// convert an image file to a 40x25 array of screencodes
async function convertFile(filename: string, charSet: CharSet): Promise<Screen> {
  const image: SharpImage = await loadFile(filename)
  const tiles: Array<Tile> = cutIntoTiles(image)
  // map tiles to best match in CharSet
  const backgroundColor = bestBackgroundColor(image)
  const screenCodes = tiles.map(t => bestMatch(t, charSet, palette[backgroundColor]))
  const colors = tiles.map(t => bestColorMatchForTile(t, backgroundColor))

  // color match
  // const screenCells: Array<ScreenCell> = tiles.map(
  //   (t, i) => {
  //     console.log(i)
  //     return bestColorMatch(t, charSet, palette[backgroundColor])
  //   })
  // const screenCodes = screenCells.map(c => c.code)
  // const colors = screenCells.map(c => c.color)

  const cells: Array<ScreenCell> = screenCodes.map((code, i) => {
    return {code, color: colors[i]}
  })

  return { backgroundColor, cells }

}

(async function () {
  const inputName = process.argv[2]
  const filenames = await toFilenames(inputName, supportedExtensions)
  const charSet = await readChars(relativePath('./characters.901225-01.bin'))
  // array of screens, one screen is a { screenCodes, colors, backgroundColor }
  const screens: Array<Screen> = await Promise.all(filenames.map(f => convertFile(f, charSet)))
  await toPetmate(`${inputName}.petmate`, screens)
})()
