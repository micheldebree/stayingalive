import { readFile } from 'node:fs/promises'

const bytesPerChar = 8
const bitsPerByte = 8

const mask = [
  0b10000000,
  0b01000000,
  0b00100000,
  0b00010000,
  0b00001000,
  0b00000100,
  0b00000010,
  0b00000001]

// callback (index, 1 or 0)
export function forEachBitIn (byte, callback) {
  for (let i = 0; i < bitsPerByte; i++) {
    callback(i, (byte & mask[i]) === 0 ? 0 : 1)
  }
}

export function forEachByteIn (bytes, callback) {
  bytes.forEach((byte, i) => callback(i, byte))
}

// callback (index, array of 8 bytes)
export function forEachCharIn (charData, callback) {
  for (let i = 0; i < charData.length / bytesPerChar; i++) {
    const offset = i * bytesPerChar
    callback(i, charData.slice(offset, offset + bytesPerChar))
  }
}

export function hamming (byte1, byte2) {
  let result = 0

  const xorred = byte1 ^ byte2

  for (let i = 0; i < 8; i++) {
    result += (xorred & mask[i]) > 0 ? 1 : 0
  }
  return result
}

function imageCoordinatesToByteOffset (sharpImage, x, y) {
  // assume 1 byte per channel
  return (y * sharpImage.info.width + x) * sharpImage.info.channels
}

// callback (byte offset where the cell starts)
export function forEachCellIn (sharpImage, callback) {
  for (let y = 0; y < sharpImage.info.height; y += 8) {
    for (let x = 0; x < sharpImage.info.width; x += 8) {
      // callback(sharpImage.data.slice(offset, offset + 8 * 8 * sharpImage.info.channels))
      callback(imageCoordinatesToByteOffset(sharpImage, x, y))
    }
  }
}

// parse the 8 pixels at offset in sharpImage as a hires byte
export function parseHiresByte (sharpImage, offset, threshold = 127) {
  let result = 0
  for (let i = 0; i < 8; i++) {
    const firstChannelOffset = offset + i * sharpImage.info.channels
    if (sharpImage.data[firstChannelOffset] > threshold) {
      result |= mask[i]
    }
  }
  return result
}

export function forEachCellRowIn (sharpImage, offset, callback) {
  for (let y = 0; y < 8; y++) {
    callback(offset + imageCoordinatesToByteOffset(sharpImage, 0, y))
  }
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
  forEachCharIn(charData, (i, charBytes) => chars.push(charBytes))
  return chars
}

// async function saveChars (chars) {
//   await writeFile('tiles.bin', Uint8Array.from(cells.flat()))
// }
