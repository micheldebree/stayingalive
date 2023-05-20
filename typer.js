// pre-calc data for typing into sprite data

const nrSprites = 8 // nr of sprites to use
const bytesPerSprite = 64 // fixed size of a sprite in bytes
const charsPerSprite = 3 // three 8x8 chars fit in one sprite horizontally
const nrLines = 2 // two 8x8 chars fit in one sprite vertically, giving 2 lines to type
const bytesPerTypedLine = charsPerSprite * 8
const minDelay = 2
const maxDelay = 8

const romCharAddress = 0xd000
const nrChars = 128 // nr of characters supported

// address for the data of each char
function charAddresses () {
  return Array(nrChars).fill(0).map((_unused, i) => romCharAddress + i * 8)
}

// address in sprite data to copy char to
// layed out in the order that is being typed in:
// |  0  1  2 |  3  4  5 |  6  7  8 |  9 10 11 | 12 13 14 | 15 16 17 |
// | 18 19 20 | 21 22 23 | 24 25 26 | 27 28 29 | 30 31 32 | 33 34 35 |
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

// a random delay per typing position
function randomDelays () {
  return Array(nrSprites * charsPerSprite * nrLines).fill(0).map(() => minDelay + Math.random() * maxDelay)
}

module.exports = {
  charAddresses: () => charAddresses(),
  spriteAddresses: (_unused, baseAddress) => spriteAddresses(baseAddress),
  randomDelays: () => randomDelays()
}
