; vim:set ft=c64jasm:
!filescope bytes

!macro staW(addr, word) {
  lda #b.lo(word)
  sta addr
  lda #b.hi(word)
  sta addr + 1
}

!macro addW(addr, word) {
  lda addr
  clc
  adc #b.lo(word)
  sta addr
  lda addr + 1
  adc #b.hi(word)
  sta addr + 1
}

!macro incW(addr) {
  inc addr
  bne skip
  inc addr+1
skip:
}
