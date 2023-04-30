// utilities to render c64jasm source code

function hex(_unused, n) {
  return `$${n.toString(16)}`
}

export const opcode = {
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
  inc: {
    mnemonic: 'inc',
    abs: {
      code: 0xee,
      bytes: 3,
      cycles: 6
    }
  },
  dec: {
    mnemonic: 'dec',
    abs: {
      code: 0xce,
      bytes: 3,
      cycles: 6
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

export const render = {
  imm: (opcode, argument) => `${opcode.mnemonic} #${hex(null,
      argument)} ; ${opcode.imm.cycles}\n`,
  abs: (opcode, argument) => `${opcode.mnemonic} ${hex(null,
      argument)} ; ${opcode.abs.cycles}\n`,
  implied: (opcode) => `${opcode.mnemonic} ; ${opcode.implied.cycles}\n`
}

export function renderBytes(bytes) {
  let result = ''
  bytes.forEach((b,i ) => {
    if (i % 16 === 0) {
      result += "\n!byte "
    }
    else if (i > 0) {
      result += ','
    }
    result += hex(undefined, b)
  })
  return `${result}\n; ${bytes.length} bytes\n`;
}
