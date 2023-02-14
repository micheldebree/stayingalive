; vim:set ft=c64jasm:
!filescope debug

!use "debug" as js
!use "bytes" as bytes

; Debugging

!macro logHex(label, number) {
  !! js.log(label, ": ", bytes.hex(number))
}

!macro logRange(label, from) {
  !! js.log(label, ": ", bytes.hex(from), "-", bytes.hex(*))
}
