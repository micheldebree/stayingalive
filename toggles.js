const commandTypes = { toggle: 0x00, bgcolor: 0x80 }

module.exports = {
  commandTypes,
  playlist: ({ readFileSync, resolveRelative }, filename) => {
    const data = readFileSync(resolveRelative(filename))
    const playlist = JSON.parse(data)

    return {
      ticksLower: playlist.map(entry => parseInt(entry.tick, 16) & 0xff),
      ticksUpper: playlist.map(entry => (parseInt(entry.tick, 16) >> 8) & 0xff),
      commands: playlist.map(entry => commandTypes[entry.cmd] | parseInt(entry.arg, 16))
    }
  }
}
