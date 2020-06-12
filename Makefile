npm = ./node_modules/.bin
aseprite := /Applications/Aseprite.app/Contents/MacOS/aseprite
vite = $(npm)/vite

sprites:
	$(aseprite) --batch artwork/sprites.aseprite --save-as public/sprites/atlas.png
	$(aseprite) --batch artwork/ui.aseprite --scale 3 --save-as public/sprites/{slice}.png

clean:
	rm -rf dist

build-web:
	$(vite) build --outDir dist/web

build-itch:
	$(vite) build --base /test --outDir dist/itch
	cd dist/itch && zip ../itch.zip *

build: build-web build-itch
