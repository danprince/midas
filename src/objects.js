/**
 * @return {GameObject}
 */
export function midas() {
  return {
    x: 0,
    y: 0,
    sprite: 1,
    shadow: true,
    canPush: true,
    canJump: true,
    canAttack: true,
    mobile: true,
    hp: 10,
    coins: 0,
  }
}

/**
 * @return {GameObject}
 */
export function medusa() {
  return {
    sprite: 50,
    x: 0,
    y: 0,
    h: 2,
    shadow: true,
    hp: 3,
    ai: {
      type: "medusa",
      direction: [-1, 0],
    },
    mobile: true,
    canBeCrushed: true,
    canBeAttacked: true
  };
}
