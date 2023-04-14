const modeline = '; vim:set ft=c64jasm:'

const { hex, hexbyte } = require('./bytes.js')

const opcode = {
  ldx: {
    mnemonic: 'ldx',
    imm: {
      code: 0xa2,
      bytes: 2,
      cycles: 2
    }
  },
  stx: {
    mnemonic: 'stx',
    abs: {
      code: 0x8e,
      bytes: 3,
      cycles: 4
    }
  },
  inx: {
    mnemonic: 'inx',
    implied: {
      code: 0xe8,
      bytes: 1,
      cycles: 2
    }
  },
  rts: {
    mnemonic: 'rts',
    implied: {
      code: 0x60,
      bytes: 1,
      cycles: 6
    }
  }
}

const render = {
  imm: (opcode, argument) => `${opcode.mnemonic} #${hexbyte(null, argument)} ; ${opcode.imm.cycles}\n`,
  abs: (opcode, argument) => `${opcode.mnemonic} ${hex(null, argument)} ; ${opcode.abs.cycles}\n`,
  implied: (opcode) => `${opcode.mnemonic} ; ${opcode.implied.cycles}\n`
}

module.exports = { modeline, opcode, render }