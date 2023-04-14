import { readFile } from 'node:fs/promises'
import sharp from 'sharp'
import { forEachCharIn, forEachByteIn, forEachBitIn, mapByteOrder} from './graphics.mjs'

const bytesPerChar = 8
const bitsPerByte = 8
const bytesPerPixel = 3
const bytesPerRow = 32


async function convert (filenameIn) {
  const buffer = await readFile(filenameIn)
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

  forEachCharIn(charData, (ci, bytes) => {
    forEachByteIn(bytes, (bi, byte) => {
      forEachBitIn(byte, (pi, bit) => {
        const byteOffsetChar = ci * bytesPerChar + bi
        const byteOffset = mapByteOrder(byteOffsetChar, bytesPerRow)
        const bitOffset = byteOffset * bitsPerByte + pi

        const offset = bitOffset * bytesPerPixel
        const value = bit * 0xff

        imageData[offset] = value
        imageData[offset + 1] = value
        imageData[offset + 2] = value
      })
    })
  })

  await image.toFile(`${filenameIn}.png`)
}


(async function () {
  const filenameIn = process.argv[2]
  await convert(filenameIn)
})()
