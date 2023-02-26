; vim:set ft=c64jasm:
!include "lib/kernal.asm"
!include "lib/vic.asm"
!include "lib/debug.asm"
!include "lib/irq.asm"
!use "lib/vic.js" as vic
!use "lib/bytes.js" as b

* = $0801

!let firstRasterY = $33
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

drawKeyframe: {
  ldx #0
for:
  !for i in range(4) {
    lda keyframe + i * $100,x
    sta $0400 + i * $100,x
    lda keyframe + 1000 + i * $100,x
    sta $d800 + i * $100,x
  }
  inx
  bne for
}

  rts
}

mainIrq:  {
  inc $d020

!let frameNr = * +1

  ldx #0
  lda framesLo,x 
  sta frameCall + 1
  lda framesHi,x
  sta frameCall + 2

frameCall:
  jsr screen_035
  dec frameDelay
  bne keepCurrentFrame
  lda #frameRate
  sta frameDelay
  inc frameNr
  lda frameNr
  cmp #17
  bne keepCurrentFrame
  lda #0
  sta frameNr
keepCurrentFrame:
  dec $d020


; ack and return
  asl $d019
return:
  rti
}

frameDelay:
    !byte frameRate
  

keyframe:
  !binary "res/pulse.heart.petmate.bin"

!include "res/pulse.heart.petmate.asm"

; framesHi:
;   !byte b.hi(screen_028)

; framesLo:
;   !byte b.lo(screen_028)
