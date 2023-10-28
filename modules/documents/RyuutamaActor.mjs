import { ActionRoll } from "../dice/ActionRoll.mjs";
import { isNull } from "../utils.mjs";

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

  // Rolls
  async rollCondition() {
    const roll = await this.roll("str", "spi", "Condition for the day");

    this.update({ "system.condition": roll.total });
  }

  async rollAction() {
    const selectedStat = this.system.selectedStat;

    if (selectedStat.length <= 0) return;

    return await this.roll(
      selectedStat[0],
      selectedStat[1],
      `roll for ${selectedStat}`
    );
  }

  /**
   *
   * @param {string} stat1
   * @param {string | undefined} stat2
   * @param {string} title
   */
  async roll(stat1, stat2, title) {
    const die1 = this.system.stats[stat1].die;
    const die2 = this.system.stats[!isNull(stat2) ? stat2 : stat1].die;

    const roll = new ActionRoll(`1d${die1} + 1d${die2}`);

    const configured = await roll.configureDialog({ title });

    if (configured === null) return null;

    await configured.evaluate({ async: true });

    await configured.toMessage({ flavor: title });

    return configured;
  }
}
