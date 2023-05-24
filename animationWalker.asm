; vim:set ft=c64jasm:
!filescope animationWalker

animation:
  !include "res/walking-frames.petmate.gen.asm"

advance:
  +animation::advance(framesLo, framesHi)

+debug::registerRange("walker", animation)

