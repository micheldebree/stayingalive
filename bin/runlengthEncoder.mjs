// use 0 as run marker; N.B. cannot be used as a screencode anymore!

export const runMarker = 0

// minimum run is 3, because a run needs 3 bytes to encode,
// encoding smaller runs will increase the size
export const minRunLength = 4
export const maxRunLength = 255

export function encode (bytes) {
  let currentByte
  let runLength = 0
  const result = []

  bytes.forEach((b, i) => {
    const isLastByte = (i === (bytes.length - 1))

    // same byte again? count towards current cun
    if (b === currentByte) {
      // TODO: maximize runlength
      runLength++
    }

    // flush current run if a new value starts or the end has been reached
    if (b !== currentByte || isLastByte) {
      // flush previous run
      if (runLength >= minRunLength) {
        result.push(runMarker)
        result.push(runLength)
        result.push(currentByte)
      } else {
        for (let ii = 0; ii < runLength; ii++) {
          result.push(currentByte)
        }
      }
      // start with counting the run of the new value
      runLength = 1
    }
    // if the last value is a new value, flush it
    if (b !== currentByte && isLastByte) {
      result.push(b)
    }
    currentByte = b
  })
  return result
}

export function decode (bytes) {
  const result = []

  let i = 0

  while (i < bytes.length) {
    let value = bytes[i]
    let length = 1
    if (value === runMarker) {
      i++
      length = bytes[i]
      i++
      value = bytes[i]
    }
    for (let ii = 0; ii < length; ii++) {
      result.push(value)
    }
    i++
  }

  return result
}
