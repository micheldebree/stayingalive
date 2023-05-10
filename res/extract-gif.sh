#!/bin/sh
# BASENAME=$(basename "$1" .gif)
# DEST="$BASENAME-frames"
DEST=$2
mkdir -p "${DEST}"
# rm -f *.png
# convert -coalesce "$1" out%05d.png
convert \
  -coalesce \
  -resize 320x200 \
  -gravity center \
  -extent 320x200 \
  "$1" "${DEST}/out%05d.png"


