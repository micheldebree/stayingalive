#!/bin/sh

# Assume color of pixel 0,0 in first frame is background color
# The color is used to fill the area when extending the image to 320x200
BGCOLOR=$(convert "$1[0]" -format '%[pixel:p{0,0}]' info:-)
echo Background color: $BGCOLOR

set -ex
convert  -coalesce "$1" "$1.co.gif"
trash "$1"
mv "$1.co.gif" "$1"

convert \
  -resize 320x200 \
  -gravity center \
  -extent 320x200 \
  -background "$BGCOLOR" \
  "$1" "$1-320x200.gif"


