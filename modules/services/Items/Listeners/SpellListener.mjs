export class SpellListener {
  /**
   *
   * @param {RyuutamaItem} item
   * @param {Record<string, any>} dataset
   */
  static async use(item, dataset) {
    const action = dataset.action;

    switch (action) {
      case "cast":
        return await this.cast(item);
      default:
        break;
    }
  }

  static async cast(item) {
    const cost = item.system.manaCost;

    item.actor.incrementMp(-cost);
  }
}
