/**
 * @template {DataTemplate} T
 * @param {Record<string, T>} registry
 * @param {string} id
 * @return {T}
 */
export function buildFromTemplate(registry, id) {
  let object = {};
  let stack = [id];
  let ancestors = [];

  while (stack.length) {
    let id = stack.pop();
    let template = registry[id];

    if (template == null) {
      console.warn(`template not found: ${id}`);
      continue;
    }

    if (ancestors.includes(id)) {
      console.warn(`circular dependency: ${ancestors.join(" -> ")} -> ${id}`);
      continue;
    }

    object = { ...template, ...object };
    ancestors.push(id);

    if (template.extends) {
      stack.push(...template.extends);
    }
  }

  object.extends = ancestors;

  return /** @type {T} */(object);
}
