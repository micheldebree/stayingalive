!filescope toggle

!segment data

!let HEART = 0
!let RUNNER = 1
!let DANCER = 2

!let ON = %01000000
!let OFF = 0

toggles:
!byte 0,0,0

!macro jmpWhenOn(index, label) {
  bit toggles + index
  bvs label
}

!macro jmpWhenOff(index, label) {
  bit toggles + index
  bvc label
}

!macro on(index) {
  lda #ON
  sta toggles + index
}

!macro off(index) {
  lda #OFF
  sta toggles + index
}

!macro toggle(index) {
  lda toggles + index
  eor #ON
  sta toggles + index
}

!segment code

toggleFlag: 

  lda toggles,x
  eor #ON
  sta toggles,x
  rts

