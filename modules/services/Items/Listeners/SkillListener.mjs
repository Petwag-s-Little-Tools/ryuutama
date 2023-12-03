import { RyuutamaItem } from "../../../documents/RyuutamaItem.mjs";

export class SkillListener {
  /**
   *
   * @param {RyuutamaItem} item
   * @param {Record<string, any>} dataset
   */
  static async use(item, dataset) {
    const action = dataset.action;

    switch (action) {
      case "roll":
        const { idx } = dataset;
        await this.roll(item, idx);
        break;

      default:
        break;
    }
  }

  /**
   *
   * @param {RyuutamaItem} item
   * @param {number | undefined} idx
   * @returns
   */
  static async roll(item, idx) {
    const roll = item.rolls[idx];

    if (roll === undefined) return;

    const { statA, statB } = roll;

    return await item.actor.roll(statA, statB, item.name);
  }
}
