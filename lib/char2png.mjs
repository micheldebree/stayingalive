import { readFile } from 'node:fs/promises'
import sharp from 'sharp'

const bytesPerChar = 8
const bitsPerByte = 8
const bytesPerPixel = 3
const bytesPerRow = 32
const bytesPerCharacterRow = bytesPerRow * bytesPerChar

// callback (index, 1 or 0)
function forEachBit (byte, callback) {
  let mask = 0b10000000
  for (let i = 0; i < bitsPerByte; i++) {
    callback(i, (byte & mask) === 0 ? 0 : 1)
    mask >>= 1
  }
}

// callback (index, array of 8 bytes)
function forEachChar (data, callback) {
  for (let i = 0; i < data.length / bytesPerChar; i++) {
    const offset = i * bytesPerChar
    callback(i, data.slice(offset, offset + bytesPerChar))
  }
}

// map c64 byte order to "normal" byte order
function mapByteOrder (offset) {
  const x = Math.floor(offset / bytesPerChar) % bytesPerRow
  const y = Math.floor(offset / bytesPerCharacterRow) * bytesPerChar
    + (offset % bytesPerChar)
  return y * bytesPerRow + x
}

async function convert () {
  const buffer = await readFile('../res/characters.901225-01.bin')
  // const buffer = await readFile('../res/solitair1x1.charset')
  const charData = Uint8Array.from(buffer)

  const nrChars = charData.length / bytesPerChar
  const nrRows = nrChars / bytesPerRow


  const imageSize = nrChars * bytesPerChar * bitsPerByte * bytesPerPixel
  const imageData = new Uint8Array(imageSize).fill(0, 0, imageSize)

  const image = sharp(imageData, {
    // because the input does not contain its dimensions or how many channels it has
    // we need to specify it in the constructor options
    raw: {
      width: bytesPerRow * bitsPerByte,
      height: nrRows * bytesPerChar,
      channels: bytesPerPixel
    }
  })

  forEachChar(charData, (ci, bytes) => {
    bytes.forEach((byte, bi) => {
      forEachBit(byte, (pi, bit) => {
        const byteOffsetChar = ci * bytesPerChar + bi
        const byteOffset = mapByteOrder(byteOffsetChar)

        const bitOffset = byteOffset * bitsPerByte + pi
        const offset = bitOffset * bytesPerPixel
        const value = bit === 1 ? 0xff : 0

        imageData[offset] = value
        imageData[offset + 1] = value
        imageData[offset + 2] = value
      })
    })
  })

  await image.toFile('testchar.png')
}

(async function () {
  await convert()
})()
