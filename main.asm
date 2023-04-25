; vim:set ft=c64jasm:
!include "lib/kernal.asm"
!include "lib/vic.asm"
!include "lib/debug.asm"
!include "lib/irq.asm"
!use "lib/vic.js" as vic
!use "lib/bytes.js" as b
!use "lib/sid.js" as sid

!let screenMatrix = $400

!let music = sid("res/staying.sid")
!let firstRasterY = $ff
!let frameRate = 3

!segment musicSegment(start = music.location, end = music.location + $1400)

; copy the character data that is hidden in the ROM underneath $d000 to a location in RAM,
; so we can use it and also use the VIC and SID registers
!macro copyRomChar(charIndex, toAddress) {
    lda $01
    pha
    ; make rom characters visible
    lda #%00110011
    sta $01
    !for i in range(8) {
      lda $d000 + charIndex * 8 + i
      sta toAddress + i * 3
      sta toAddress + (i + 8) * 3
      sta toAddress + i * 3 + 1
      sta toAddress + (i + 8) * 3 + 1
      sta toAddress + i * 3 + 2
      sta toAddress + (i + 8) * 3 + 2
    }
    pla
    sta $01
}

* = $0801

+debug::reserveRange("screen matrix", screenMatrix, screenMatrix + 1000)

basic:
+kernal::basicstart(start)
+debug::registerRange("basic start", basic)

!include "typer.asm"
!include "animation.asm"
!include "animationDance.asm"
!include "animationHeart.asm"
!include "animationWalker.asm"

!segment default

start:

  sei
  jsr init
  +irq::disableKernalRom()
  +irq::disableTimerIrqs()

  ; dummy NMI (Non Maskable Interupt)
  ; to avoid crashing due to RESTORE
  lda #<mainIrq::return
  sta $fffa
  lda #>mainIrq::return
  sta $fffb
  +irq::set(firstRasterY, mainIrq)

  ; enable raster interrupts and turn interrupts back on
  lda #$01
  sta $d01a
  cli
  ; do nothing and let the interrupt do all the work.
  jmp *

init: {
  +kernal::clearScreen()
  +vicmacro::selectBank(0)

  lda #1
  sta $d020
  sta $d021

initColorRam: {
  ldx #0
  lda #0
  sta $d020
loop:
  sta $d800,x
  sta $d900,x
  sta $da00,x
  sta $db00,x
  inx
  bne loop
}

  lda #vic.initD011({})
  sta $d011

  lda #vic.initD018({})
  sta $d018

  lda #vic.initD016({})
  sta $d016

  ; jsr typer::setupSprites

; +copyRomChar(1, spriteData)

  ; jsr animationWalker::drawKeyframe
  jsr animationDance::drawKeyframe
  ; jsr drawRandomJunk
  lda #0
  jsr music.init

  rts
}

mainIrq:  {
  ; inc $d020
  jsr animationWalker::advance
  jsr animationDance::advance
  ; jsr animationHeart::advance
  ; dec $d020
  jsr music.play

; ack and return
  asl $d019
return:
  rti
}

initRandom: {
  lda #$ff  ; maximum frequency value
  sta $d40e ; voice 3 frequency low byte
  sta $d40f ; voice 3 frequency high byte
  lda #$80  ; noise waveform, gate bit off
  sta $d412 ; voice 3 control register
  rts
}

drawRandomJunk: {
  jsr initRandom
  ldx #0
for:
  !for i in range(4) {
    lda $d41b
    sta $0400 + i * $100,x
    and #%11
    sta $d800 + i * $100,x
  }
  inx
  bne for
  rts
}

+debug::registerRange("main code", start)

; advancePlayhead: {
;   inc playhead
;   bne return
;     inc playhead + 1
;
; check:
;
;   ldx #0
;   lda timelineLo,x
;   cmp playhead
;   bne return
;     lda timelineHi,x
;     cmp playhead + 1
;     bne return
;
; return:
;   rts
; }

; timelineHi:
;   !byte 0
;
; timelineLo:
;   !byte 0
;
; playhead:
;   !byte 0,0

!segment musicSegment

musicData:
!byte music.data

+debug::registerRange("music", musicData)

!! debug::js.outputMemoryMap()

+debug::reserveRange("color memory", $d800, $d800 + 1000)
