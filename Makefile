VICE=x64sc
DEBUGGER=/Applications/C64\ Debugger.app/Contents/MacOS/C64\ Debugger
EXOMIZER=/usr/local/bin/exomizer
BIN=./node_modules/.bin

SRC_ASM=$(shell find . -name "*.asm")
LIB_JS=$(shell find ./lib -name "*.js")
RES=$(shell find ./res -name "*.bin" )

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

main.prg: $(SRC_ASM) $(LIB_JS) $(RES) res/pulse.heart.petmate.asm

.PRECIOUS: %.exe.prg
%.exe.prg: %.prg
	exomizer sfx basic "$<" -o "$@"

.PHONY: lint
lint:
	@$(BIN)/standard

res/pulse.heart.petmate.asm: res/pulse.heart.petmate lib/petmate2asm.js
	node lib/petmate2asm.js "$<"

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
	rm -f res/*.bin
	# rm -rf node_modules
