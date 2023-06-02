const commandTypes = { toggle: 0x00, bgcolor: 0x80, reset: 0x40, nop: 0x20 }
const toggleTypes = { runner: 0, heart: 1, dancemove1: 2, banana: 3, iloveu: 4, heartspin: 5, typer: 7, logo: 6, wipe: 8, music: 9 }

module.exports = {
  commandTypes,
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
