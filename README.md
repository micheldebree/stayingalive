# Staying alive


## TODO

- [ ] Crop GIFs when extracting to 320x200
- [ ] Optimized format (not code) as alternative, use for keyframe


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
