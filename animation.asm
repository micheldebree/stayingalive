!filescope animation

!let keyFrame = 0

!segment code

; loop = 1 = loop, 0 = do not loop
!macro play(nr, framesLo, framesHi, loop) {

  +toggles::jmpWhenOff(nr, skip)
  ; make sure the first frame (the keyframe)
  ; is only drawn once, because it is expensive
  ; next time round, start at the second (delta) frame
  ; make sure the last frame is the same as the first for this to work
  ; TODO: unneccesary optimization?
  !let nrFrames = framesLo - framesHi

  +debug::logHex("framesLo",framesLo)
  +debug::logHex("framesHi",framesHi)
  !! debug::js.log(nrFrames)

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
  cmp #nrFrames - 1 + loop ; when not looping, stop before the last frame
                           ; because the last frame is a delta 
                           ; frame for the first frame
  bne return
    lda #1; loop to the second frame to skip keyframe
    sta frameIndices + nr
    !if (loop < 1) {
      +toggles::toggle(nr)
    }

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
