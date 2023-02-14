const fs = require('fs')

// processor(Buffer): byte[]
function processFile (filename, processor) {
  const filenameOut = `${filename}.bin`
  fs.writeFileSync(filenameOut, Buffer.from(processor(fs.readFileSync(filename, null))))
  console.log(filenameOut)
}

module.exports = processFile
