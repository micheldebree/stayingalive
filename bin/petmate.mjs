import { writeFile } from 'node:fs/promises'

const cols = 40
const rows = 25

// screen = { screenCodes, colors }
function toFramebuf (screen, name) {
  const { screenCodes, colors, backgroundColor } = screen

  const framebuf = []
  for (let y = 0; y < rows; y++) {
    const row = []
    for (let x = 0; x < cols; x++) {
      const code = screenCodes[y * cols + x]
      const color = colors[y * cols + x]
      row.push({ code, color })
    }
    framebuf.push(row)
  }
  return {
    width: cols,
    height: rows,
    backgroundColor,
    borderColor: 0,
    charset: 'upper',
    name,
    framebuf,
    customFonts: {}
  }
}

// TODO: different background color per frame
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
