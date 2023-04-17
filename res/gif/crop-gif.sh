#!/bin/sh
# https://stackoverflow.com/questions/14036765/how-do-i-crop-an-animated-gif-using-imagemagick
 gifsicle --crop 90,85+320x200 --output cropped.gif "$1"
