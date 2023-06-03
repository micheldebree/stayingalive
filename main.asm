; vim:set ft=c64jasm:
!include "lib/kernal.asm"
!include "lib/vic.asm"
!include "lib/debug.asm"
!include "lib/irq.asm"
!include "lib/bytes.asm"
!use "lib/bytes.js" as b
!use "lib/sid.js" as sid

!let debugging = 1

; TODO
; - [ ] Command to change tune
; - [ ] Heartbeat intro
; - [X] Staying alive logo
; - [ ] > 256 bytes of text in typer
; - [ ] Animation speed control
; - [X] Animation reset (for heart)
; - [ ] Different text themes in typer (position, size)
; - [ ] Transition effects in typer (bounce, slide, put in border?)
; - [X] Variable pauses -> obsolete because of playlist

!let screenMatrix = $400

!let music = sid("res/staying.sid")
!let firstRasterY = $f8
!let frameRate = 2

!let zp = { ; zero page addresses in use for various things
  music0: $fc,
  music1: $fd,
  music2: $fe
}

!let spriteDataStart = $2000
!let spriteDataEnd = spriteDataStart + $40 * 8
!segment code(start=$0801, end=spriteDataStart-1)
!segment sprites(start=spriteDataStart, end=spriteDataEnd-1) ; sprites for the typer
!segment data(start=spriteDataEnd, end=$cfff)
!segment musicSegment(start=$e000, end=$ffff)

; N.B. c64 debugger seems to only support breakpoints in the first
; segment it encounters in the debug info xml
; c64jasm seems to output segments sorted by start address
; so the code segment needs to start lowest in memory in order to use
; breakpoints in c64 debugger

!segment code

basicStart:
  +kernal::basicstart(start)
  +debug::registerRange("basic", basicStart)

codeStart:

!include "toggles.asm"
!include "animation.asm"
!include "transition.asm"
!include "typer.asm"
!include "bouncer.asm"

!segment code

start: { ; set raster interrupt and init
  sei
  +kernal::clearScreen()
  +irq::disableKernalRom()
  +irq::disableTimerIrqs()
  jsr init

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
  +vic::selectBank(0)

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

; initScreenMatrix: {
;   lda #$a0
;   ldx #0
;  loop:
;   sta $0400,x
;   sta $0500,x
;   sta $0600,x
;   sta $0700,x
;   inx
;   bne loop
; }
;
  lda #vic::js.initD011({})
  sta $d011

  lda #vic::js.initD018({})
  sta $d018

  lda #vic::js.initD016({})
  sta $d016

  jsr drawRandomJunk
  jsr typer::setupSprites
  lda #1
  jsr music.init

  rts
}

mainIrq:  {
  jsr music.play
  ; +animation::play(animation::iloveu::nr, animation::iloveu::framesLo, animation::iloveu::framesHi, 0)
  +animation::play(animation::runner::nr, animation::runner::framesLo, animation::runner::framesHi, 1)
  +animation::play(animation::heart::nr, animation::heart::framesLo, animation::heart::framesHi, 1)
  +animation::play(animation::dancemove1::nr, animation::dancemove1::framesLo, animation::dancemove1::framesHi, 1)
  +animation::play(animation::banana::nr, animation::banana::framesLo, animation::banana::framesHi, 1)
  +animation::play(animation::heartspin::nr, animation::heartspin::framesLo, animation::heartspin::framesHi, 1)
  +animation::play(animation::pulse::nr, animation::pulse::framesLo, animation::pulse::framesHi, 1)
  +animation::play(animation::logo::nr, animation::logo::framesLo, animation::logo::framesHi, 0)
  +toggles::jsrWhenOn(toggles::WIPE, transition::wipe)
  +toggles::jsrWhenOn(toggles::CURSOR, typer::cursor)
  +toggles::jsrWhenOn(toggles::TYPER, typer::type)
  jsr toggles::tick
  ; jsr bouncer::bounce

  +toggles::jsrWhenOn(toggles::MUSIC, startMusic)

  !if (debugging) {
    jsr toggles::showPlayhead
  }


; ack and return
  asl $d019
return:
  rti
}

startMusic: {
  lda #0
  jsr music.init
  +toggles::toggle(toggles::MUSIC)
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
    ; and #%1111
    sta $d800 + i * $100,x
  }
  inx
  bne for
  rts
}

+debug::registerRange("main code", codeStart)

!segment musicSegment

musicData:
  !byte music.data

+debug::registerRange("music", musicData)

!! debug::js.outputMemoryMap()

