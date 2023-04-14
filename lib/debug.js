const { hex } = require('./bytes.js')

let pass = 0
const memorymap = {}

module.exports = {
  log (_unused, ...s) {
    console.log(s.reduce((a, e) => a + e))
  },
  registerRange (_unused, label, start, end) {
    memorymap[label] = [start, end - 1]
  },
  outputMemoryMap () {
    pass++
    if (pass === 3) {
      for (const label in memorymap) {
        console.log(`| ${hex(null, memorymap[label][0])} | ${hex(null, memorymap[label][1])} | ${label} |`)
      }
    }
  }
}
