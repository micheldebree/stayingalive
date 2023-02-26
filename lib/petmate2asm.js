const processFile = require('./processFile.js')
const { createBuffer, addWrites, generateCode } = require('./writeBuffer.js')
const fs = require('fs')

const filenameIn = process.argv[2]

function pad (buffer, nrBytes) {
  for (let i = 0; i < nrBytes; i++) {
    buffer.push(0x20)
  }
}

function getMatrix (frame, cellToByte) {
  const paddingLeft = Math.max((40 - frame.width) >> 1, 0)
  const paddingRight = 40 - paddingLeft - frame.width
  const paddingTop = Math.max((25 - frame.height) >> 1, 0)
  const paddingBottom = 25 - paddingTop - frame.height

  console.log(`dumping frame ${frame.name} with size ${frame.width}x${frame.height}`)
  // console.log(`padding ${paddingLeft} left, ${paddingRight} right`)

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

  let prevScreenMatrix = getMatrix(frames[0], cell => cell.code)
  let prevColorMatrix = getMatrix(frames[0], cell => cell.color)

  let codeTablesHi = 'framesHi:\n'
  let codeTablesLo = 'framesLo:\n'
  let codeResult = ''

  frames.forEach(frame => {
    codeTablesHi += `!byte b.hi(${frame.name})\n`
    codeTablesLo += `!byte b.lo(${frame.name})\n`

    const buffer = createBuffer()

    const screenMatrix = getMatrix(frame, cell => cell.code)
    const colorMatrix = getMatrix(frame, cell => cell.color)

    // Optimizations
    // // TODO: Reuse screencode if lower nibble is the same as color
    for (let i = 0; i < screenMatrix.length; i++) {
      // if the screen has a space, do not bother to change color
      if (screenMatrix[i] === 0x20) {
        colorMatrix[i] = prevColorMatrix[i]
      }
      // if the color is the same as background, do not bother to change char
      if (colorMatrix[i] === 0) {
        screenMatrix[i] = prevScreenMatrix[i]
      }
    }

    addWrites(buffer, prevScreenMatrix, 0x0400, screenMatrix)
    addWrites(buffer, prevColorMatrix, 0xd800, colorMatrix)

    prevScreenMatrix = screenMatrix
    prevColorMatrix = colorMatrix
    codeResult += generateCode(buffer, frame.name)
  })

  fs.writeFileSync(`${filenameIn}.asm`, codeTablesHi + codeTablesLo + codeResult)

  // write first frame as binary data
  const result = getMatrix(frames[0], cell => cell.code)
  return result.concat(getMatrix(frames[0], cell => cell.color))
}

processFile(filenameIn, processor)
