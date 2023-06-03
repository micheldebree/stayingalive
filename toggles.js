const commandTypes = { toggle: 0x00, bgcolor: 0x80, reset: 0x40, style: 0x20, nop: 0x10 }
// make sure the animations are first, as the index is used
// also for animation data tables
const toggleTypes = { runner: 0, heart: 1, dancemove1: 2, banana: 3, iloveu: 4, heartspin: 5, logo: 6, pulse: 7, cursor: 8, typer: 10, wipe: 12, music: 13 }

module.exports = {
  commandTypes,
  toggleTypes,
  playlist: ({ readFileSync, resolveRelative }, filename) => {
    const data = readFileSync(resolveRelative(filename))
    const playlist = JSON.parse(data)

    return {
      ticksLower: playlist.map(entry => parseInt(entry.tick, 16) & 0xff),
      ticksUpper: playlist.map(entry => (parseInt(entry.tick, 16) >> 8) & 0xff),
      commands: playlist.map(entry => {
        const cmd = commandTypes[entry.cmd]
        const arg = (cmd === commandTypes.toggle || cmd === commandTypes.reset)
          ? toggleTypes[entry.arg]
          : parseInt(entry.arg, 16)
        return cmd | arg
      })
    }
  }
}
