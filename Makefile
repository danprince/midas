npm = ./node_modules/.bin
aseprite := /Applications/Aseprite.app/Contents/MacOS/aseprite
vite = $(npm)/vite

sprites:
	$(aseprite) --batch artwork/sprites.aseprite --save-as public/sprites/atlas.png
	$(aseprite) --batch artwork/ui.aseprite --scale 3 --save-as public/sprites/{slice}.png

clean:
	rm -rf dist

build-web:
	$(vite) build --base ./ --outDir dist

build-itch:
	mkdir -p release
	rm -f release/itch.zip
	cd dist && zip -r ../release/itch.zip *

build: build-web build-itch
