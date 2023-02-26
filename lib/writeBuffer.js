// create an array with a list of addresses for every possible byte value
function createBuffer () {
  const result = []
  for (let i = 0; i < 256; i++) {
    result.push([])
  }
  return result
}

function addWrites (buffer, prevMatrix, address, bytes) {
  bytes.forEach((byte, i) => {
    if (prevMatrix[i] !== byte) {
      buffer[byte].push(address + i)
    }
  })
}

function generateCode (buffer, label) {
  let result = `${label}:\n`
  let lastIndex = 0
  buffer.forEach((addrList, i) => {
    if (addrList.length > 0) {
      if (i === lastIndex + 1) {
        result += 'inx\n'
      } else {
        result += `ldx #${i}\n`
      }
      lastIndex = i
      addrList.forEach(addr => {
        result += `stx ${addr}\n`
      })
    }
  })
  result += 'rts\n'
  return result
}

module.exports = { createBuffer, addWrites, generateCode }
