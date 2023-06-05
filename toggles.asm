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

!let playlist = js.playlist("playlist.json")

!let ON =  %01000000
!let OFF = %00111111

!let RUNNER=js.toggleTypes.runner
!let HEART=js.toggleTypes.heart
!let DANCEMOVE1=js.toggleTypes.dancemove1
!let BANANA=js.toggleTypes.dancemove1
!let ILOVEU=js.toggleTypes.iloveu
!let HEARTSPIN=js.toggleTypes.heartspin
!let LOGO=js.toggleTypes.logo
!let TYPER=js.toggleTypes.typer
!let WIPE=js.toggleTypes.wipe
!let MUSIC=js.toggleTypes.music
!let CURSOR=js.toggleTypes.cursor

!let nrToggles = MUSIC + 1

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

ticker: ; the position in the timeline
  !byte 0,0

; bit patterns used to trigger different commands
commandToggle:
  !byte js.commandTypes["toggle"] ^ %11110000
commandBackground:
  !byte js.commandTypes["bgcolor"] ^ %11110000
commandReset:
  !byte js.commandTypes["reset"] ^ %11110000
commandStyle:
  !byte js.commandTypes["style"] ^ %11110000

playlistLo:
  !byte playlist.ticksLower ; lower byte off address of playlist position
playlistHi:
  !byte playlist.ticksUpper ; upper byte off address of playlist position
playlistCommand:
  !byte playlist.commands ; the command to execute at the playlist position

+debug::registerRange("playlist", playlistLo)

toggles: ; value (ON/OFF) for each toggle
  !for i in range(nrToggles) { !byte OFF }

; call a subroutine when a toggle is on
!macro jsrWhenOn(index, label) {
  bit toggles + index
  bvc skip
  jsr label
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

!segment code

; advance time ticker and execute command if position
; matches a playlist entry
tick: {

!let keyFrame = * + 1

  ldx #0 ; the position off the next command in the playlist
  lda playlistLo,x
  cmp ticker
  bne done
    lda playlistHi,x
    cmp ticker + 1
    bne done
      ; ticker matches timestamp of next playlist entry
      inc keyFrame ; advance playlist position
      lda playlistCommand,x ; load the current command
      bit commandToggle
      bne checkBackground
        ; the command is a toggle command
        and #$0f ; low nibble is the number of the toggle to toggle
        tax
        +toggleX()
        jmp done
checkBackground:
      bit commandBackground
      bne checkReset
        ; the command is a change background color command
        and #$0f ; low nibble is the color
        sta $d020
        sta $d021
        jmp done
checkReset:
      bit commandReset
      bne checkStyle
        ; the command is an animation reset command
        and #$0f ; low nibble is the animation nr to reset
        tax
        lda #0
        sta animation::frameIndices, x
        jmp done
checkStyle:
      bit commandStyle
      bne done
        ; the command is a style command for the typer
        and #$0f ; low nibble is the nr of the style to apply
        tax
        jsr typer::setStyle

done:
  +bytes::incW(ticker) ; advance the time ticker
  rts
}
