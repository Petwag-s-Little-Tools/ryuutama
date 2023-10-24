export class RyuutamaCombat extends Combat {
  /**
   * @override
   */
  _sortCombatants(a, b) {
    const initA = Number.isNumeric(a.initiative) ? a.initiative : -Infinity;
    const initB = Number.isNumeric(b.initiative) ? b.initiative : -Infinity;

    let initDifference = initB - initA;

    if (initDifference !== 0) return initDifference;

    const typeA = a.actor.data.type;
    const typeB = b.actor.data.type;

    if (typeA === typeB) return a.tokenId - b.tokenId;

    if (typeA === "character") return -1;

    if (typeB === "character") return 1;
  }

  _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
  }
}
