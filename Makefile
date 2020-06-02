aseprite := /Applications/Aseprite.app/Contents/MacOS/aseprite

sprites:
	$(aseprite) --batch artwork/sprites.aseprite --save-as public/sprites/atlas.png
	$(aseprite) --batch artwork/ui.aseprite --scale 3 --save-as public/sprites/{slice}.png
