all: clean gen

clean:
	rm -rf build/*

build:
	browserify src/main.js -o build/bundle.js

deploy:
	cp -rf build/* .
