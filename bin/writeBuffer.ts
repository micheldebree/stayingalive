// collect memory writes and generate optimized code
// to perform them
import {opcode, render} from './codegen.js'

export type WriteBuffer = Array<Array<number>>

export function createBuffer(): WriteBuffer {
  return Array(255).fill(0).map(_v => [])
}

// add a new write (address, value) to the buffer
function addWrite(buffer: WriteBuffer, address: number, value: number): void {
  buffer[value].push(address)
}

// write a sequence of bytes beginning at startAddress
// only write differences
export function addWrites(buffer: WriteBuffer, startAddress: number, bytes: number[], prevBytes: number[] = []) {
  bytes.forEach((byte: number, i: number) => {
    // TODO: if byte is one lower or higher, use inc or dec instead of write
    // TODO: reuse lower nibble of character writes for color writes
    // if (Math.floor(Math.random() * 5) !== 0) {
    if (prevBytes[i] !== byte) {
      addWrite(buffer, startAddress + i, bytes[i])
    }
    // }
  })
}

export function generateCode(buffer: WriteBuffer, label: string): string {
  let result: string = `${label}:\n`
  let lastIndex: number = -2
  let cycles: number = 0
  let bytes: number = 0
  buffer.forEach((addrList: number[], value: number) => {
    if (addrList.length > 0) {
      if (value === lastIndex + 1) {
        result += render.implied(opcode.inx)
        cycles += opcode.inx.implied.cycles
        bytes += opcode.inx.implied.bytes
      } else {
        result += render.imm(opcode.ldx, value)
        cycles += opcode.ldx.imm.cycles
        bytes += opcode.ldx.imm.bytes
      }
      lastIndex = value
      addrList.forEach(addr => {
        result += render.abs(opcode.stx, addr)
        cycles += opcode.stx.abs.cycles
        bytes += opcode.stx.abs.bytes
      })
    }
  })
  cycles += opcode.rts.implied.cycles
  bytes += opcode.rts.implied.bytes
  return result + render.implied(opcode.rts) + `; ${cycles} cycles, ${bytes} bytes\n`
}
