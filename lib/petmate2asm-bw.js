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

  // duplicate first frame to end
  const duplicateFirstFrame = structuredClone(frames[0])
  duplicateFirstFrame.name = 'keyFrame'
  frames.push(duplicateFirstFrame)

  if (version !== 2) {
    throw new Error(`Unsupported Petmate version: ${content.version}`)
  }

  console.log(`File has ${frames.length} frames`)

  // start with 'transparent' frame
  let prevScreenMatrix = []
  for (let i = 0; i < 25 * 40; i++) {
    prevScreenMatrix.push(0x20)
  }

  let codeTablesHi = 'framesHi:\n'
  let codeTablesLo = 'framesLo:\n'
  let codeResult = ''

  frames.forEach(frame => {
    codeTablesHi += `!byte b.hi(${frame.name})\n`
    codeTablesLo += `!byte b.lo(${frame.name})\n`

    const writes = createBuffer()

    const screenMatrix = getMatrix(frame, cell => cell.code)
    addWrites(writes, prevScreenMatrix, 0x0400, screenMatrix)

    prevScreenMatrix = screenMatrix
    codeResult += generateCode(writes, frame.name)
  })

  fs.writeFileSync(`${filenameIn}.gen.asm`, codeTablesHi + codeTablesLo + codeResult)

  // write first frame as binary data
  // TODO: is unused for now
  // const result = getMatrix(frames[0], cell => cell.code)
  // return result.concat(getMatrix(frames[0], cell => cell.color))
  return []
}

processFile(filenameIn, processor)