import { RyuutamaItem } from "../../../documents/RyuutamaItem.mjs";
import { displayItem } from "./displayItem.mjs";
import { displaySkill } from "./displaySkill.mjs";
import { displaySpell } from "./displaySpell.mjs";

export class DisplayManager {
  /**
   * Class in charge of item usage from actor
   * to choose how to display in chat
   * @param {RyuutamaItem} item
   */
  constructor(item) {
    this._item = item;
    this._displayItem = DisplayManager.getDisplayFunction(item.type);
  }

  get item() {
    return this._item;
  }

  async display() {
    return await this._displayItem(this._item);
  }

  /**
   * Get the item use function depending on the type of the item
   * @param {string} type
   */
  static getDisplayFunction(type) {
    switch (type) {
      case "skill":
        return displaySkill;
      case "spell":
        return displaySpell;
      case "item":
        return displayItem;
      default:
        return () => {
          throw new Error(`No use function for this type: ${type}`);
        };
    }
  }
}
