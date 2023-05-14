; vim:set ft=c64jasm:
!filescope animationDance

animation:
  !include "res/dance1-frames.petmate.gen.asm"

advance:
  +animation::advance(framesLo, framesHi)

+debug::registerRange("dance", animation)
