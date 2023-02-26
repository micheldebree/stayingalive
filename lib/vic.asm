; vim:set ft=c64jasm:
!filescope vicmacro

!use "vic.js" as js

; 63 cycles in one line
; 23 cycles on bad line

; Set the vic bank to start at
!macro selectBank(startAddress) {
  lda $dd00
  and #%11111100
  ora #%11 - startAddress / js.size.bank
  sta $dd00
}

!macro initD011(options) {
  !let yscroll = js.optional(options, "yScroll", 0)
  !let rsel = js.optional(options, "rows", 1)
  !let den = js.optional(options, "enable", 1)
  !let bmm = js.optional(options, "bitmap", 0)
  !let ecm = js.optional(options, "ecm", 0)
  !let rst8 = js.optional(options, "rasterHi", 0)

  lda #js.initD011(yscroll, rsel, den, bmm, ecm, rst8)
  sta $d011
}

!macro initD018(options) {
  !let screenNr = js.optional(options, "screenStart", $400) / $400
  !let fontNr = js.optional(options, "fontStart", $1000) / $800
  lda #js.initD018(screenNr, fontNr)
  sta $d018
}

