import { RyuutamaItem } from "../../../documents/RyuutamaItem.mjs";
import { useSkill, useSpell } from "./useItemFunctions/index.mjs";

export class ItemUsageManager {
  /**
   *
   * @param {RyuutamaItem} item
   */
  constructor(item) {
    this._item = item;
    this._useItem = ItemUsageManager.getUseItemFunction(item.type);
  }

  get item() {
    return this._item;
  }

  async use() {
    return await this._useItem(this._item);
  }

  /**
   * Get the item use function depending on the type of the item
   * @param {string} type
   */
  static getUseItemFunction(type) {
    switch (type) {
      case "skill":
        return useSkill;
      case "spell":
        return useSpell;
      default:
        return () => {
          throw new Error(`No use function for this type: ${type}`);
        };
    }
  }
}
