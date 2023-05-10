import {writeFile} from 'node:fs/promises'

const cols: number = 40
const rows: number = 25

export type ScreenCell = { code: number, color: number }
export type Screen = { backgroundColor: number, cells: Array<ScreenCell> }
type FrameBuf = {
  width: number,
  height: number,
  backgroundColor: number,
  borderColor: number,
  charset: string,
  name: string,
  framebuf: Array<Array<ScreenCell>>
  customFonts: object
}
type Petmate = {
  version: number,
  screens: Array<number>,
  framebufs: Array<FrameBuf>

}

// screen = { screenCodes, colors }
function toFramebuf(screen: Screen, name: string): FrameBuf {

  const {backgroundColor, cells} = screen

  const framebuf: Array<Array<ScreenCell>> = []
  for (let y: number = 0; y < rows; y++) {
    const row: Array<ScreenCell> = []
    for (let x: number = 0; x < cols; x++) {
      const cell: ScreenCell = cells[y * cols + x]
      row.push(cell)
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

export async function toPetmate(filename: string, screens: Array<Screen>): Promise<void> {
  const framebufs: Array<FrameBuf> = screens.map((screen, i) => toFramebuf(screen, `screen_${i}`))
  const screenNumbers: Array<number> = Array.from(Array(screens.length).keys())

  const result: Petmate = {
    version: 2,
    screens: screenNumbers,
    framebufs
  }

  await writeFile(filename, JSON.stringify(result))
  console.log(filename)
}
