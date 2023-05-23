VICE=x64sc
# VICE=/Applications/vice-arm64-gtk3-3.7.1/x64sc.app/Contents/MacOS/x64sc
# DEBUGGER=/Applications/C64\ Debugger.app/Contents/MacOS/C64\ Debugger
DEBUGGER=/Applications/Retro\ Debugger.app/Contents/MacOS/Retro\ Debugger
EXOMIZER=/usr/local/bin/exomizer
BIN=./node_modules/.bin

SRC_ASM=$(shell find . -name "*.asm")
LIB_JS=$(shell find . -name "./lib/*.js")
RES=$(shell find ./res -name "*.bin" )
PETMATE=$(shell find ./res -name "*.petmate")
GENASM=$(PETMATE:.petmate=.petmate.gen.asm)

%.prg: %.asm node_modules
	@$(BIN)/c64jasm --out "$@" \
		--c64debugger-symbols "$*.dbg" \
		--vice-moncommands "$*.vs" \
		--disasm "$*.txt" \
		"$<"

.PHONY: %.run
%.run: %.prg
	@$(VICE) -config ./vicerc -moncommands "$*.vs" -moncommands "$*.moncommands" -initbreak ready "$<"

# Put code in the default segment by not specifying a segment and
# putting it before the first use of a segment
.PHONY: %.debug
%.debug: %.prg
	@$(DEBUGGER) -prg "$<" -wait 5000 -autojmp -layout 9 -debuginfo "$*.dbg"

.PRECIOUS: %.petmate.gen.asm
%.petmate.gen.asm: %.petmate
	node ./bin/built/petmate2asm.js "$<"

res/%-frames: res/%.gif
	./res/extract-gif.sh "$<" "$@"

.PRECIOUS: res/%-frames.petmate
res/%-frames.petmate: res/%-frames
	node ./bin/built/png2petscii.js "$<"

.PHONY: test
test: main.run

main.prg: $(SRC_ASM) $(LIB_JS) $(RES) $(GENASM) typer.js \
	./res/heart2-frames.petmate.gen.asm \
	./res/dance1-frames.petmate.gen.asm \
	./res/walking-frames.petmate.gen.asm \
	./res/lbs-heart.petmate.gen.asm \
	./res/runner-frames.petmate.gen.asm \
	./res/dancemove1-frames.petmate.gen.asm

.PRECIOUS: %.exe.prg
%.exe.prg: %.prg
	exomizer sfx basic "$<" -o "$@"

.PHONY: lint
lint:
	@$(BIN)/standard

.PHONY: fix
fix:
	@$(BIN)/standard --fix

node_modules: package.json yarn.lock
	yarn install

.PHONY: clean
clean:
	rm -f *.prg
	rm -f *.exe.prg
	rm -f *.sym
	rm -f *.vs
	rm -f *.dbg
	rm -f *.d64
	# rm -f res/*.bin
	rm -f res/*.gen.asm
	# rm -rf node_modules
