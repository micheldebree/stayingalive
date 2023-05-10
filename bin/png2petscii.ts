import sharp from 'sharp'
import {toFilenames, relativePath} from './utils.js'
import {
  readChars,
  parse8pixelRow,
  imageCoordinatesToByteOffset,
  cellOffsets,
  byte2Pixels,
  distance, Byte, PixelColor, Tile, SharpImage, Char, CharSet
} from './graphics.js'
import {quantize, quantize2index} from './quantizer.js'
import {toPetmate, ScreenCell, Screen} from './petmate.js'

interface WeightedScreenCell {
  cell: ScreenCell,
  distance: number
}

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
  return await sharp(filename)
  .resize(width, height)
  .removeAlpha()
  // .greyscale()
  .normalise()
  // .median(4)
  .raw()
  .toBuffer({resolveWithObject: true})
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

// convert a Char (8 bytes) to a colored tile (8 x 8 [r, g, b] pixels)
function char2Tile(char: Char, color: number, backgroundColor: number): Tile {
  return Array.from(char).map(b => byte2Pixels(b, color, backgroundColor))
}

function bestCell(allDistances: WeightedScreenCell[]) {
  const winner: WeightedScreenCell = allDistances.reduce((a, v) => v.distance < a.distance ? v : a, {
    cell: {
      code: 0,
      color: 0
    },
    distance: Number.MAX_VALUE
  })

  return winner.cell
}

// sum of all distances between corresponding pixels in both rows
function tileRowDistance(row1: PixelColor[], row2: PixelColor[]): number {
  return row1
  .map((p, i) => distance(p, row2[i]))
  .reduce((a, v) => a + v, 0)
}

// calculate the total color distance between each pixel in both tiles
function tileDistance(t1: Tile, t2: Tile): number {
  return t1.map((row, i) => tileRowDistance(row, t2[i]))
  .reduce((a, v) => a + v, 0)
}

function bestMatch(tile: Tile, chars: CharSet, backgroundColor: number): ScreenCell {
  let finalDistances: WeightedScreenCell[] = [];

  Array(16).fill(0).filter(v => v !== backgroundColor)
  .forEach((_v, bestColor) => {
    const distances: WeightedScreenCell[] = supportedChars.map(charIndex => {
      const charTile = char2Tile(chars[charIndex], bestColor, backgroundColor)
      const cell: ScreenCell = {code: charIndex, color: bestColor}
      return {cell, distance: tileDistance(tile, charTile)}
    })
    finalDistances = [...finalDistances, ...distances]
  })
  return bestCell(finalDistances)
}

function bestFastMatch(tile: Tile, chars: CharSet, backgroundColor: number): ScreenCell {
  const bestColor: number = bestColorMatchForTile(tile, backgroundColor)

  const distances: WeightedScreenCell[] = supportedChars.map(charIndex => {
    const charTile = char2Tile(chars[charIndex], bestColor, backgroundColor)
    const cell: ScreenCell = {code: charIndex, color: bestColor}
    return {cell, distance: tileDistance(tile, charTile)}
  })

  return bestCell(distances)
}

function quantizeTile(tile: Tile): number[] {
  return tile.flatMap(row => row.map(p => quantize2index(p)))
}

// get the most occuring color for the tile, excluding background color
function bestColorMatchForTile(tile: Tile, backgroundColor: number): number {
  return mostOccuringColorIndex(quantizeTile(tile).filter(c => c !== backgroundColor))
}

// cut SharpImage in 8x8 PixelColor tiles, this is a three dimensional array:
// 8 rows of 8 pixels of [r, g, b]
function cutIntoTiles(img: SharpImage): Tile[] {
  return cellOffsets(img).map(offset =>
      Array(8).fill(0)
      .map((_v, y) => offset + imageCoordinatesToByteOffset(img, 0, y))
      .map(rowOffset => parse8pixelRow(img, rowOffset))
  )
}

// convert an image file to a 40x25 array of screencodes
async function convertFile(filename: string, charSet: CharSet): Promise<Screen> {
  const image: SharpImage = await loadFile(filename)
  const backgroundColor: number = bestBackgroundColor(image)
  const cells: ScreenCell[] = cutIntoTiles(image).map((t, i) => {
    console.log(i)

    return bestFastMatch(t, charSet, backgroundColor)
  })
  return {backgroundColor, cells}
}

(async function () {
  const inputName: string = process.argv[2]
  const filenames: string[] = await toFilenames(inputName, supportedExtensions)
  const charSet: CharSet = await readChars(relativePath('./characters.901225-01.bin'))
  // array of screens, one screen is a { screenCodes, colors, backgroundColor }
  const screens: Screen[] = await Promise.all(filenames.map(async f => await convertFile(f, charSet)))
  await toPetmate(`${inputName}.petmate`, screens)
})()
