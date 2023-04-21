#!/bin/sh
rm -f *.png
# convert -coalesce "$1" out%05d.png
convert \
  -resize 320x200 \
  -gravity center \
  -extent 320x200 \
  "$1" out%05d.png


