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

    const isRollable =
      this.system.statUsed.statA !== "none" ||
      this.system.statUsed.alternative !== "none";

    const isRollableStandard =
      isRollable && this.system.statUsed.statA !== "none";

    const templateData = {
      actor: this.actor,
      item: this,
      tokenId: token?.uuid || null,
      system: this.system,
      setup: {
        isRollable,
        isRollableStandard,
      },
    };

    console.log(this.system);

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

  async useSkill() {
    const { statA, statB } = this.system.statUsed;

    if (statA === undefined || statA === "") return;

    return await this.actor.roll(statA, statB, this.name);
  }
}
