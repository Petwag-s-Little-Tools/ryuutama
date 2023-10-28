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
        return await this.displayInChat();
      default:
        throw new Error(`No use function for this type: ${this.type}`);
    }
  }

  /**
   * Display the item card
   * @param {{}} [options={}]
   * @returns {ChatMessage}
   */
  async displayInChat() {
    const token = this.actor.token;

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

    const templateData = {
      actor: this.actor,
      item: this,
      tokenId: token?.uuid || null,
      system: this.system,
      setup: {
        rollType,
      },
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

  /**
   * Apply listeners for the item
   * @param {*} html
   */
  static chatListeners(html) {
    html.on("click", ".card-buttons button", this.onChatCardAction.bind(this));
    html.on("click", ".item-name", this.onChatCardToggleContent.bind(this));
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

    console.log({ messageId, message, action, actor, item });

    if (!item) return;

    await item.useSkill();

    button.disabled = false;
  }

  static onChatCardToggleContent(event) {
    const header = event.currentTarget;
    const card = header.closest(".chat-card");
    const content = card.querySelector(".card-content");
    content.style.display = content.style.display === "none" ? "block" : "none";
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
