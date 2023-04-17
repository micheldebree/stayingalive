import { createBuffer, addWrites, generateCode } from './writeBuffer.js'
import { readFile, writeFile } from 'node:fs/promises'

const outExtension = '.gen.asm'
const cols = 40
const rows = 25
const space = 0x20
const screenMem = 0x400

function pad (buffer, nrBytes) {
  for (let i = 0; i < nrBytes; i++) {
    buffer.push(space)
  }
}

function getMatrix (frame, cellToByte) {
  const horSpace = cols - frame.width
  const verSpace = rows - frame.height
  const paddingLeft = Math.max(horSpace >> 1, 0)
  const paddingRight = horSpace - paddingLeft
  const paddingTop = Math.max(verSpace >> 1, 0)
  const paddingBottom = verSpace - paddingTop

  console.log(`dumping frame ${frame.name} with size ${frame.width}x${frame.height}`)

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
  let prevScreenMatrix = Array(cols * rows).fill(space)

  let codeTablesHi = 'framesHi:\n'
  let codeTablesLo = 'framesLo:\n'
  let codeResult = ''

  frames.forEach(frame => {
    codeTablesHi += `!byte b.hi(${frame.name})\n`
    codeTablesLo += `!byte b.lo(${frame.name})\n`

    const writes = createBuffer()

    const screenMatrix = getMatrix(frame, cell => cell.code)
    addWrites(writes, prevScreenMatrix, screenMem, screenMatrix)

    prevScreenMatrix = screenMatrix
    codeResult += generateCode(writes, frame.name)
  })

  await writeFile(`${filename}${outExtension}`, codeTablesHi + codeTablesLo + codeResult)
}

(async function () {
  await convert(process.argv[2])
})()
