// utilities to render c64jasm source code

function hex (n: number): string {
  return `$${n.toString(16)}`
}

type Mnemonic = 'ldx' | 'stx' | 'inx' | 'inc' | 'dec' | 'rts'
type ModeInfo = { code: number; bytes: number; cycles: number }
type Opcode = { mnemonic: Mnemonic; imm?: ModeInfo; abs?: ModeInfo; implied?: ModeInfo }

export const opcode: { [K in Mnemonic]?: Opcode } = {
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
  imm: (opcode: Opcode, argument: number) => `${opcode.mnemonic} #${hex(argument)} ; ${opcode.imm.cycles}\n`,
  abs: (opcode: Opcode, argument: number) => `${opcode.mnemonic} ${hex(argument)} ; ${opcode.abs.cycles}\n`,
  implied: (opcode: Opcode) => `${opcode.mnemonic} ; ${opcode.implied.cycles}\n`
}

export function renderBytes (bytes: number[]): string {
  let result = ''
  bytes.forEach((b, i) => {
    if (i % 16 === 0) {
      result += '\n!byte '
    } else if (i > 0) {
      result += ','
    }
    result += hex(b)
  })
  return `${result}\n; ${bytes.length} bytes\n`
}
