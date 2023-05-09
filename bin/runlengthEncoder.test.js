import { decode, encode, minRunLength, runMarker } from './runlengthEncoder.mjs'

test('test encoding', () => {
  testBothWays([3], [3])
  testBothWays([], [])
  testBothWays([3, 3, 3], [3, 3, 3])
  testBothWays([3, 3, 3, 3], [runMarker, minRunLength, 3])
  testBothWays([12, 12, 12, 12, 12], [runMarker, 5, 12])
  testBothWays([1, 3, 3, 3, 3], [1, runMarker, minRunLength, 3])
  testBothWays([1, 3, 3, 3, 2], [1, 3, 3, 3, 2])
  testBothWays([1, 3, 3, 3, 2, 2, 2], [1, 3, 3, 3, 2, 2, 2])
  testBothWays([1, 3, 3, 3, 2, 2, 2, 2], [1, 3, 3, 3, runMarker, minRunLength, 2])
})

function testBothWays (unencoded, encoded) {
  expect(encode(unencoded)).toEqual(encoded)
  expect(decode(encoded)).toEqual(unencoded)
}
