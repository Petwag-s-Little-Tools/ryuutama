export class RyuutamaActor extends Actor {
  /** @override */
  prepareData() {
    this.selectedStat = [];

    super.prepareData();
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
    console.log(stat, this.selectedStat);
    if (this.selectedStat.includes(stat)) {
      this.selectedStat = this.selectedStat.filter((s) => s !== stat);
    } else {
      if (this.selectedStat.length >= 2) {
        this.selectedStat.shift();
      }

      this.selectedStat.push(stat);
    }

    console.log(this.selectedStat);

    this.update({ selectedStat: this.selectedStat });
  }
}
