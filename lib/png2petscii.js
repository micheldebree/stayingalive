#!/usr/bin/env node
const sharp = require('sharp')

async function loadFile () {
  return sharp('paintface.jpg')
    .resize(320, 200)
    .removeAlpha()
    .normalise()
    .median()
    .threshold()
    .raw()
    .toBuffer({ resolveWithObject: true })
}

function getPixel (image, x, y) {
  return image.data[y * image.info.width + x]
}

function toIndex (image, x, y) {
  return y * image.info.width + x * image.info.channels
}

function forEachCell (image, callback) {
  for (let y = 0; y < image.info.height; y += 8) {
    for (let x = 0; x < image.info.width; x += 8) {
      callback(x, y)
    }
  }
}

function forEachCellRow (left, top, callback) {
  for (let y = 0; y < 8; y++) {
    callback(left, top + y)
  }
}

function getByte (image, left, top) {
  return pixelPositions(image, left, top)
    .map(i => [image.data[i], image.data[i + 1], image.data[i + 2]])
}

function forEachPixel (left, top, callback) {
  for (let x = 0; x < 8; x++) {
    callback(left + x, top)
  }
}

function pixelPositions (image, left, top) {
  return Array.from(Array(8).keys())
    .map(x => toIndex(image, left + x, top))
}

async function convert () {
  const image = await loadFile()
  console.log(image.info)
  if (image.info.channels !== 3) {
    throw new Error('Wrong number of channels.')
  }
  if (image.data.length !== 320 * 200 * 3) {
    throw new Error('Wrong number of bytes.')
  }
  console.log(image.data.length)

  const outputPixels = new Uint8ClampedArray(image.data.buffer)

  // iterate through image data in c64 order
  forEachCell(image, (x, y) =>
    forEachCellRow(x, y, (x, y) =>
      console.log(getByte(image, x, y))
      // console.log(pixelPositions(image, x, y))
    )
  )

  await sharp(outputPixels, { raw: image.info }).toFile('test.png')
}

(async function () {
  await convert()
})()
