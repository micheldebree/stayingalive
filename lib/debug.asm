; vim:set ft=c64jasm:
!filescope debug

!use "./debug.js" as js
!use "./bytes.js" as bytes

; Debugging

!macro logHex(label, number) {
  !! js.log(label, ": ", bytes.hex(number))
}

!macro logRange(label, from) {
  !! js.log(label, ": ", bytes.hex(from), "-", bytes.hex(*))
}

!macro registerRange(label, from) {
  !! js.registerRange(label, from, *)
}

!macro reserveRange(label, from, to) {
  !! js.registerRange(label + " (reserved)", from, to)
}
