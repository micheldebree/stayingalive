import { createBuffer, addWrites, generateCode } from './writeBuffer.js'
import { readFile, writeFile } from 'node:fs/promises'

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

async function convert (filename) {
  const buf = await readFile(filename)
  const content = JSON.parse(buf)
  const frames = content.framebufs

  // duplicate first frame to end
  const duplicateFirstFrame = structuredClone(frames[0])
  duplicateFirstFrame.name = 'keyFrame'
  frames.push(duplicateFirstFrame)

  if (content.version !== 2) {
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

  await writeFile(`${filename}.gen.asm`, codeTablesHi + codeTablesLo + codeResult)
}

(async function () {
  await convert(process.argv[2])
})()
