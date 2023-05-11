BUILT=./built

.PHONY: all
all:
	./node_modules/.bin/tsc
	cp characters.901225-01.bin $(BUILT)

.PHONY: clean
clean:
	rm -rf $(BUILT)

fix:
	./node_modules/.bin/eslint --fix ./*.ts

