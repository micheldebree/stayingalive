#!/usr/bin/env node
import sharp from 'sharp'
import { distance, SharpImage, PixelColor } from './graphics.js'

// the 'PALette' palette
export const palette: PixelColor[] = [
  [0, 0, 0], // black
  [0xff, 0xff, 0xff], // white
  [0x8c, 0x32, 0x3d], // red
  [0x66, 0xbf, 0xb3], // cyan
  [0x8e, 0x36, 0xa1], // purple
  [0x4a, 0xa6, 0x48], // green
  [0x32, 0x2d, 0xab], // blue
  [0xcd, 0xd2, 0x56], // yellow
  [0x8f, 0x50, 0x1a], // orange
  [0x53, 0x3d, 0x01], // brown
  [0xbd, 0x63, 0x6e], // light red
  [0x4e, 0x4e, 0x4e], // dark gray
  [0x76, 0x76, 0x76], // medium gray
  [0x8c, 0xe9, 0x8b], // light green
  [0x6b, 0x66, 0xe4], // light blue
  [0xa3, 0xa3, 0xa3] // light gray
]

// map an [r, g, b] color to the index of the closest color in the palette
export function quantize2index (color: PixelColor): number {
  return palette
    .map((paletteColor, i) => [i, distance(color, paletteColor)])
    .reduce((acc, current) => (current[1] < acc[1] ? current : acc),
      [0, Number.POSITIVE_INFINITY])[0]
}

// load and scale the image, should have 3 channels (r, g, b) after this
async function loadFile (filename): Promise<SharpImage> {
  return await sharp(filename)
    .resize(320, 200)
    .removeAlpha()
    .normalise()
    .raw()
    .toBuffer({ resolveWithObject: true })
}

// convert indexed image back to PixelColor image and save to file
async function saveIndexedImage (indexedImage, outputFile): Promise<void> {
  const pixelImage = indexedImage.map(p => palette[p])
  const imageData = new Uint8ClampedArray(pixelImage.flat())
  const image = sharp(imageData, {
    raw: {
      width: 320,
      height: 200,
      channels: 3
    }
  })
  await image.toFile(outputFile)
}

// unflatten image data by converting it to an array of 320x200 pixels of type
// [r, g, b]
function unflatten (img: SharpImage): PixelColor[] {
  let i = 0
  const result: PixelColor[] = []
  while (i < img.data.length) {
    // assume 3 channels
    result.push([img.data[i], img.data[i + 1], img.data[i + 2]])
    i += 3
  }
  return result
}

// return an index image (320 x 200 palette indices) from a raw sharp image
export function quantize (img: SharpImage): number[] {
  return unflatten(img).map(p => quantize2index(p))
}

// (async function () {
//   const filenameIn = process.argv[2]
//   const rawSharpImage = await loadFile(filenameIn)
//   const indexedImage = quantize(rawSharpImage)
//   await saveIndexedImage(indexedImage, `${filenameIn}-quantized.png`)
// })()
