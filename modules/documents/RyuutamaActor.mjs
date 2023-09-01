export class RyuutamaActor extends Actor {
  /** @override */
  prepareData() {
    super.prepareData();
  }

  rollCondition() {
    const newCondition =
      parseInt(this.system.stats.str.die) + parseInt(this.system.stats.spi.die);

    this.update({ "system.condition": newCondition });

    return ChatMessage.create({
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({ actor: game.user._id }),
      content: `Rolling Condition for ${this.name}... [STR + SPI]`,
    });
  }
}
