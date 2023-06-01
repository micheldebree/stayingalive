module.exports = ({ readFileSync, resolveRelative }, filename) => {
  const data = readFileSync(resolveRelative(filename))
  const playlist = JSON.parse(data)

  return {
    ticksLower: playlist.map(entry => parseInt(entry.t, 16) & 0xff),
    ticksUpper: playlist.map(entry => (parseInt(entry.t, 16) >> 8) & 0xff),
    commands: playlist.map(entry => parseInt(entry.c, 16) & 0xff)
  }
}
