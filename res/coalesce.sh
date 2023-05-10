#!/bin/sh
# Do this once for a gif to 'flatten' each delta frame into a full frame
# Avoids problems with subsequent processing
set -ex
convert  -coalesce "$1" "$1.co.gif"
trash "$1"
mv "$1.co.gif" "$1"

