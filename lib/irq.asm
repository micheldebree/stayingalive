; vim:set ft=c64jasm:
!filescope irq

!let DUMMY_WRITE_ADDR = $d02f
!let DUMMY_BIT_ADDR = $ea

!macro set(rasterline, address) {
    lda #<address
    sta $fffe
    lda #>address
    sta $ffff
    lda #(rasterline & $ff)
    sta $d012
    lda $d011
    !if (rasterline > $ff) {
      ora #%10000000
    } else {
      and #%01111111
    }
    sta $d011
}

!macro disableKernalRom() {
  lda #%00110101
  sta $01
}

!macro disableTimerIrqs() {
  ; no timer IRQs
  lda #$7f
  sta $dc0d
  ; acknowledge CIA interrupts
  lda $dc0d
}

!macro wasteCycles(nrCycles) {

  !let left = nrCycles
  !let nrInc = Math.floor(nrCycles / 6)
  !if (nrCycles % 6 == 1) { !! nrInc = nrInc - 1 }
  !for i in range(nrInc) { inc DUMMY_WRITE_ADDR }
  !! left = left - nrInc * 6

  !let nrBit = Math.floor(left / 3)
  !if (left % 3 == 1) { !! nrBit = nrBit - 1 }
  !for i in range(nrBit) { bit DUMMY_BIT_ADDR }
  !! left = left - nrBit * 3

  !let nrNop = Math.floor(left / 2)
  !for i in range(nrNop) { nop }
}

!macro stabilize() {
    lda #<stabilizerIrq
    sta $fffe
    lda #>stabilizerIrq
    sta $ffff
    inc $d012 ; next irq on next line
    asl $d019 ; ack interrupt
    tsx ; save stack pointer (return address for this irq)
    cli ; enable interrupts so stabelizerIrq can occur
    ; somewhere along these nops, the stabilizerIrq will
    ; take over, leaving 1 cycle jitter

    !for i in range(25) { nop }

  stabilizerIrq:
    txs ; restore stack pointer
    ldx #8
  waste:
    dex
    bne waste
    nop
    bit $ea ; waste 3 cycles
    lda $d012
    cmp $d012
    beq done ; waste one more cycle if no raster change yet
done:
}
