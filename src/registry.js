import objects from "./data/objects.json";
import items from "./data/items.json";

/**
 * @type {Record<string, Partial<GameObject>>}
 */
let registry = { ...objects };

/**
 * @type {Record<string, Partial<Item>>}
 */
let itemRegistry = { ...items };

/**
 * @param {typeof registry} objects
 */
export function register(objects) {
  Object.assign(registry, objects);
}

/**
 * @param {typeof itemRegistry} items
 */
export function registerItems(items) {
  Object.assign(itemRegistry, items);
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
 * @param {string} id
 * @return {Item}
 */
export function buildItem(id) {
  /**
   * @type {Item}
   */
  let item = {};

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
    let ancestor = itemRegistry[id];
    types.push(id);

    item = { ...ancestor, ...item };

    if (ancestor.extends) {
      stack.unshift(...ancestor.extends);
    }
  }

  item.id = game.getNextObjectId();
  item.extends = types;

  return item;
}

/**
 * @param {GameObject | Item} object
 * @param {string} type
 * @return {boolean}
 */
export function is(object, type) {
  return object.extends.includes(type);
}
