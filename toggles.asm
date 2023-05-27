!filescope toggles
; keep track of on/off toggles for effects
; testing is done with the BIT operation, which
; puts bit 6 in the Z register
; the way ON and OFF are set up, toggling between
; on and off can be done with an inc or dec
; N.B. because of this, toggling ON (inc) a toggle that is already ON,
; needs to be toggled OFF (dec) the same amount of times

!let ON =  %01000000
!let OFF = %00111111

!segment data

!let nrToggles = 6

!let RUNNER=0
!let HEART=1
!let DANCEMOVE1=2
!let BANANA=3
!let ILOVEU=4
!let WIPE=5

toggles:
  !for i in range(nrToggles) { !byte OFF }

!macro jsrWhenOn(index, label) {
  bit toggles + index
  bvc skip
  jsr label
skip:
}

!macro rtsWhenOff(index) {
  bit toggles + index
  bvs skip
  rts
skip:
}

!macro jmpWhenOff(index, label) {
  bit toggles + index
  bvc label
}

!macro on(index) {
  inc toggles + index
}

!macro off(index) {
  dec toggles + index
}

!macro toggle(index) {
  lda toggles + index
  eor #ON
  sta toggles + index
}

!macro toggleX() {
   lda toggles,x
   eor #ON
   sta toggles,x
   rts
}
