// use 0 as run marker; N.B. cannot be used as a screencode anymore!

// marks a run (marker, length, value)
export const runMarker: number = 0

// minimum run is 3, because a run needs 3 bytes to encode,
// encoding smaller runs will increase the size
export const minRunLength: number = 4
export const maxRunLength: number = 255

export function encode(bytes: number[]): number[] {
  let currentByte: number
  let runLength: number = 0
  const result: number[] = []

  bytes.forEach((b: number, i: number) => {
    const isLastByte: boolean = (i === (bytes.length - 1))
    const repeatedValue: boolean = b === currentByte
    const flushRun: boolean = !repeatedValue || isLastByte || runLength >= maxRunLength

    // same byte again? count towards current run
    runLength += repeatedValue ? 1 : 0

    if (flushRun) {
      // flush previous run
      if (runLength >= minRunLength) {
        result.push(runMarker)
        result.push(runLength)
        result.push(currentByte)
      } else {
        for (let ii: number = 0; ii < runLength; ii++) {
          result.push(currentByte)
        }
      }
      runLength = 1
      currentByte = b
    }

    if (!repeatedValue && isLastByte) {
      result.push(b)
    }
  })
  return result
}

export function decode(bytes: number[]): number[] {
  const result: number[] = []

  let i: number = 0

  while (i < bytes.length) {
    let value: number = bytes[i]
    let length: number = 1
    if (value === runMarker) {
      i++
      length = bytes[i]
      i++
      value = bytes[i]
    }
    for (let ii: number = 0; ii < length; ii++) {
      result.push(value)
    }
    i++
  }

  return result
}
