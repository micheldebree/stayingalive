// 17| $d011 |RST8| ECM| BMM| DEN|RSEL|    YSCROLL   | Control register 1
const d011 = {
  yscroll: 0,
  rsel: 3,
  den: 4,
  bmm: 5,
  ecm: 6,
  rst8: 7
}

// 22| $d016 |  - |  - | RES| MCM|CSEL|    XSCROLL   | Control register 2
const d016 = {
  xscroll: 0,
  csel: 3,
  mcm: 4
}

// 24| $d018 |VM13|VM12|VM11|VM10|CB13|CB12|CB11|  - | Memory pointers
const d018 = {
  cb: 1, // character bitmaps
  vm: 4 // video matrix
}

const size = {
  bank: 0x4000,
  screen: 0x400,
  font: 0x800,
  sprite: 0x40,
  char: 8,
  spriteWidth: 24,
  spriteHeight: 21,
  nrSprites: 8
}

const color = {
  black: 0,
  white: 1,
  red: 2,
  cyan: 3,
  purple: 4,
  green: 5,
  blue: 6,
  yellow: 7,
  orange: 8,
  brown: 9,
  lightRed: 10,
  darkGray: 11,
  mediumGray: 12,
  lightGreen: 13,
  lightBlue: 14,
  lightGray: 15
}

const sprites = {
  x: (i) => 0xd000 + i * 2,
  y: (i) => 0xd001 + i * 2,
  xHibits: 0xd010,
  enabled: 0xd015,
  doubleHeight: 0xd017,
  prio: 0xd01b,
  multiColor: 0xd01c,
  doubleWidth: 0xd01d,
  multiColor1: 0xd025,
  multiColor2: 0xd026,
  color: (i) => 0xd027 + i,
  pointer: (screenMatrix, i) => screenMatrix + 0x03f8 + i
}

module.exports = {
  size,
  color,
  sprites,
  d011,
  d016,
  d018,

  // return property p of object o, or d if undefined
  optional: (_unused, o, p, d) => {
    return o[p] ?? d
  },

  setBit: (_unused, value, bitNr) => {
    if (bitNr < 0 || bitNr > 7) {
      throw new Error('bitNr must be 0-7')
    }
    return value | (1 << bitNr)
  },

  clearBit: (_unused, value, bitNr) => {
    if (bitNr < 0 || bitNr > 7) {
      throw new Error('bitNr must be 0-7')
    }
    const mask = 0b11111111 ^ (1 << bitNr)
    return value & mask
  },

  initD011: (_unused, options) => {
    const yscroll = options.yScroll ?? 0b011
    const rsel = options.rows ?? 1
    const den = options.enable ?? 1
    const bmm = options.bitmap ?? 0
    const ecm = options.ecm ?? 0
    const rst8 = options.rasterHi ?? 0

    return yscroll & 0b111 |
      (rsel & 1) << d011.rsel |
      (den & 1) << d011.den |
      (bmm & 1) << d011.bmm |
      (ecm & 1) << d011.ecm |
      (rst8 & 1) << d011.rst8
  },

  initD016: (_unused, options) => {
    const xscroll = options.xScroll ?? 0
    const csel = options.cols ?? 1
    const mcm = options.multiColor ?? 0

    return (xscroll << d016.xscroll) |
      (csel << d016.csel) |
      (mcm << d016.mcm)
  },

  initD018: (_unused, options) => {
    const vm = options.screenNr ?? 1
    const cb = options.fontNr ?? 2

    if (vm >= 16) {
      throw new Error('screenNr should be below 16')
    }
    if (cb >= 8) {
      throw new Error('fontNr should be below 8')
    }
    return (vm << d018.vm) | (cb << d018.cb)
  },

  // A Bad Line Condition is given at any arbitrary clock cycle, if at the
  // negative edge of �0 at the beginning of the cycle RASTER >= $30 and RASTER
  // <= $f7 and the lower three bits of RASTER are equal to YSCROLL and if the
  // DEN bit was set during an arbitrary cycle of raster line $30.
  isBadLine: (_unused, rasterY, yScroll) => {
    return rasterY >= 0x30 && rasterY <= 0xf7 && (rasterY & 0b111) === (yScroll & 0b111)
  },

  // calculate the new value for D011 that triggers a bad line on rasterY
  calcBadline: (_unused, currentD011Value, rasterY) => {
    return (currentD011Value & 0b11111000) | (rasterY & 0b111)
  },

  spriteX: (_unused, spriteNr) => {
    return 0xd000 + (spriteNr << 1)
  },

  spriteY: (_unused, spriteNr) => {
    return 0xd001 + (spriteNr << 1)
  }

}
