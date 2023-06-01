import { Screen, ScreenCell } from './petmate.js'
import crypto from 'crypto'

const COLOR_UNDEFINED = -1
const TILESET_UPPER_PETSCII = 'EB469555-5D3F-4EEC-9323-460F8EAFFA91'
const COLORPALLETTE_C64 = '8C9DDFC4-71A4-471E-833C-649768EF7F50'

export interface Cell {
  t: number // tile
  fc: number // foreground
  bc: number // background
}

export interface Frame {
  data: Cell[][]
  bgColor: number
  borderColor: number
}

export interface Layer {
  id: string
  label: string
  gridWidth: number
  gridHeight: number
  colorPerMode: string
  screenMode: string
  cellWidth: number
  cellHeight: number
  tileSetId: string
  colorPaletteId: string
  blockMode: boolean
  frames: Frame[]
}

export interface TileMap {
  frames: object
  layers: Layer[]
  name: string
}

export interface Export {
  version: number
  tileMap: TileMap
}

function toCell (screenCell: ScreenCell): Cell {
  return {
    t: screenCell.code,
    fc: screenCell.color,
    bc: COLOR_UNDEFINED
  }
}

export function toFrame (screen: Screen): Frame {
  const data: Cell[][] = []
  for (let y = 0; y < 25; y++) {
    const row: Cell[] = []
    for (let x = 0; x < 40; x++) {
      row.push(toCell(screen.cells[y * 40 + x]))
    }
    data.push(row)
  }
  return {
    data: data,
    bgColor: screen.backgroundColor,
    borderColor: 0
  }
}

export function toLayer (frames: Frame[]): Layer {
  return {
    id: crypto.randomUUID(),
    label: 'Layer 0',
    gridWidth: 40,
    gridHeight: 25,
    colorPerMode: 'cell',
    screenMode: 'textMode',
    cellWidth: 8,
    cellHeight: 8,
    tileSetId: TILESET_UPPER_PETSCII,
    colorPaletteId: COLORPALLETTE_C64,
    blockMode: false,
    frames: frames
  }
}

export function toExport (layer: Layer) {
  return {

    version: 1,
    tileMap: {
      frames: {
        duration: 12
      }
    }
  }
}
