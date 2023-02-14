module.exports = {
  log (_unused, ...s) {
    console.log(s.reduce((a, e) => a + e))
  }
}
