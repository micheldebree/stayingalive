// Generate optimized code from petmate frames

import {createBuffer, addWrites, generateCode, WriteBuffer} from './writeBuffer.js'
import {readFile, writeFile} from 'node:fs/promises'
import {encode} from './runlengthEncoder.js'
import {renderBytes} from './codegen.js'
import {FrameBuf, fromJSON, Petmate} from "./petmate.js";

const outExtension: string = '.gen.asm'
const cols: number = 40
const rows: number = 25
const space: number = 0x20
const screenMem: number = 0x400
const colorMem: number = 0xd800

// add a few spaces
function pad(buffer: number[], nrBytes: number) {
  for (let i: number = 0; i < nrBytes; i++) {
    buffer.push(space)
  }
}

// Get a petmate frame as a simple array of bytes
// cellToByte: a function to get the byte for a cell in the frame (code or
// color) so this can be used for both screencodes and colors
// Pads the frame to filt cols x rows
function getMatrix(frame: FrameBuf, cellToByte: (ScreenCell) => number): number[] {
  const horSpace: number = cols - frame.width
  const verSpace: number = rows - frame.height
  const paddingLeft: number = Math.max(horSpace >> 1, 0)
  const paddingRight: number = horSpace - paddingLeft
  const paddingTop: number = Math.max(verSpace >> 1, 0)
  const paddingBottom: number = verSpace - paddingTop

  const result: number[] = []
  pad(result, paddingTop)
  frame.framebuf.forEach(row => {
    pad(result, paddingLeft)
    row.forEach(cell => result.push(cellToByte(cell)))
    pad(result, paddingRight)
  })
  pad(result, paddingBottom)
  return result
}

async function convert(filename: string) {
  const buf: Buffer = await readFile(filename)
  const content: Petmate = fromJSON(buf.toString())

  const frames: FrameBuf[] = content.framebufs

  // duplicate first frame to end, so we can skip the
  // first frame (keyframe) when looping
  const duplicateFirstFrame: FrameBuf = structuredClone(frames[0])
  duplicateFirstFrame.name = 'keyFrame_ghost'
  frames.push(duplicateFirstFrame)

  console.log(`File has ${frames.length} frames`)

  // start with 'transparent' frame
  let prevScreenMatrix: number[] = Array(cols * rows).fill(space)
  let prevColorMatrix: number[] = Array(cols * rows).fill(0)

  // write out hi and lo bytes of pointers to the compiled frames
  const firstFrameLabel: string = 'firstFrame:\n'
  let firstFrame
  let codeTablesHi: string = 'framesHi:\n'
  let codeTablesLo: string = 'framesLo:\n'
  let codeResult: string = ''

  frames.forEach((frame: FrameBuf, frameNr: number) => {
    const screenMatrix: number[] = getMatrix(frame, cell => cell.code)
    const colorMatrix: number[] = getMatrix(frame, cell => cell.color)

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
      const writes: WriteBuffer = createBuffer()
      addWrites(writes, screenMem, screenMatrix, prevScreenMatrix)
      addWrites(writes, colorMem, colorMatrix, prevColorMatrix)

      // generate code that performs the memory writes in an optimized way
      codeResult += generateCode(writes, frame.name)
    }
    prevScreenMatrix = screenMatrix
    prevColorMatrix = colorMatrix
  })

  await writeFile(`${filename}${outExtension}`, firstFrame + codeTablesHi + codeTablesLo + codeResult)
}

(async function () {
  await convert(process.argv[2])
})()
