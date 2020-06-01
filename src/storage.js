const SAVE_KEY = `midas-save-v0`;

export function save() {
  let save = game.serialize();
  localStorage[SAVE_KEY] = JSON.stringify(save);
}

export function load() {
  let save = JSON.parse(localStorage[SAVE_KEY]);
  game.deserialize(save);
}
