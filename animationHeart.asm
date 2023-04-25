; vim:set ft=c64jasm:
!filescope animationHeart

!segment default

!include "res/pulse.heart.petmate.gen.asm"

advance:
  +animation::advance(framesLo, framesHi)

drawKeyframe:
  +animation::drawKeyframe(framesLo, framesHi)

+debug::registerRange("heart", advance)
