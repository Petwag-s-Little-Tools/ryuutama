import { ItemUsageManager } from "../services/Items/UsageManager/ItemUsageManager.mjs";

export class RyuutamaItem extends Item {
  constructor(...args) {
    super(...args);
    this.itemUsageManager = new ItemUsageManager(this);
  }
  equip(enabled) {
    const owner = this.actor;

    if (owner === null) return;

    this.update({ "system.active": enabled });
  }

  async use() {
    this.itemUsageManager.use();
  }

  /*****************************
   * GETTER
   *****************************/
  get rolls() {
    if (this.type !== "skill") {
      throw new Error(`can't access rolls on ${this.type} type of item`);
    }
    return this.system.rolls;
  }

  get abilities() {
    if (this.type !== "characterType") {
      throw new Error(`can't access abilities on ${this.type} type of item`);
    }
    return this.system.abilities;
  }

  /*****************************
   * TYPE SPECIFIC ACTIONS
   *****************************/

  /** SKILL */
  addRollToSkill() {
    const rolls = this.rolls;
    rolls.push({ statA: "none", statB: "none" });
    this.update({ "system.rolls": rolls });
  }

  deleteRollFromSkill(idx) {
    const rolls = this.rolls;
    rolls.splice(idx, 1);

    this.update({ "system.rolls": rolls });
  }

  /**
   *
   * @param {string} field
   * @param {number} idx
   * @param {string} statValue
   * @returns
   */
  updateRollOfSkill(field, idx, statValue) {
    const rolls = this.rolls;
    const roll = rolls[idx];

    if (roll === undefined) return;

    roll[field] = statValue;

    this.update({ "system.rolls": rolls });
  }

  /** CHARACTERTYPE */
  addAbilityToCharacterType() {
    const abilities = this.abilities;
    abilities.push({ name: "", effect: "" });
    this.update({ "system.abilities": abilities });
  }

  deleteAbilityFromCharacterType(idx) {
    const abilities = this.abilities;
    abilities.splice(idx, 1);

    this.update({ "system.abilities": abilities });
  }

  /**
   *
   * @param {string} field
   * @param {number} idx
   * @param {string} statValue
   * @returns
   */
  updateAbilityOfCharacterType(field, idx, value) {
    const abilities = this.abilities;
    const ability = abilities[idx];

    if (ability === undefined) return;

    ability[field] = value;

    this.update({ "system.abilities": abilities });
    console.log(this.abilities);
  }
}
