!filescope toggle
; keep track of on/off toggles for effects
; testing is done with the BIT operation, which
; puts bit 6 in the Z register
; the way ON and OFF are set up, toggling between
; on and off can be done with an inc or dec
; N.B. because of this, toggling ON (inc) a toggle that is already ON,
; needs to be toggled OFF (dec) the same amount of times

!segment data

!let HEART = 0
!let RUNNER = 1
!let DANCEMOVE1 = 2
!let BANANA = 3
!let WIPE = 4

!let ON =  %01000000
!let OFF = %00111111

toggles:
  !byte OFF,OFF,OFF,OFF,OFF

!macro jsrWhenOn(index, label) {
  bit toggles + index
  bvc skip
  jsr label
skip:
}

!macro on(index) {
  ; lda #ON
  ; sta toggles + index
  inc toggles + index
}

!macro off(index) {
  ; lda #OFF
  ; sta toggles + index
  dec toggles + index
}

!macro toggle(index) {
  lda toggles + index
  eor #ON
  sta toggles + index
}

!segment code

; toggle flag x
toggleFlag: 
  lda toggles,x
  eor #ON
  sta toggles,x
  rts

