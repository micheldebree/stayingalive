; vim:set ft=c64jasm:
!include "lib/kernal.asm"
!include "lib/vic.asm"
!include "lib/debug.asm"
!include "lib/irq.asm"
!use "lib/vic.js" as vic
!use "lib/bytes.js" as b
!use "lib/sid.js" as sid

* = $0801

!let music = sid("res/staying.sid")

!let firstRasterY = $ff
!let frameRate = 3

+debug::reserveRange("screen matrix", $400, $400 + 1000)

basic:
+kernal::basicstart(start)
+debug::registerRange("basic start", basic)

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

  !let d011value = vic.initD011({})
  lda #d011value
  sta $d011

  !let d018value = vic.initD018({})
  lda #d018value
  sta $d018

  lda #vic.initD016({})
  sta $d016

  jsr drawKeyframe
  ; jsr drawRandomJunk
  lda #0
  jsr music.init

  rts
}

; the first frame is the keyframe, this is drawn beforehand
drawKeyframe: {
  lda dance::framesLo
  ; lda heart::framesLo
  sta keyframe + 1
  ; lda heart::framesHi
  lda dance::framesHi
  sta keyframe + 2
keyframe:
  jsr $0000
  rts
}

mainIrq:  {
  ; inc $d020
  jsr danceAnimation
  ; jsr heartAnimation
  ; jsr monitorAnimation
  ; jsr deadAnimation
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

!macro advanceAnimation(loPointers, hiPointers, nrFrames) {

  ; self-modifying code variables
  !let frameCallLo = frameCall + 1
  !let frameCallHi = frameCall + 2
  !let frameNr = frameIndex + 1
  !let delayCounter = frameDelay + 1

  frameDelay:
    lda #frameRate
    bne return
    lda #frameRate
    sta delayCounter

  frameIndex:
    ldx #1
    ; skip the first frame (keyframe) so it is only drawn on initialization
    lda loPointers,x 
    sta frameCallLo
    lda hiPointers,x
    sta frameCallHi

  frameCall:
  ; !break
    jsr $0000
    inc frameNr
    lda frameNr
    cmp #nrFrames
    bne return
      lda #1
      sta frameNr

  return:
    dec delayCounter
    rts
}

heartAnimation:
+advanceAnimation(heart::framesLo, heart::framesHi, 17)

monitorAnimation:
+advanceAnimation(monitor::framesLo, monitor::framesHi, 17)

deadAnimation:
+advanceAnimation(dead::framesLo, dead::framesHi, 6)

danceAnimation:
+advanceAnimation(dance::framesLo, dance::framesHi, 29)

+debug::registerRange("animation code", heartAnimation)

heart: {
  !include "res/pulse.heart.petmate.gen.asm"
  ; !include "res/pulse.nocred.petmate.gen.asm"
}

+debug::registerRange("heart", heart)

monitor: {
  !include "res/pulse.green.petmate.gen.asm"
}

+debug::registerRange("monitor", monitor)

dead: {
  !include "res/dead.petmate.gen.asm"
}

+debug::registerRange("dead", dead)

dance: {
  !include "res/dance.petmate.gen.asm"
}
+debug::registerRange("dance", dance)

advancePlayhead: {
  inc playhead
  bne return
    inc playhead + 1

check:

  ldx #0
  lda timelineLo,x
  cmp playhead
  bne return
    lda timelineHi,x
    cmp playhead + 1
    bne return

return:
  rts
}

timelineHi:
  !byte 0

timelineLo:
  !byte 0

playhead:
  !byte 0,0

*  = music.location

musicData:
!byte music.data

+debug::registerRange("music", musicData)

!! debug::js.outputMemoryMap()

; +debug::registerPass()

+debug::reserveRange("color memory", $d800, $d800 + 1000)
