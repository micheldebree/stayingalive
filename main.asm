; vim:set ft=c64jasm:
!include "lib/kernal.asm"
!include "lib/vic.asm"
!include "lib/debug.asm"
!use "lib/vic.js" as vic

* = $0801

+kernal::basicstart(start)

start:

  ; +kernal::clearScreen()
  +vicmacro::selectBank(0)

  !let d011value = vic.initD011({})
  lda #d011value
  sta $d011

  !let d018value = vic.initD018({})
  lda #d018value
  sta $d018

  lda #vic.initD016({})
  sta $d016

  ; lda #+vic::js.color.black
  ; sta $d020
  ; sta $d021

  ; ldy #$80
  ; !for i in range(8) {
  ;   lda #24+(24*i)
  ;   sta +vic::js.spriteX(i)
  ;   sty +vic::js.spriteY(i)
  ; }

  ldx #vic.color.black
  ; stx $d020
  ; stx $d021
  lda #24
  ldy #128

test:  
  sta vic.spriteX(0),x
  clc
  adc #vic.size.spriteWidth
  inx
  inx
  cpx #vic.size.nrSprites * 2
  bne test


; showFrame0: {
;   ldx #0
;
; for:
;   !for i in range(4) {
;     lda frame0 + i * $100,x
;     sta $0400 + i * $100,x
;   }
;   inx
;   bne for
; }

  jsr screen_028
  jmp *

!include "res/pulse.heart.petmate.asm"

; +debug::logRange("Key frame", screen_028)

; frame0:
; !binary "res/pulse.heart.petmate.bin"
