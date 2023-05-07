; vim:set ft=c64jasm:
!filescope animationCube

animation:
  !include "res/cube-frames.petmate.gen.asm"

advance:
  +animation::advance(framesLo, framesHi)

drawKeyframe:
  +animation::drawKeyframe(firstFrame)

+debug::registerRange("cube", animation)
