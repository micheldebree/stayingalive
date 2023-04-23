; vim:set ft=c64jasm:
!filescope typer

!let spritePointer = $f8
!let nrSprites = 8
!let spriteSize = $40
!let spriteData = spritePointer * spriteSize

!segment default

setupSprites: {
  lda #0
  sta vic.sprites.prio
  lda #%11111111
  sta vic.sprites.enabled
  sta vic.sprites.doubleHeight
  sta vic.sprites.doubleWidth
  tay
  lda #%11100000
  sta vic.sprites.xHibits
  ; ldx #$50
  ; !for i in range(nrSprites) {
  ;   lda #24 + (i * 2 * 24)
  ;   sta vic.sprites.x(i)
  ;   lda #i
  ;   sta vic.sprites.color(i)
  ;   stx vic.sprites.y(i)
  ;   sty vic.sprites.pointer(screenMatrix, i)
  ; }

  ldx #0
  ldy #0
  lda #24
loop:
  sta vic.sprites.x(0),y
  lda #50
  sta vic.sprites.y(0),y
setPointer:
  lda #$f8
  sta vic.sprites.pointer(screenMatrix, 0),x
  lda vic.sprites.x(0),y
  clc
  adc #24 * 2
  inc setPointer + 1
  iny
  iny
  inx
  cpx #nrSprites
  bne loop
  rts
}

!segment spriteSegment(start = spriteData, end = spriteData + nrSprites * spriteSize)
!segment spriteSegment

theSprite:

!fill nrSprites * spriteSize, $ff

+debug::registerRange("sprites", theSprite)
