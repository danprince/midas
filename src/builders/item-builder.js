import Items from "../data/items.json";

/**
 * @param {string} id
 * @return {Item}
 */
export function build(id) {
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
    let ancestor = Items[id];
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
