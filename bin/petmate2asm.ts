// Generate optimized code from petmate frames
import { createBuffer, generateCode, WriteBuffer, addWrite, WriteOperation } from './writeBuffer.js'
import { readFile, writeFile } from 'node:fs/promises'
import { encode } from './runlengthEncoder.js'
import { renderBytes } from './codegen.js'
import { ScreenCell, FrameBuf, fromJSON, Petmate } from './petmate.js'

const rleEncodeFirstFrame = false
const outExtension = '.gen.asm'
const cols = 40
const rows = 25
const space = 0x20
const screenMem = 0x400
const colorMem = 0xd800
// const backgroundColor = 0xd021
// const borderColor = 0xd020

// add a few spaces
function pad (buffer: number[], padValue: number, nrBytes: number) {
  for (let i = 0; i < nrBytes; i++) {
    buffer.push(padValue)
  }
}

// Get a petmate frame as a simple array of bytes
// cellToByte: a function to get the byte for a cell in the frame (code or
// color) so this can be used for both screencodes and colors
// Pads the frame to fill cols x rows
// TODO: return write operations?
function getMatrix (frame: FrameBuf, padValue: number, cellToByte: (cell: ScreenCell) => number): number[] {
  const horSpace: number = cols - frame.width
  const verSpace: number = rows - frame.height
  const paddingLeft: number = Math.max(horSpace >> 1, 0)
  const paddingRight: number = horSpace - paddingLeft
  const paddingTop: number = Math.max(verSpace >> 1, 0)
  const paddingBottom: number = verSpace - paddingTop

  const result: number[] = []
  pad(result, padValue, paddingTop)
  frame.framebuf.forEach(row => {
    pad(result, padValue, paddingLeft)
    row.forEach(cell => result.push(cellToByte(cell)))
    pad(result, padValue, paddingRight)
  })
  pad(result, padValue, paddingBottom)
  return result
}

// convert a frame (sequence of bytes) to write operations
// only if it differs from previous frame
// N.B. the index into the bytes array is implicitly the address offset
function delta (addressOffset: number, frame: number[], previousFrame: number[]): WriteOperation[] {
  // N.B. index in frame is (relative) address
  const result: WriteOperation[] = frame
    .map((v, i): WriteOperation => ({ address: i, value: v }))
    .filter(op => op.value !== previousFrame[op.address])

  return result.map(op => ({ address: addressOffset + op.address, value: op.value }))
}

function onlyUnique (value: number, index: number, array: number[]) {
  return array.indexOf(value) === index
}

// return all unique screencodes being written, so we can reuse some of them
// for color writes
function allScreenCodes (screenWrites: WriteOperation[]): number[] {
  return screenWrites.map(w => w.value).filter(onlyUnique)
}

// only the lowest nibble is significant for $d800 writes,
// so if we have a screencode with the same lowest nibble, we can re-use that
// for example:
//  lda #$3f
//  sta $0400
//  lda #$0f
//  sta $d800
// will be optimized to
//  lda #$3f
//  sta $0400
//  sta $d800
function optimizeColorWrite (colorWrite: WriteOperation, screenCodes: number[]): void {
  const matchingValue: number = screenCodes.find(v => (v & 0b1111) === (colorWrite.value & 0b1111))
  if (matchingValue) {
    console.log(`Replaced color write ${colorWrite.value} with ${matchingValue}`)
    colorWrite.value = matchingValue
  }
}

function optimizeInvisibleScreenCodeWrites (
  screenMatrix: number[],
  previousScreenMatrix: number[],
  colorMatrix: number[],
  backgroundColor: number
) {
  screenMatrix.forEach((_v, i) => {
    // TODO: something not right here...
    if (colorMatrix[i] === backgroundColor) {
      screenMatrix[i] = previousScreenMatrix[i]
      console.log('Optimized invisible screencode write.')
    }
  })
}

function optimizeInvisibleColorWrites (colorMatrix: number[], previousColorMatrix: number[], screenMatrix: number[]) {
  colorMatrix.forEach((_v, i) => {
    if (screenMatrix[i] === 0x20) {
      colorMatrix[i] = previousColorMatrix[i]
      console.log('Optimized invisible color write.')
    }
  })
}

async function convert (filename: string) {
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
  const firstFrameBackgroundColor = frames[0].backgroundColor
  let prevColorMatrix: number[] = Array(cols * rows).fill(firstFrameBackgroundColor)
  // let previousBackgroundColor = 0
  // let previousBorderColor = 0

  // write out hi and lo bytes of pointers to the compiled frames
  const firstFrameLabel = 'firstFrame:\n'
  let firstFrame = ''
  let codeTablesHi = 'framesHi:\n'
  let codeTablesLo = 'framesLo:\n'
  let codeResult = ''

  frames.forEach((frame: FrameBuf, frameNr: number) => {
    const screenMatrix: number[] = getMatrix(frame, space, cell => cell.code)
    const colorMatrix: number[] = getMatrix(frame, firstFrameBackgroundColor, cell => cell.color)

    // encode the first frame as run lenght encoded data
    if (rleEncodeFirstFrame && frameNr === 0) {
      optimizeInvisibleScreenCodeWrites(screenMatrix, prevScreenMatrix, colorMatrix, frame.backgroundColor)
      const firstFrameData = encode(screenMatrix)
      firstFrame = firstFrameLabel + renderBytes(firstFrameData) + '\n'
    } else {
      // collect memory writes (address, value) for the screen codes
      // pass the previous matrix so we only need to collect writes
      // for the difference
      codeTablesHi += `!byte b.hi(${frame.name})\n`
      codeTablesLo += `!byte b.lo(${frame.name})\n`
      const writes: WriteBuffer = createBuffer()

      optimizeInvisibleScreenCodeWrites(screenMatrix, prevScreenMatrix, colorMatrix, frame.backgroundColor)
      optimizeInvisibleColorWrites(colorMatrix, prevColorMatrix, screenMatrix)

      const screenWrites: WriteOperation[] = delta(screenMem, screenMatrix, prevScreenMatrix)
      const colorWrites: WriteOperation[] = delta(colorMem, colorMatrix, prevColorMatrix)

      // const backgroundColorWrite: WriteOperation = { address: backgroundColor, value: frame.backgroundColor }
      // const borderColorWrite: WriteOperation = { address: borderColor, value: frame.backgroundColor }

      // optimize color writes by re-using screen values
      const usedScreenCodes: number[] = allScreenCodes(screenWrites)
      colorWrites.forEach(w => optimizeColorWrite(w, usedScreenCodes))
      // if (backgroundColor != previousBackgroundColor) {
      //   optimizeColorWrite(backgroundColorWrite, usedScreenCodes)
      //   addWrite(writes, backgroundColorWrite)
      // }
      // if (borderColor != previousBorderColor) {
      //   optimizeColorWrite(borderColorWrite, usedScreenCodes)
      //   addWrite(writes, borderColorWrite)
      // }
      screenWrites.forEach(w => addWrite(writes, w))
      colorWrites.forEach(w => addWrite(writes, w))

      // generate code that performs the memory writes in an optimized way
      codeResult += generateCode(writes, frame.name)
    }
    prevScreenMatrix = screenMatrix
    prevColorMatrix = colorMatrix
    // previousBorderColor = borderColor
    // previousBackgroundColor = backgroundColor
  })

  await writeFile(`${filename}${outExtension}`, firstFrame + codeTablesHi + codeTablesLo + codeResult)
}

(async function () {
  await convert(process.argv[2])
})()
