// load and scale the image, should have 3 channels (r, g, b) after this
import {PixelColor, SharpImage} from "./graphics.js";
import sharp, { Sharp } from 'sharp'
import {palette, quantize} from "./quantizer.js";

async function loadFile (filename: string): Promise<SharpImage> {
  return await sharp(filename)
  .resize(320, 200)
  .removeAlpha()
  .normalise()
  .raw()
  .toBuffer({resolveWithObject: true})
}

// convert indexed image back to PixelColor image and save to file
async function saveIndexedImage (indexedImage: number[], outputFile: string): Promise<void> {
  const pixelImage: PixelColor[] = indexedImage.map(p => palette[p])
  const imageData: Uint8ClampedArray = new Uint8ClampedArray(pixelImage.flat())
  const image: Sharp = sharp(imageData, {
    raw: {
      width: 320,
      height: 200,
      channels: 3
    }
  })
  await image.toFile(outputFile)
}

(async function () : Promise<void> {
  const filenameIn: string = process.argv[2]
  const image: SharpImage = await loadFile(filenameIn)
  const indexedImage: number[] = quantize(image)
  await saveIndexedImage(indexedImage, `${filenameIn}-quantized.png`)
})()
