; vim:set ft=c64jasm:
!filescope animationDancemove1

animation:
  !include "res/dancemove1-frames.petmate.gen.asm"

advance:
  +animation::advance(framesLo, framesHi)

+debug::registerRange("dancemove1", animation)
