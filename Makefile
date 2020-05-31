aseprite := /Applications/Aseprite.app/Contents/MacOS/aseprite

sprites:
	$(aseprite) --batch artwork/sprites.aseprite --save-as public/assets/sprites.png
	$(aseprite) --batch artwork/ui.aseprite --save-as public/assets/{slice}.png
