export class AutotilingSystem {
  /**
   * @param {number} x0
   * @param {number} y0
   * @param {number} x1
   * @param {number} y1
   */
  update(x0 = 0, y0 = 0, x1 = game.stage.width, y1 = game.stage.height) {
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        this.autotile(x, y);
      }
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  autotile(x, y) {
    let tile = game.stage.getTile(x, y)
    let autotiling = tile.autotiling;

    if (autotiling == null) {
      return;
    }

    switch (autotiling.type) {
      case "chessboard": {
        if (x % 2 ? y % 2 : !(y % 2)) {
          tile.sprite = autotiling.sprite;
        }

        break;
      }
    }
  }
}
