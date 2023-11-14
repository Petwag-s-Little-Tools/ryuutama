export class RyuutamaItem extends Item {
  equip(enabled) {
    const owner = this.owner;

    if (owner === null) return;

    this.update({ "system.active": enabled });
  }

  async use() {
    switch (this.type) {
      case "skill":
        return await this.displaySkillInChat();
      case "spell":
        return await this.displaySpellInChat();
      default:
        throw new Error(`No use function for this type: ${this.type}`);
    }
  }

  async displaySkillInChat() {
    return await this.displayInChat();
  }

  async displaySpellInChat() {
    return await this.displayInChat();
  }

  /**
   * Display the item card
   * @param {{}} [setup={}]
   * @returns {ChatMessage}
   */
  async displayInChat(setup = {}) {
    const token = this.actor.token;

    const templateData = {
      actor: this.actor,
      item: this,
      tokenId: token?.uuid || null,
      system: this.system,
      setup,
    };

    const html = await renderTemplate(
      "systems/ryuutama/templates/chat/item-card.hbs",
      templateData
    );

    // create chat message
    const chatData = {
      user: game.user.id,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      content: html,
      flavor: this.system.flavor,
      speaker: ChatMessage.getSpeaker({ actor: this.actor, token }),
      flags: { "core.canPopout": true },
    };

    // Apply correct visibility
    ChatMessage.applyRollMode(chatData, game.settings.get("core", "rollMode"));

    // Create the card
    const card = await ChatMessage.create(chatData);

    return card;
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
}
