; vim:set ft=c64jasm:
!filescope animationHeart

animation:
  !include "res/lbs-heart.petmate.gen.asm"

advance:
  +animation::advance(framesLo, framesHi)

; drawKeyframe:
  ; +animation::drawKeyframe(framesLo, framesHi)

+debug::registerRange("heart", animation)
