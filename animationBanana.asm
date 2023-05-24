; vim:set ft=c64jasm:
!filescope animationBanana

animation:
  !include "res/banana-frames.petmate.gen.asm"

advance:
  +animation::advance(framesLo, framesHi)

+debug::registerRange("banana", animation)
