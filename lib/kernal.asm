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
