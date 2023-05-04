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

!let zp = { ; zero page addresses in use for various things
  music0: $fc,
  music1: $fd,
  music2: $fe
}

!let mem = {
  codeStart: $4000
}

!segment dataSegment(start=$0801, end=$3dff)
!segment mainCodeSegment(start = mem.codeStart, end = music.location - 1)
!segment musicSegment(start = music.location, end = music.location + music.data.length)

!macro copyRomChar(charIndex, toAddress) {
; copy the character data that is hidden in the ROM underneath $d000 to a location in RAM,
; so we can use it and also use the VIC and SID registers
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

!segment dataSegment

* = $0801

+debug::reserveRange("screen matrix", screenMatrix, screenMatrix + 1000)

basic:
+kernal::basicstart(start)
+debug::registerRange("basic start", basic)

!include "animation.asm"
; !include "animationDance.asm"
; !include "animationHeart2.asm"
!include "animationWalker.asm"

!segment default
; N.B. c64 debugger seems to only support breakpoints in the default
; segment.

* = mem.codeStart

defaultStart:

!include "typer.asm"

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

  ; lda #1
  ; sta $d020
  ; sta $d021

; initColorRam: {
;   ldx #0
;   lda #0
;   sta $d020
; loop:
;   sta $d800,x
;   sta $d900,x
;   sta $da00,x
;   sta $db00,x
;   inx
;   bne loop
; }

initScreenMatrix: {
  lda #$a0
  ldx #0
 loop:
  sta $0400,x
  sta $0500,x
  sta $0600,x
  sta $0700,x
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

; drawKeyframe: {
;   lda #b.lo(animationHeart2::firstFrame)
;   sta animation::zp.fromLo
;   lda #b.hi(animationHeart2::firstFrame)
;   sta animation::zp.fromHi
;   jsr animation::decodeFrame
; }

  jsr animationWalker::drawKeyframe
  ; jsr animationHeart2::drawKeyframe
  ; jsr drawRandomJunk
  lda #0
  jsr music.init

  rts
}

mainIrq:  {
  jsr animationWalker::advance
  ; jsr animationHeart2::advance
  ; jsr animationHeart::advance
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

+debug::registerRange("main code", defaultStart)

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

+debug::reserveRange("color memory", $d800, $d800 + 1000)

!! debug::js.outputMemoryMap()

