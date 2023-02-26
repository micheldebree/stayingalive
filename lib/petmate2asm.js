const processFile = require('./processFile.js')
const { createBuffer, addWrites, generateCode } = require('./writeBuffer.js')
const fs = require('fs')

const filenameIn = process.argv[2]

function pad (buffer, nrBytes) {
  for (let i = 0; i < nrBytes; i++) {
    buffer.push(0)
  }
}

function getMatrix (frame, cellToByte) {
  const paddingH = Math.max(40 - frame.width, 0)
  const paddingV = Math.max(25 - frame.height, 0)

  const paddingLeft = paddingH >> 1
  const paddingRight = 40 - paddingLeft - frame.width
  const paddingTop = paddingV >> 1
  const paddingBottom = 25 - paddingTop - frame.height

  console.log(`dumping frame ${frame.name} with size ${frame.width}x${frame.height}`)
  console.log(`padding ${paddingLeft} left, ${paddingRight} right`)

  const result = []
  pad(result, paddingTop)
  frame.framebuf.forEach(row => {
    pad(result, paddingLeft)
    row.forEach(cell => result.push(cellToByte(cell)))
    pad(result, paddingRight)
  })
  pad(result, paddingBottom)
  return result
}

function processor (buf) {
  const content = JSON.parse(buf)
  const version = content.version
  const frames = content.framebufs

  if (version !== 2) {
    throw new Error(`Unsupported Petmate version: ${content.version}`)
  }

  console.log(`File has ${frames.length} frames`)

  let prevScreenMatrix = []
  let prevColorMatrix = []

  let codeResult = ''
  frames.forEach(frame => {
    const buffer = createBuffer()

    const screenMatrix = getMatrix(frame, cell => cell.code)
    const colorMatrix = getMatrix(frame, cell => cell.color)

    addWrites(buffer, prevScreenMatrix, 0x0400, screenMatrix)
    addWrites(buffer, prevColorMatrix, 0xd800, colorMatrix)

    prevScreenMatrix = screenMatrix
    prevColorMatrix = colorMatrix
    codeResult += generateCode(buffer, frame.name)
  })

  fs.writeFileSync(`${filenameIn}.asm`, codeResult)

  const result = []
  return result
}

processFile(filenameIn, processor)
