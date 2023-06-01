; vim:set ft=c64jasm:
!filescope toggles
; keep track of on/off toggles for effects
; testing is done with the BIT operation, which
; puts bit 6 in the Z register
; the way ON and OFF are set up, toggling between
; on and off can be done with an inc or dec
; N.B. because of this, toggling ON (inc) a toggle that is already ON,
; needs to be toggled OFF (dec) the same amount of times

!use "toggles.js" as js

!let playlist = js("playlist.json")

!let ON =  %01000000
!let OFF = %00111111

!let RUNNER=0
!let HEART=1
!let DANCEMOVE1=2
!let BANANA=3
!let ILOVEU=4
!let HEARTSPIN=5
!let TYPER=6
!let WIPE=7

!let CMD_TOGGLE = $f0

!let nrToggles = WIPE + 1

!segment code

nibbleToHex: { ; a = nibble, x = screen location

!let ZERO = b.screencode("0")
!let ALPHA = b.screencode("a")

  and #$0f
  cmp #10
  bpl letter
  adc #ZERO[0]
  jmp output
letter:
  adc #ALPHA[0] - 11

output:
  sta $0400 + 25 * 40 - 4,x
  lda #0
  sta $d800 + 25 * 40 - 4,x
  rts
 }

byteToHex: {
  pha
  lsr
  lsr
  lsr
  lsr
  jsr nibbleToHex
  pla
  inx
  jsr nibbleToHex
  rts
}

showPlayhead: {
  ldx #0
  lda ticker + 1
  jsr byteToHex
  inx
  lda ticker 
  jsr byteToHex
  rts
}

!segment data

ticker:
  !byte 0,0

playlistLo:
!byte playlist.ticksLower
playlistHi:
!byte playlist.ticksUpper
playlistCommand:
!byte playlist.commands

+debug::registerRange("playlist", playlistLo)

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

tick: {

!let keyFrame = * + 1

  ldx #0
  lda playlistLo,x
  cmp ticker
  bne done
    lda playlistHi,x
    cmp ticker + 1
    bne done
      inc keyFrame
      lda playlistCommand,x
      pha
      and #CMD_TOGGLE
      cmp #CMD_TOGGLE
      bne nopCommand
        pla
        and #$0f
        tax
        +toggleX()
        jmp done
nopCommand:
      pla

done:
  +bytes::incW(ticker)
  rts
}
