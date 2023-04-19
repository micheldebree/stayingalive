#!/bin/sh
node png2petscii.mjs ../res/gif
node petmate2asm-bw.mjs ../res/gif.petmate
mv ../res/gif.petmate.gen.asm ../res/dance.petmate.gen.asm
