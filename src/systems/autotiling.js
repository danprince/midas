import { System } from "../game.js";

export class AutotilingSystem extends System {
  run() {
    this.autotileWalls();
  }

  autotileWalls() {
    let walls = game.stage.walls;

    onclick = (event) => {
      let { x, y } = game.camera.screenToGrid(event.clientX, event.clientY);
      x = Math.floor(x);
      y = Math.floor(y);

      let a = game.stage.getTile(x - 1, y - 1) > 0 ? 1 : 0;
      let b = game.stage.getTile(x + 0, y - 1) > 0 ? 1 : 0;
      let c = game.stage.getTile(x + 1, y - 1) > 0 ? 1 : 0;
      let d = game.stage.getTile(x - 1, y + 0) > 0 ? 1 : 0;
      let e = game.stage.getTile(x + 1, y + 0) > 0 ? 1 : 0;
      let f = game.stage.getTile(x - 1, y + 1) > 0 ? 1 : 0;
      let g = game.stage.getTile(x + 0, y + 1) > 0 ? 1 : 0;
      let h = game.stage.getTile(x + 1, y + 1) > 0 ? 1 : 0;

      let pattern = (
        (a << 7) |
        (b << 6) |
        (c << 5) |
        (d << 4) |
        (e << 3) |
        (f << 2) |
        (g << 1) |
        (h << 0)
      );

      console.log(pattern);

      game.player.x = x;
      game.player.y = y;
    }

    for (let x = 0; x < game.stage.width; x++) {
      for (let y = 0; y < game.stage.height; y++) {
        let tile = game.stage.getTile(x, y);

        // Don't need to draw wall if the tile is filled
        if (tile > 0) {
          continue;
        }

        // A B C
        // D x E
        // F G H

        let a = game.stage.getTile(x - 1, y - 1) > 0 ? 1 : 0;
        let b = game.stage.getTile(x + 0, y - 1) > 0 ? 1 : 0;
        let c = game.stage.getTile(x + 1, y - 1) > 0 ? 1 : 0;
        let d = game.stage.getTile(x - 1, y + 0) > 0 ? 1 : 0;
        let e = game.stage.getTile(x + 1, y + 0) > 0 ? 1 : 0;
        let f = game.stage.getTile(x - 1, y + 1) > 0 ? 1 : 0;
        let g = game.stage.getTile(x + 0, y + 1) > 0 ? 1 : 0;
        let h = game.stage.getTile(x + 1, y + 1) > 0 ? 1 : 0;

        let pattern = (
          (a << 7) |
          (b << 6) |
          (c << 5) |
          (d << 4) |
          (e << 3) |
          (f << 2) |
          (g << 1) |
          (h << 0)
        );

        let sprite = 0;

        switch (pattern) {
          case 8:
          case 9:
          case 12:
          case 13:
          case 136:
          case 137:
          case 141:
          case 200:
            sprite = 100;
            break;

          case 16:
          case 17:
          case 20:
          case 21:
          case 48:
          case 49:
          case 52:
            sprite = 101;
            break;

          case 40:
          case 41:
          case 44:
          case 45:
          case 57:
          case 72:
          case 73:
          case 104:
          case 105:
          case 108:
          case 109:
          case 168:
          case 169:
          case 172:
          case 201:
          case 232:
          case 233:
          case 236:
          case 237:
            sprite = 102;
            break;

          case 53:
          case 80:
          case 84:
          case 112:
          case 116:
          case 117:
          case 144:
          case 145:
          case 148:
          case 149:
          case 176:
          case 177:
          case 180:
          case 181:
          case 208:
          case 209:
          case 212:
          case 213:
          case 240:
          case 244:
          case 245:
            sprite = 103;
            break;

          case 10:
          case 11:
          case 14:
          case 15:
          case 143:
          case 155:
            sprite = 104;
            break;

          case 18:
          case 19:
          case 22:
          case 23:
          case 30:
          case 55:
          case 118:
            sprite = 105;
            break;

          case 42:
          case 43:
          case 46:
          case 47:
          case 75:
          case 79:
          case 106:
          case 107:
          case 111:
          case 139:
          case 171:
          case 174:
          case 175:
          case 203:
          case 207:
          case 234:
          case 235:
          case 238:
          case 239:
            sprite = 106;
            break;

          case 86:
          case 87:
          case 119:
          case 146:
          case 147:
          case 150:
          case 151:
          case 182:
          case 183:
          case 214:
          case 215:
          case 243:
          case 246:
          case 247:
            sprite = 107;
            break;

          case 2:
          case 3:
          case 6:
          case 7:
          case 34:
          case 35:
          case 38:
          case 39:
          case 66:
          case 67:
          case 70:
          case 71:
          case 98:
          case 99:
          case 102:
          case 103:
          case 130:
          case 131:
          case 134:
          case 135:
          case 166:
          case 167:
          case 194:
          case 195:
          case 198:
          case 199:
          case 226:
          case 227:
          case 230:
          case 231:
            sprite = 108;
            break;

          case 31:
            sprite = 120;
            break;

          case 186:
          case 187:
          case 190:
          case 191:
            sprite = 121;
            break;

          case 125:
          case 184:
          case 185:
          case 188:
          case 189:
          case 220:
          case 221:
          case 248:
          case 249:
          case 252:
          case 253:
            sprite = 122;
            break;

          case 24:
          case 25:
          case 28:
          case 29:
            sprite = 123;
            break;

          case 152:
          case 153:
          case 156:
          case 157:
            sprite = 124;
            break;

          case 56:
          case 60:
          case 61:
            sprite = 125;
            break;

          case 158:
          case 159:
            sprite = 126;
            break;

          case 63:
            sprite = 127;
            break;
        }

        if (sprite) {
          walls[x + y * game.stage.width] = sprite;
        }
      }
    }
  }
}
