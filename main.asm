; vim:set ft=c64jasm:
!include "lib/kernal.asm"
!include "lib/vic.asm"
!include "lib/debug.asm"
!include "lib/irq.asm"
!use "lib/vic.js" as vic
!use "lib/bytes.js" as b

* = $0801

!let firstRasterY = $33
!let nrFrames = 18
!let frameRate = 5

+kernal::basicstart(start)

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
  ; +kernal::clearScreen()
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
  rts
}

mainIrq:  {
  inc $d020
  jsr advanceAnimation
  dec $d020

; ack and return
  asl $d019
return:
  rti
}

drawKeyframe: {
  ldx #0
for:
  !for i in range(4) {
    !let offset = i * $100
    lda keyframe + offset,x
    sta $0400 + offset,x
    lda keyframe + (40 * 25) + offset,x
    sta $d800 + offset,x
  }
  inx
  bne for
  rts
}

advanceAnimation: {

  !let frameNr = * +1
    ldx #0
    lda heartFramesLo,x 
    sta frameCall + 1
    lda heartFramesHi,x
    sta frameCall + 2

  frameCall:
    jsr screen_035
    dec frameDelay
    bne keepCurrentFrame
      lda #frameRate
      sta frameDelay
      inc frameNr
      lda frameNr
      cmp #nrFrames
      bne keepCurrentFrame
        lda #0
        sta frameNr

  keepCurrentFrame:
    rts
}

frameDelay:
  !byte frameRate

!include "res/pulse.heart.petmate.gen.asm"

* = $4000

keyframe:
  !binary "res/pulse.heart.petmate.bin"
