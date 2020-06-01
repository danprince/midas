import objects from "./data/objects.json";

/**
 * @type {Record<string, Partial<GameObject>>}
 */
let registry = { ...objects };

/**
 * @param {typeof registry} objects
 */
export function register(objects) {
  Object.assign(registry, objects);
}

/**
 * @param {string} id
 * @return {GameObject}
 */
export function build(id) {
  /**
   * @type {GameObject}
   */
  let object = {};

  /**
   * @type {string[]}
   */
  let types = [];

  /**
   * @type {string[]}
   */
  let stack = [id];

  while (stack.length) {
    let id = stack.pop();
    let ancestor = registry[id];
    types.push(id);

    object = { ...ancestor, ...object };

    if (ancestor.extends) {
      stack.unshift(...ancestor.extends);
    }
  }

  object.id = game.getNextObjectId();
  object.extends = types;

  return object;
}

/**
 * @param {GameObject} object
 * @param {string} type
 * @return {boolean}
 */
export function is(object, type) {
  return object.extends.includes(type);
}
