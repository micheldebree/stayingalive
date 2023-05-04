
; vim:set ft=c64jasm:
!filescope animationHeart2

animation:
  !include "res/heart2-frames.petmate.gen.asm"

advance:
  +animation::advance(framesLo, framesHi)

drawKeyframe:
  +animation::drawKeyframe(firstFrame)

+debug::registerRange("heart2", animation)
