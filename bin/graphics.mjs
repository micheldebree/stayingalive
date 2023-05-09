import { readFile } from 'node:fs/promises'

const bytesPerChar = 8

const mask = [
  0b10000000,
  0b01000000,
  0b00100000,
  0b00010000,
  0b00001000,
  0b00000100,
  0b00000010,
  0b00000001]

// array of offsets for each char in charData
export function charOffsets (charData) {
  return Array(charData.length / bytesPerChar)
    .fill(0)
    .map((_v, i) => i * bytesPerChar)
}

// callback (index, array of 8 bytes)
export function forEachCharIn (charData, callback) {
  charOffsets(charData).forEach((offset, i) => {
    callback(i, charData.slice(offset, offset + bytesPerChar))
  })
}

// the number of bits set to 1 in a byte
export function countBits (byte) {
  return mask.filter(m => (byte & m) !== 0).length
}

// hamming distance between two bytes (= number of bits that are the same)
export function hamming (byte1, byte2) {
  return countBits(byte1 ^ byte2)
}

export function imageCoordinatesToByteOffset (sharpImage, x, y) {
  // assume 1 byte per channel
  return (y * sharpImage.info.width + x) * sharpImage.info.channels
}

// return an array of offsets into sharpImage.data that correspond with the start of each 8x8 cell
export function cellOffsets (sharpImage) {
  const cols = sharpImage.info.width >> 3
  const rows = sharpImage.info.height >> 3
  return Array(rows).fill(0)
    .map((_v, row) => Array(cols).fill(0)
      .map((_v, col) => imageCoordinatesToByteOffset(sharpImage, col * 8, row * 8)))
    .flat()
}

// parse an 8 pixel greyscale row to a hires byte
// assume greyscale so only consider first channel
export function parseHiresByteFromPixelRow (tileRow, threshold = 127) {
  return mask
    .filter((_m, i) => tileRow[i][0] > threshold)
    .reduce((a, v) => (a | v), 0)
}

// parse the 8 pixels at offset in sharpImage as a hires byte
// a pixel is considered set when the first channel is above the threshold
// TODO: obsolete?
export function parseHiresByte (sharpImage, offset, threshold = 127) {
  return mask
    .filter((_m, i) => sharpImage.data[offset + i * sharpImage.info.channels] > threshold)
    .reduce((a, v) => (a | v), 0)
}

// get an 8  pixel row as array of pixels from sharpImage. pixels are [r, g, b]
export function parse8pixelRow (sharpImage, offset) {
  const result = []
  for (let i = 0; i < 8; i++) {
    const firstChannelOffset = offset + i * sharpImage.info.channels
    result.push([sharpImage.data[firstChannelOffset],
      sharpImage.data[firstChannelOffset + 1],
      sharpImage.data[firstChannelOffset + 2]])
  }
  return result
}

// map c64 byte order to "normal" byte order
export function mapByteOrder (offset, bytesPerRow) {
  const x = Math.floor(offset / bytesPerChar) % bytesPerRow
  const y = Math.floor(offset / (bytesPerRow * bytesPerChar)) * bytesPerChar +
      (offset % bytesPerChar)
  return y * bytesPerRow + x
}

// read the characters from a binary character set
// return: an array of 8-byte arrays
export async function readChars (filename) {
  const buffer = await readFile(filename)

  // read only the first charset
  const charData = Uint8Array.from(buffer).slice(0, 255 * 8)

  const chars = []
  forEachCharIn(charData, (_i, charBytes) => chars.push(charBytes))
  return chars
}

// async function saveChars (chars) {
//   await writeFile('tiles.bin', Uint8Array.from(cells.flat()))
// }
