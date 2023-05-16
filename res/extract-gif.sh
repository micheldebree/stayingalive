#!/bin/sh
#https://stackoverflow.com/questions/71343250/copy-a-pixel-color-imagemagick
#https://graphicdesign.stackexchange.com/questions/20908/how-to-remove-every-second-frame-from-an-animated-gif
# BASENAME=$(basename "$1" .gif)
# DEST="$BASENAME-frames"
DEST=$2
rm -rf "${DEST}"
mkdir -p "${DEST}"
# rm -f *.png
# convert -coalesce "$1" out%05d.png

# Assume color of pixel 0,0 in first frame is background color
# The color is used to fill the area when extending the image to 320x200
BGCOLOR=$(convert "$1[0]" -format '%[pixel:p{0,0}]' info:-)
echo Background color: $BGCOLOR

convert \
  -resize 320x200 \
  -gravity center \
  -extent 320x200 \
  -background "$BGCOLOR" \
  "$1" "${DEST}/out%05d.png"


