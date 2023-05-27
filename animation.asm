!filescope animation

!let keyFrame = 0
!let loopFrame = 1

!segment code

; TODO: make subroutine with input:
; - start of lo bytes of frame addresses
; - start of hi bytes of frame addresses
; - number of frames

!macro play(nr, framesLo, framesHi) {

  +toggles::jmpWhenOff(nr, skip)
  ; make sure the first frame (the keyframe)
  ; is only drawn once, because it is expensive
  ; next time round, start at the second (delta) frame
  ; make sure the last frame is the same as the first for this to work
  ; TODO: unneccesary optimization?
  !let nrFrames = framesLo - framesHi

  lda frameDelays + nr
  bne return
  lda frameRates + nr
  sta frameDelays + nr

  ldy frameIndices + nr ; first frame is keyframe, only visit once
  lda framesLo,y 
  sta frameCall + 1
  lda framesHi,y
  sta frameCall + 2

frameCall:
  jsr $ffff
  inc frameIndices + nr
  lda frameIndices + nr
  cmp #nrFrames
  bne return
    lda #loopFrame; loop to the second frame to skip keyframe
    sta frameIndices + nr

return:
  dec frameDelays + nr

skip:
}

!segment data

!let nrAnimations = 5

frameIndices:
  !for i in range(nrAnimations) {
    !byte 0
  }

frameRates:
  !for i in range(nrAnimations) {
    !byte 2
  }
  
frameDelays:
  !for i in range(nrAnimations) {
    !byte frameRate
  }

runner: {
  !let nr = 0
  !include "res/runner-frames.petmate.gen.asm"
}

heart: {
  !let nr = 1
  !include "res/lbs-heart.petmate.gen.asm"
}

dancemove1: {
  !let nr = 2
  !include "res/dancemove1-frames.petmate.gen.asm"
}

banana: {
  !let nr = 3
  !include "res/banana-frames.petmate.gen.asm"
}

iloveu: {
  !let nr = 4
  !include "res/iloveu-frames.petmate.gen.asm"
}
