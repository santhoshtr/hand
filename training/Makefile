LANGUAGES=malayalam tamil
default: prepare

optimizesvgs:
	@echo "Optimizing all svg files"
	@svgo -q --pretty --enable=removeOffCanvasPaths --disable=mergePaths data/**/*.svg

prepare: optimizesvgs
	@for language in $(LANGUAGES);do \
		python3 train.py -t data/$$language/data.json -o ../src/lib/data/$$language.json; \
	done;
