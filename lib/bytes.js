function asc2int (asc) {
  return asc.charCodeAt(0)
}

function asciiToScreencode (asc) {
  if (asc >= 'a' && asc <= 'z') {
    return asc2int(asc) - asc2int('a') + 1
  }
  if (asc >= 'A' && asc <= 'Z') {
    return asc2int(asc) - asc2int('A') + 0x41
  }
  if (asc >= '0' && asc <= '9') {
    return asc2int(asc) - asc2int('0') + 0x30
  }
  const otherChars = {
    '@': 0,
    ' ': 0x20,
    '!': 0x21,
    '"': 0x22,
    '#': 0x23,
    $: 0x24,
    '%': 0x25,
    '&': 0x26,
    "'": 0x27,
    '(': 0x28,
    ')': 0x29,
    '*': 0x2a,
    '+': 0x2b,
    ',': 0x2c,
    '-': 0x2d,
    '.': 0x2e,
    '/': 0x2f,
    ':': 0x3a,
    ';': 0x3b,
    '<': 0x3c,
    '=': 0x3d,
    '>': 0x3e,
    '?': 0x3f
  }
  if (asc in otherChars) {
    return otherChars[asc]
  }
  throw new Error(`Could not convert '${asc}' to screencode`)
}

function toScreencodes (s) {
  return Array.from(s).map(c => asciiToScreencode(c))
}

module.exports = {
  // low byte of n
  lo: (_unused, n) => n & 0xff,

  // high byte of n
  hi: (_unused, n) => (n >> 8) & 0xff,

  // low, high byte of n
  lohi: (_unused, n) => [n & 0xff, (n >> 8) & 0xff],

  // low bytes of array s
  loBytes: (_unused, s) => s.map(b => b & 0xff),

  // high bytes of array s
  hiBytes: (_unused, s) => s.map(b => (b >> 8) & 0xff),

  // hex formatting of n
  hex: (_unused, n) => {
    let pfx = n < 0x1000 ? '$0' : '$'
    pfx = n < 0x100 ? `${pfx}0` : pfx
    pfx = n < 0x10 ? `${pfx}0` : pfx
    return `${pfx}${n.toString(16)}`
  },

  hexbyte: (_unused, n) => {
    return `$${n.toString(16)}`
  },

  // all bytes from a file
  fromFile: ({ readFileSync, resolveRelative }, filename) => {
    const buf = readFileSync(resolveRelative(filename))
    const result = []
    for (const v of buf.values()) {
      result.push(v)
    }
    console.log(`${result.length} bytes read from ${filename}`)
    return result
  },

  // ascii text to screencode
  screencode: (_unused, s) => {
    return toScreencodes(s)
  },

  // ascii from file to screencode
  toScreencode: ({ readFileSync, resolveRelative }, txt) => {
    const result = []
    const filename = resolveRelative(txt)
    const file = readFileSync(filename)
    const values = file.values()

    for (const v of values) {
      result.push(asciiToScreencode(String.fromCharCode(v).toLowerCase().replace('\n', ' ')))
    }
    return result
  },

  // lo and hi tables for an array of numbers
  lohiBytes: (_unused, s) => ({
    loBytes: s.map(b => b & 0xff),
    hiBytes: s.map(b => (b >> 8) & 0xff)
  })
}
