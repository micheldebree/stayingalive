; vim:set ft=c64jasm:
!filescope typer
!use "typer.js" as js
!use "lib/bytes.js" as b

!let spritePointer = $f8
!let nrSprites = 8
!let spriteSize = $40
!let spriteData = spritePointer * spriteSize

!segment code

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
  ldx #$50
  !for i in range(nrSprites) {
    lda #24 + (i * 2 * 24)
    sta vic.sprites.x(i)
    lda #i
    sta vic.sprites.color(i)
    stx vic.sprites.y(i)
    sty vic.sprites.pointer(screenMatrix, i)
  }
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

copyRomChar: {

; x holds the character to type
; y holds the type position

!let fromAddrLo = copyData + 1
!let fromAddrHi = copyData + 2
!let toAddrLo = copyDataTo + 1
!let toAddrHi = copyDataTo + 2

  lda charOffsetLo,x
  sta fromAddrLo
  lda charOffsetHi,x
  sta fromAddrHi

  lda spriteAddrLo, y
  sta toAddrLo
  lda spriteAddrHi, y
  sta toAddrHi

  lda #%00110011 ; make rom characters visible
  sta $01
  ldx #7
  ldy #7 * 3
copyData:
  lda $ffff,x
copyDataTo:
  sta $ffff,y
  dey
  dey
  dey
  dex
  bpl copyData
  +irq::disableKernalRom() ; restore mem visibility
  rts
}

cursor: {

!let toAddrLo = copyDataTo + 1
!let toAddrHi = copyDataTo + 2

  ldy cursorPosition
  lda spriteAddrLo, y
  sta toAddrLo
  lda spriteAddrHi, y
  sta toAddrHi

  inc delay + 1
delay:
  lda #$01
  and #%00010000
  beq doIt
turnOn:
  lda #$ff
doIt:
  ldx #7
  ldy #7 * 3
copyDataTo:
  sta $ffff,y
  dey
  dey
  dey
  dex
  bpl copyDataTo
  rts
}

type: {
  jsr cursor
  dec typeDelay
  beq doIt
  rts

doIt:
  ldy cursorPosition
  lda randomDelays,y
  sta typeDelay
  lda text,y
  tax
  inc cursorPosition
  jmp copyRomChar
}

typeDelay:
  !byte 16

cursorPosition:
  !byte 0

randomDelays:
  !byte js.randomDelays()

!let charAddresses = js.charAddresses()

charOffsetLo:
  !byte b.loBytes(charAddresses)

charOffsetHi:
  !byte b.hiBytes(charAddresses)

!let spriteAddresses = js.spriteAddresses(spriteData)

spriteAddrLo:
  !byte b.loBytes(spriteAddresses)
  
spriteAddrHi:
  !byte b.hiBytes(spriteAddresses)

text:
  !byte b.screencode("hello how are you?i am fine")
  !byte 0

!segment spriteSegment(start = spriteData, end = spriteData + nrSprites * spriteSize - 1)
!segment spriteSegment

!fill nrSprites * spriteSize, $ff

+debug::registerRange("sprites", spriteData)
