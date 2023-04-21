#!/bin/sh
ANCHOR=$(echo "$1" | tr '[:lower:]' '[:upper:]')
# open "http://www.6502.org/tutorials/6502opcodes.html#${ANCHOR}"
open "https://www.pagetable.com/c64ref/6502/?tab=2#${ANCHOR}"
