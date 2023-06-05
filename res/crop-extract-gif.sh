#!/bin/sh
#https://stackoverflow.com/questions/71343250/copy-a-pixel-color-imagemagick
#https://graphicdesign.stackexchange.com/questions/20908/how-to-remove-every-second-frame-from-an-animated-gif
# BASENAME=$(basename "$1" .gif)
# DEST="$BASENAME-frames"
DEST=$2
rm -rf "${DEST}"
mkdir -p "${DEST}"

convert "$1" "${DEST}/out%05d.png"


