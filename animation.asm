!filescope animation

!let keyFrame = 0
!let loopFrame = 1

!segment code

; TODO: make subroutine with input:
; - start of lo bytes of frame addresses
; - start of hi bytes of frame addresses
; - number of frames

!macro play(nr, framesLo, framesHi) {

; !! debug::js.log(nr)
+debug::logHex("toggles", toggles)
  +toggle::jmpWhenOff(toggles, nr, skip)
  ; make sure the first frame (the keyframe)
  ; is only drawn once, because it is expensive
  ; next time round, start at the second (delta) frame
  ; make sure the last frame is the same as the first for this to work
  ; TODO: unneccesary optimization?
  !let nrFrames = framesLo - framesHi

  lda frameDelays + nr
  bne return
  lda #frameRate
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

!let nrAnimations = 4

toggles:
+debug::logHex("toggo", *)
  !for i in range(nrAnimations) {
    !byte toggle::OFF
  }

frameIndices:
  !for i in range(nrAnimations) {
    !byte 0
  }
  
frameDelays:
  !for i in range(nrAnimations) {
    !byte frameRate
  }

runner: {
  !include "res/runner-frames.petmate.gen.asm"
  !let nr = 0
}

heart: {
  !include "res/lbs-heart.petmate.gen.asm"
  !let nr = 1
}

dancemove1: {
  !include "res/dancemove1-frames.petmate.gen.asm"
  !let nr = 2
}

banana: {
  !include "res/banana-frames.petmate.gen.asm"
  !let nr = 3
}
