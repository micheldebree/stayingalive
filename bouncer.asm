; vim:set ft=c64jasm:
!filescope bouncer

!let speed = 8

bounce: {
  lda $d001
  clc
acc:
  adc #0
  sta $d001
  sta $d003
  sta $d005
  sta $d007
  sta $d009
  sta $d00b
  cmp #250
  bcc checkSpeed
  lda #0
  sec
  sbc acc + 1
  sta acc + 1

checkSpeed:
  lda #speed
  bne done
  lda #speed
  sta checkSpeed + 1
  inc acc + 1
done:
  dec checkSpeed + 1
  rts
}
