!filescope transition

!let zp = {
  scrOffset: $f7, ; and $f8
}

!let size = {
  cols: 40,
  rows: 25
}

!segment code

!let column = selectColumn + 1

wipe:
; !break
  +bytes::staW(zp.scrOffset, screenMatrix)

selectColumn:
  ldy #0
  ldx #0

loop:
    lda #$20 ; space
    sta (zp.scrOffset),y
    +bytes::addW(zp.scrOffset, size.cols)
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

