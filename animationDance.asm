; vim:set ft=c64jasm:
!filescope animationDance

animation:
  !include "res/dance.petmate.gen.asm"

advance:
  +animation::advance(framesLo, framesHi)

drawKeyframe:
  +animation::drawKeyframe(framesLo, framesHi)

+debug::registerRange("dance", animation)
