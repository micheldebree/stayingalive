; vim:set ft=c64jasm:
!filescope animationRunner

animation:
  !include "res/runner-frames.petmate.gen.asm"

advance:
  +animation::advance(framesLo, framesHi)

+debug::registerRange("runner", animation)

