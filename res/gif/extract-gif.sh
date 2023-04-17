#!/bin/sh
rm *.png
convert -coalesce "$1" out%05d.png

