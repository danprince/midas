import Objects from "../data/objects.json";

/**
 * @param {string} id
 * @return {ObjectTemplate}
 */
function getTemplate(id) {
  let template = Objects[id];

  if (template == null) {
    throw new Error(`object template does not exist: ${id}`);
  }

  return template;
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
    let ancestor = getTemplate(id);

    if (ancestor == null) {
      console.warn(`no template for ${id}`);
      continue;
    }

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