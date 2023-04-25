// collect memory writes and generate optimized code
// to perform them
const { opcode, render } = require('./codegen.js')

function createBuffer () {
  const result = []
  for (let i = 0; i < 256; i++) { result.push([]) }
  return result
}

function addWrites (buffer, prevMatrix, address, bytes) {
  bytes.forEach((byte, i) => {
    // TODO: if byte is one lower or higher, use inc or dec instead of write
    // if (Math.floor(Math.random() * 5) !== 0) {
    if (prevMatrix[i] !== byte) { buffer[byte].push(address + i) }
    // }
  })
}

function generateCode (buffer, label) {
  let result = `${label}:\n`
  let lastIndex = -2
  let cycles = 0
  let bytes = 0
  buffer.forEach((addrList, i) => {
    if (addrList.length > 0) {
      if (i === lastIndex + 1) {
        result += render.implied(opcode.inx)
        cycles += opcode.inx.implied.cycles
        bytes += opcode.inx.implied.bytes
      } else {
        result += render.imm(opcode.ldx, i)
        cycles += opcode.ldx.imm.cycles
        bytes += opcode.ldx.imm.bytes
      }
      lastIndex = i
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

module.exports = { createBuffer, addWrites, generateCode }
