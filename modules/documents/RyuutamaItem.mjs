import { ItemUsageManager } from "../services/Items/UsageManager/ItemUsageManager.mjs";

export class RyuutamaItem extends Item {
  constructor(...args) {
    super(...args);

    this.itemUsageManager = new ItemUsageManager(this);
  }
  equip(enabled) {
    const owner = this.owner;

    if (owner === null) return;

    this.update({ "system.active": enabled });
  }

  async use() {
    this.itemUsageManager.use();
  }

  static async onChatCardAction(event) {
    const button = event.currentTarget;
    button.disabled = true;

    const dataset = button?.dataset;

    if (dataset === undefined) return;

    const card = button.closest(".chat-card");
    const messageId = card.closest(".message").dataset.messageId;
    const message = game.messages.get(messageId);

    const actor = await this.getActorFromChatCard(card);
    if (!actor) return;

    // Validate permission to proceed with the roll
    if (!(game.user.isGM || actor.isOwner)) return;

    const item = actor.items.get(card.dataset.itemId);
    if (!item) return;

    const action = dataset.action;

    switch (action) {
      case "roll":
        const { idx } = dataset;
        await item.useSkill(idx);
        break;

      default:
        break;
    }

    button.disabled = false;
  }

  /*****************************
   * HELPERS
   *****************************/
  static async getActorFromChatCard(card) {
    // Case 1 - a synthetic actor from a Token
    if (card.dataset.tokenId) {
      const token = await fromUuid(card.dataset.tokenId);
      if (!token) return null;
      return token.actor;
    }

    // Case 2 - use Actor ID directory
    const actorId = card.dataset.actorId;
    return game.actors.get(actorId) || null;
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
   * SETUP
   *****************************/

  /**
   * Apply listeners for the item
   * @param {*} html
   */
  static chatListeners(html) {
    html.on("click", ".card-buttons button", this.onChatCardAction.bind(this));
  }

  /*****************************
   * ACTIONS
   *****************************/

  /**
   *
   * @param {number} idx
   * @returns
   */
  async useSkill(idx) {
    const roll = this.rolls[idx];

    if (roll === undefined) return;

    const { statA, statB } = roll;

    return await this.actor.roll(statA, statB, this.name);
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
