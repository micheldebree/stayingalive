; vim:set ft=c64jasm:
!filescope animationWalker

!segment default

!include "res/walking-frames.petmate.gen.asm"

advance:
  +animation::advance(framesLo, framesHi)

drawKeyframe:
  +animation::drawKeyframe(framesLo, framesHi)

+debug::registerRange("walker", advance)
