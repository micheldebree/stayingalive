!filescope animationDance

!segment default

!include "res/dance.petmate.gen.asm"

advance:

+animation::advance(framesLo, framesHi)

drawKeyframe:

+animation::drawKeyframe(framesLo, framesHi)


+debug::registerRange("dance", advance)
