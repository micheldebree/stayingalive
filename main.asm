; vim:set ft=c64jasm:
!include "lib/macros.asm"
!include "lib/vic.asm"

* = $0801

+macros::basic::start(start)

start:

  +vic::selectBank(0)

  !let d011value = +vic::js.initD011({})
  lda #d011value
  sta $d011


  !let d018value = +vic::js.initD018({})
  lda #d018value
  sta $d018

  lda #0
  sta $d020
  sta $d021
  jmp *
