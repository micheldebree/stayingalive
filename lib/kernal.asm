; vim:set ft=c64jasm:
!filescope kernal

!let TRUE = 1
!let FALSE = 0

!macro basicstart(addr) {
  * = $801
  !byte $0b, $08, $0a, $00, $9e
  !for d in [10000, 1000, 100, 10, 1] {
    !if (addr >= d) {
      !byte $30 + (addr/d)%10
    }
  }
  !byte 0, 0, 0
}

!macro clearScreen() {
  jsr $ff81
}

; copy the character data that is hidden in the ROM underneath $d000 to a location in RAM,
; so we can use it and also use the VIC and SID registers
!macro copyRomChar(toAddress, nrBlocks) {

        lda $01
        pha
        ; make rom characters visible
        lda #%00110011
        sta $01
        ldx #0
loop:
        !for i in range(nrBlocks) {
          lda $d000 + (i * $100),x
          sta toAddress + (i * $100),x
        }
        inx
        bne loop

        pla
        sta $01
}

