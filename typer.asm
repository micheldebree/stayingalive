; vim:set ft=c64jasm:
; type with rom character set into a sprite carpet
!filescope typer
!use "typer.js" as js
!use "lib/bytes.js" as b

!let spritePointer = $f8
!let nrSprites = 8
!let spriteSize = $40
!let spriteData = spritePointer * spriteSize
!let expandSprites = 0

; https://www.pagetable.com/c64ref/charset/
!let char = {
  heart: $53,
  newline: $fd,
  clear: $fe,
  pause: $ff
}

!let zp = {
  xPosLo: $f7,
  xPosHi: $f8
}

!segment data

maskCommand:
  !byte %10000000 ; msb set = command

maskAnimation: ; $8x = select animation
  !byte %01110000 


text:
  !byte b.screencode("ok friend, let's start"),$80,char.pause,$81
  !byte b.screencode("with some push-ups!"),char.pause,char.clear
  ; !byte b.screencode("dear friend."),$fe
  !byte b.screencode("and remember..."),char.pause,char.newline
  !byte b.screencode("i "),char.heart,b.screencode(" you!"),char.pause,char.clear
  !byte b.screencode("i am alive!"),char.newline
  !byte b.screencode("alive!!!"),char.clear
  !byte b.screencode("and it is all"), char.newline, b.screencode("thanks to you!"),char.pause

  !byte $ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff
  !byte $ff,$ff,$ff,$ff,$ff,$ff,$ff,$ff

!segment code

setupSprites: {
  jsr clear
  lda #0
  sta vic.sprites.prio
  lda #%11111111
  sta vic.sprites.enabled
  lda #%11111111 * expandSprites
  sta vic.sprites.doubleHeight
  sta vic.sprites.doubleWidth
  tay
  lda #%11100000 * expandSprites
  sta vic.sprites.xHibits
  ldx #0
  ldy #0
  lda #24
loop:
  lda #50
  sta vic.sprites.y(0),y
setPointer:
  lda #$f8
  sta vic.sprites.pointer(screenMatrix, 0),x
  ; lda vic.sprites.x(0),y
  ; clc
  ; adc #24 * (expandSprites + 1)
  inc setPointer + 1
  iny
  iny
  inx
  cpx #nrSprites
  bne loop
  lda #1
  jsr setColor
  jsr setSmall
  rts
}

setColor: {
  ldx #nrSprites - 1
loop:
  sta vic.sprites.color(0),x
  dex
  bpl loop
  rts
}

setBig: {
  lda #$ff
  sta vic.sprites.doubleHeight
  sta vic.sprites.doubleWidth
  ldx #7 * 2
loop:
  lda spriteCoordsBig,x
  sta $d000,x
  dex
  bpl loop
  lda #%11100000
  sta vic.sprites.xHibits
  rts
}

setSmall: {
  lda #0
  sta vic.sprites.doubleHeight
  sta vic.sprites.doubleWidth
  sta vic.sprites.xHibits
  ldx #7 * 2
loop:
  lda spriteCoordsSmall,x
  sta $d000,x
  dex
  bpl loop
  rts
}

!segment data

spriteCoordsBig:
!for i in range(8) {
  !byte 24 + i * 48, 50
}

spriteCoordsSmall:
!for i in range(8) {
  !byte 24 + i * 24, 50
}

!segment code

copyRomChar: { ; copy data of 1 character from rom to sprite

; x holds the screencode of the character to type
; y holds the type position in nr of characters

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

cursor: { ; display blinking cursor

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
  beq draw
    lda #$ff ; a holds the byte to write, is already 0 if not in this branch
draw:
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

type: { ; advance the typing by one step
  jsr cursor
  dec typeDelay
  beq doIt
  rts

doIt:
  ldy cursorPosition
  lda randomDelays,y
  sta typeDelay

!let textPosition = * + 1
  ldx #0
  inc textPosition
  lda text,x
  bit maskCommand
  bne doCommand
    tax
    inc cursorPosition
    jmp copyRomChar

doCommand:
  cmp #$ff
  bne noWait
    lda #$ff
    sta typeDelay
    rts

noWait:
  cmp #$fe
  bne noClear
    jsr clear
    rts

noClear:
  cmp #$fd
  bne noNewline
    lda #3 * nrSprites
    sta cursorPosition
    lda #32 ; fixed delay
    sta typeDelay
    ldx #$20 ; clear cursor
    jmp copyRomChar

noNewline:
  ; bit maskAnimation
  ; bne else
    and #1
    tax
    jsr toggle::toggleFlag
    rts

}

clear: { ; clear the sprite carpet
  lda #0
  ldx #63
clearData:
  sta spriteData,x
  sta spriteData + 1 * 64,x
  sta spriteData + 2 * 64,x
  sta spriteData + 3 * 64,x
  sta spriteData + 4 * 64,x
  sta spriteData + 5 * 64,x
  sta spriteData + 6 * 64,x
  sta spriteData + 7 * 64,x
  dex
  bpl clearData
  sta cursorPosition
  rts
  ; TODO: bottom 5 lines do not need clearing because they remain empty
}

!segment data

; current state
typeDelay:
  !byte 16

cursorPosition:
  !byte 0

; delay value per typing position
randomDelays:
  !byte js.randomDelays()

; address in rom for each char
!let charAddresses = js.charAddresses()

charOffsetLo:
  !byte b.loBytes(charAddresses)

charOffsetHi:
  !byte b.hiBytes(charAddresses)

; address in sprite data for each typing position
!let spriteAddresses = js.spriteAddresses(spriteData)

spriteAddrLo:
  !byte b.loBytes(spriteAddresses)
  
spriteAddrHi:
  !byte b.hiBytes(spriteAddresses)

+debug::registerRange("typer data", typeDelay)
