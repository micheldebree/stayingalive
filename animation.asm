!filescope animation

!let nrAnimations = 8
!let initialFramerates = [2,2,2,2,2,2,2,2]
!let initialFrames = [0,1,0,0,0,0,0,0]

; loop = 1 = loop, 0 = do not loop
!macro play(nr, framesLo, framesHi, loop) {

  +toggles::jmpWhenOff(nr, skip)
  ; make sure the first frame (the keyframe)
  ; is only drawn once, because it is expensive
  ; next time round, start at the second (delta) frame
  ; make sure the last frame is the same as the first for this to work
  ; TODO: unneccesary optimization?
  !let nrFrames = framesLo - framesHi
  !let frameDelay = checkFrameDelay + 1

checkFrameDelay:
  lda #initialFramerates[nr]
  bne return
  lda frameRates + nr
  sta frameDelay

getFrameIndex:
  ldy frameIndices + nr
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
  dec frameDelay

skip:
}

!segment data

frameIndices:
  !for i in range(nrAnimations) {
    !byte initialFrames[i]
  }


frameRates:
  !for i in range(nrAnimations) {
    !byte initialFramerates[i]
  }

!segment animations

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

heartspin: {
  !let nr = 5
  !include "res/heartspin-black-frames.petmate.gen.asm"
}

logo: {
  !let nr = 6
  !include "res/stayingalive.petmate.gen.asm"
}

pulse: {
  !let nr = 7
  !include "res/pulse.green.petmate.gen.asm"
}

+debug::registerRange("animations", runner)
