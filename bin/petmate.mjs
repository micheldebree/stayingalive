import { writeFile } from 'node:fs/promises'

const cols = 40
const rows = 25

function toFramebuf (screenCodes, name) {
  const framebuf = []
  for (let y = 0; y < rows; y++) {
    const row = []
    for (let x = 0; x < cols; x++) {
      const code = screenCodes[y * cols + x]
      row.push({ code, color: 1 })
    }
    framebuf.push(row)
  }
  return {
    width: cols,
    height: rows,
    backgroundColor: 0,
    borderColor: 0,
    charset: 'upper',
    name,
    framebuf,
    customFonts: {}
  }
}

export async function toPetmate (filename, screens) {
  const framebufs = screens.map((screen, i) => toFramebuf(screen, `screen_${i}`))
  const screenNumbers = Array.from(Array(screens.length).keys())

  const result = {
    version: 2,
    screens: screenNumbers,
    framebufs
  }

  await writeFile(filename, JSON.stringify(result))
  console.log(filename)
}
