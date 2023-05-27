!filescope transition

!let zp = {
  scrOffset: $f7, ; and $f8
}

!let size = {
  cols: 40,
  rows: 25
}

!macro staW(addr, word) {
  lda #b.lo(word)
  sta addr
  lda #b.hi(word)
  sta addr + 1
}

!macro addW(addr, word) {
  lda addr
  clc
  adc #b.lo(word)
  sta addr
  lda addr + 1
  adc #b.hi(word)
  sta addr + 1
}

!segment code

!let column = selectColumn + 1

wipe:
; !break
  +staW(zp.scrOffset, screenMatrix)

selectColumn:
  ldy #0
  ldx #0

loop:
    lda #$20 ; space
    sta (zp.scrOffset),y
    +addW(zp.scrOffset, size.cols)
    inx
    cpx #size.rows
  bne loop ; while not all rows done
  inc column
  lda column
  cmp #size.cols
  bne done
    lda #0
    sta column
    +toggles::toggle(toggles::WIPE)
done:
  rts

