#!/bin/sh
gifsicle -U "$1" `seq -f "#%g" 0 2 99` -o "$1-half.gif"
