export class RyuutamaActor extends Actor {
  /** @override */
  prepareData() {
    super.prepareData();
  }

  prepareDerivedData() {
    super.prepareDerivedData();
  }

  prepareEmbeddedDocuments() {
    super.prepareEmbeddedDocuments();
  }

  rollCondition() {
    const strDice = this.system.stats.str.die;
    const spiDice = this.system.stats.spi.die;

    const roll = new Roll(`1d${strDice} + 1d${spiDice}`);

    roll.evaluate().then(() => {
      this.update({ "system.condition": roll.total });

      return ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({ actor: game.user._id }),
        content: `Rolling Condition for ${this.name}... [STR + SPI]`,
      });
    });
  }

  selectStat(stat) {
    let selectedStat = this.system.selectedStat;

    if (selectedStat.includes(stat)) {
      selectedStat = selectedStat.filter((s) => s !== stat);
    } else {
      if (selectedStat.length >= 2) {
        selectedStat.shift();
      }

      selectedStat.push(stat);
    }

    this.update({ "system.selectedStat": selectedStat });
  }

  roll() {
    const selectedStat = this.system.selectedStat;

    if (selectedStat.length <= 0) return;

    const stat1 = selectedStat[0];
    const stat2 = selectedStat.length < 2 ? selectedStat[0] : selectedStat[1];

    const die1 = this.system.stats[stat1].die;
    const die2 = this.system.stats[stat2].die;

    const roll = new Roll(`1d${die1} + 1d${die2}`);

    roll.evaluate().then(() => {
      const total = roll.total;

      return ChatMessage.create({
        user: game.user._id,
        speaker: ChatMessage.getSpeaker({ actor: game.user._id }),
        content: `Rolling ${selectedStat[0]} + ${selectedStat[1]} for ${this.name}... [${total}]`,
      });
    });
  }
}
