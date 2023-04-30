// Generate optimized code from petmate frames

import { createBuffer, addWrites, generateCode } from './writeBuffer.mjs'
import { readFile, writeFile } from 'node:fs/promises'
import { encode } from './runlengthEncoder.mjs'
import { renderBytes } from './codegen.mjs'

const outExtension = '.gen.asm'
const cols = 40
const rows = 25
const space = 0x20
const screenMem = 0x400

// add a few spaces
function pad (buffer, nrBytes) {
  for (let i = 0; i < nrBytes; i++) {
    buffer.push(space)
  }
}

// Get a petmate frame as a simple array of bytes
// cellToByte: a function to get the byte for a cell in the frame (code or
// color) so this can be used for both screencodes and colors
// Pads the frame to filt cols x rows
function getMatrix (frame, cellToByte) {
  const horSpace = cols - frame.width
  const verSpace = rows - frame.height
  const paddingLeft = Math.max(horSpace >> 1, 0)
  const paddingRight = horSpace - paddingLeft
  const paddingTop = Math.max(verSpace >> 1, 0)
  const paddingBottom = verSpace - paddingTop

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

  if (content.version !== 2) {
    throw new Error(`Unsupported Petmate version: ${content.version}`)
  }

  const frames = content.framebufs

  // duplicate first frame to end, so we can skip the
  // first frame (keyframe) when looping
  const duplicateFirstFrame = structuredClone(frames[0])
  duplicateFirstFrame.name = 'keyFrame_ghost'
  frames.push(duplicateFirstFrame)

  console.log(`File has ${frames.length} frames`)

  // start with 'transparent' frame
  let prevScreenMatrix = Array(cols * rows).fill(space)

  // write out hi and lo bytes of pointers to the compiled frames
  const firstFrameLabel = 'firstFrame:\n'
  let firstFrame
  let codeTablesHi = 'framesHi:\n'
  let codeTablesLo = 'framesLo:\n'
  let codeResult = ''

  frames.forEach((frame, frameNr) => {
    const screenMatrix = getMatrix(frame, cell => cell.code)

    // encode the first frame as run lenght encoded data
    if (frameNr === 0) {
      const firstFrameData = encode(screenMatrix)
      firstFrame = firstFrameLabel + renderBytes(firstFrameData) + '\n'
    } else {
      // collect memory writes (address, value) for the screen codes
      // pass the previous matrix so we only need to collect writes
      // for the difference
      codeTablesHi += `!byte b.hi(${frame.name})\n`
      codeTablesLo += `!byte b.lo(${frame.name})\n`
      const writes = createBuffer()
      addWrites(writes, prevScreenMatrix, screenMem, screenMatrix)

      // generate code that performs the memory writes in an optimized way
      codeResult += generateCode(writes, frame.name)
    }
    prevScreenMatrix = screenMatrix
  })

  await writeFile(`${filename}${outExtension}`, firstFrame + codeTablesHi + codeTablesLo + codeResult)
}

(async function () {
  await convert(process.argv[2])
})()
