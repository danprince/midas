/**
 * @type {CommandHandler<Direction>}
 */
export function move(object, direction) {
  systems.movement.move(object, direction);
  return true;
}

/**
 * @param {GameObject} object
 */
export function rest(object) {
  return true;
}
