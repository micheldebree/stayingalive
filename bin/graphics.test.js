import { countBits } from './graphics.mjs'

test('test countBits', () => {

  expect(countBits(0)).toEqual(0)
  expect(countBits(0xff)).toEqual(8)
  expect(countBits(0b01010101)).toEqual(4)
  expect(countBits(0b10101010)).toEqual(4)
  expect(countBits(0b00000010)).toEqual(1)
  expect(countBits(0b01000000)).toEqual(1)
  expect(countBits(0b00111000)).toEqual(3)
})
