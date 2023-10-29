import { isNull } from "../utils.mjs";

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
      //TODO: Allow equipment ?
      default:
        throw new Error(`No use function for this type: ${this.type}`);
    }
  }

  async displaySkillInChat() {
    let rollType;

    if (!isNull(this.system.statUsed.statA)) {
      if (isNull(this.system.statUsed.statB)) {
        rollType = "oneStat";
      } else {
        rollType = "twoStat";
      }
    } else if (!isNull(this.system.statUsed.alternative)) {
      rollType = "alternative";
    }

    return await this.displayInChat({ rollType });
  }

  async displaySpellInChat() {
    //TODO: Put correct setup information
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

    // TODO: use different template for each type of item?
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

  /**
   * Apply listeners for the item
   * @param {*} html
   */
  static chatListeners(html) {
    // TODO: add different listener per type of item or add logic in the onChatCardAction function
    html.on("click", ".card-buttons button", this.onChatCardAction.bind(this));
  }

  static async onChatCardAction(event) {
    const button = event.currentTarget;
    button.disabled = true;
    const card = button.closest(".chat-card");
    const messageId = card.closest(".message").dataset.messageId;
    const message = game.messages.get(messageId);
    const action = button.dataset.action;

    const actor = await this.getChatCardActor(card);
    if (!actor) return;

    // Validate permission to proceed with the roll
    if (!(game.user.isGM || actor.isOwner)) return;

    const item = actor.items.get(card.dataset.itemId);

    if (!item) return;

    await item.useSkill();

    button.disabled = false;
  }

  static async getChatCardActor(card) {
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

  async useSkill() {
    const { statA, statB } = this.system.statUsed;

    if (statA === undefined || statA === "" || statA === "none") return;

    return await this.actor.roll(statA, statB, this.name);
  }
}
