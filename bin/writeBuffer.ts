// collect memory writes and generate optimized code
// to perform them
import {opcode, render} from './codegen.js'

export type WriteBuffer = Array<Array<number>>
export type WriteOperation = { address: number, value: number }

export function createBuffer(): WriteBuffer {
  return Array(255).fill(0).map(() => [])
}

// add a new write (address, value) to the buffer
export function addWrite(buffer: WriteBuffer, operation: WriteOperation): void {
  buffer[operation.value].push(operation.address)
}

// TODO: if byte is one lower or higher, use inc or dec instead of write
// TODO: reuse lower nibble of character writes for color writes
export function generateCode(buffer: WriteBuffer, label: string): string {
  let result = `${label}:\n`
  let lastIndex = -2
  let cycles = 0
  let bytes = 0
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
