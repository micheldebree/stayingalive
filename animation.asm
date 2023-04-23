!filescope animation

!macro drawKeyframe(loPointers, hiPointers) {
  lda loPointers
  sta keyframe + 1
  lda hiPointers
  sta keyframe + 2
keyframe:
  jsr $0000
  rts
}

!macro advance(loPointers, hiPointers) {

  !let nrFrames = loPointers - hiPointers

  ; self-modifying code variables
  !let frameCallLo = frameCall + 1
  !let frameCallHi = frameCall + 2
  !let frameNr = frameIndex + 1
  !let delayCounter = frameDelay + 1

  frameDelay:
    lda #frameRate
    bne return
    lda #frameRate
    sta delayCounter

  frameIndex:
    ldx #1
    ; skip the first frame (keyframe) so it is only drawn on initialization
    lda loPointers,x 
    sta frameCallLo
    lda hiPointers,x
    sta frameCallHi

  frameCall:
  ; !break
    jsr $0000
    inc frameNr
    lda frameNr
    cmp #nrFrames
    bne return
      lda #1
      sta frameNr

  return:
    dec delayCounter
    rts
}
