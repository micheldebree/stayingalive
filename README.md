# Staying alive


Heartbeat = 16 lines temp 3 4 2 2

= 4 x 4 + 3 + 2 + 2 = 44 frames


## TODO

- [ ] Crop GIFs when extracting to 320x200
- [ ] Optimized format (not code) as alternative, use for keyframe
- [ ] store nrOfFrames with generated code


### Optimized format

Black-and-white: 

- 128 character set
- msb is used as skip count, so 255 means 'skip 128 bytes'
    :
Color:

- pack nibbles


### Ideas

- Treat key frame differently (run-length encoded)
- Skip random writes -> glitches, less memory
- Only use delta frames
- match luminance instead of pixels


https://github.com/veltman/gifs
https://superuser.com/questions/48532/convert-animated-svg-to-movie
