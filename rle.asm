!filescope rle

!let zp = {
  fromLo: $f7,
  fromHi: $f8,
  toLo:   $f9,
  toHi:   $fa,
}

decodeFrame: { ; draw an RLE frame to $0400
 ; zp.fromLo and zp.fromHi contain the location of the RLE data

!let skip = step + 1

  lda #0
  sta zp.toLo
  lda #b.hi(screenMatrix)
  sta zp.toHi

loop:
  ldy #0
  ldx #1
  stx skip ; read one byte by default
  lda (zp.fromLo),y
  cmp #runmarker
  bne drawloop
; encountered a run
    iny
    lda (zp.fromLo),y
    tax ; x holds repeat
    iny
    lda (zp.fromLo),y ; a holds value
    iny
    sty skip ; skip 3 bytes instead of 1
  ldy #0

drawloop:
  sta (zp.toLo),y
  iny
  dex
  bne drawloop

  lda zp.fromLo
  clc
step:
  adc #1
  sta zp.fromLo
  lda zp.fromHi
  adc #0
  sta zp.fromHi

  tya
  clc
  adc zp.toLo
  sta zp.toLo
  lda zp.toHi
  adc #0
  sta zp.toHi
  cmp #b.hi(screenMatrix) + 3 
  bne loop
  lda zp.toLo
  cmp #$d0 ; stop before overwriting spritepointers
  bcc loop

rts
}
