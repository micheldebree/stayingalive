; vim:set ft=c64jasm:
!include "lib/kernal.asm"
!include "lib/vic.asm"
!include "lib/debug.asm"
!include "lib/irq.asm"
!use "lib/vic.js" as vic
!use "lib/bytes.js" as b
!use "lib/sid.js" as sid

; TODO: only use RLE and double buffer to save space? 50Hz is too much
; for PETSCII animation anyway

!let screenMatrix = $400

!let music = sid("res/staying.sid")
!let firstRasterY = $ff
!let frameRate = 3

!let zp = { ; zero page addresses in use for various things
  music0: $fc,
  music1: $fd,
  music2: $fe
}

!segment code(start=$4000, end=$5fff)
!segment dataSegment(start=$0801, end=$3dff)
!segment musicSegment(start = music.location, end = music.location + music.data.length)

; N.B. c64 debugger seems to only support breakpoints in the first
; segment it encounters in the debug info xml
; c64jasm seems to output segments sorted by start address

defaultStart:

!include "typer.asm"
!include "animation.asm"

!segment dataSegment

+debug::reserveRange("screen matrix", screenMatrix, screenMatrix + 1000)

basic:
+kernal::basicstart(start)
+debug::registerRange("basic start", basic)

; !include "animationDance.asm"
; !include "animationHeart2.asm"
!include "animationWalker.asm"

!segment code

start: { ; set raster interrupt and init

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
}

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

  jsr typer::setupSprites
  jsr typer::type

; +copyRomChar(1, spriteData)

  jsr animationWalker::drawKeyframe

  ; jsr animationHeart2::drawKeyframe
  ; jsr drawRandomJunk
  lda #0
  jsr music.init

  rts
}

mainIrq:  {
  jsr animationWalker::advance
  ; inc $d020
  ; jsr typer::initCharacterSet
  ; dec $d020
  ; jsr animationHeart2::advance
  ; jsr animationHeart::advance
  jsr music.play
  jsr typer::type

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

