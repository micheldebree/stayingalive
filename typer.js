const nrSprites = 6
const bytesPerSprite = 64
const bytesPerTypedLine = 3 * 8

const romCharAddress = 0xd000
const nrChars = 64 // nr of characters supported

function charAddresses () {
  return Array(nrChars).fill(0).map((_unused, i) => romCharAddress + i * 8)
}

function spriteAddresses (baseAddress) {
  const result = []
  for (let line = 0; line < 2; line++) {
    for (let sprite = 0; sprite < nrSprites; sprite++) {
      for (let char = 0; char < 3; char++) {
        result.push(baseAddress + sprite * bytesPerSprite + char + line * bytesPerTypedLine)
      }
    }
  }
  return result
}

module.exports = {
  charAddresses: (_unused) => charAddresses(),
  spriteAddresses: (_unused, baseAddress) => spriteAddresses(baseAddress)
}
