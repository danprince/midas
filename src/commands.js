/**
 * @type {CommandHandler<Direction>}
 */
export function move(object, direction) {
  return systems.movement.move(object, direction);
}

/**
 * @param {GameObject} object
 */
export function rest(object) {
  return true;
}

/**
 * @type {CommandHandler<number>}
 */
export function setActiveItem(object, index) {
  object.activeItemIndex = index;
  return false;
}
