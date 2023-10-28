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

  // ROLL //

  async rollCondition() {
    const roll = await this.roll("str", "spi", "Condition for the day", false);

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
  async roll(stat1, stat2, title, fumblullable = true) {
    const die1 = this.system.stats[stat1].die;
    const die2 = this.system.stats[!isNull(stat2) ? stat2 : stat1].die;

    const roll = new ActionRoll(`1d${die1} + 1d${die2}`);

    // TODO: allow concentration in dialog with MP or fumble
    const configured = await roll.configureDialog({ title });

    if (configured === null) return null;

    await configured.evaluate({ async: true });

    if (fumblullable) {
      let isFumble = true;
      configured.terms.forEach((term) => {
        if (term instanceof Die && term.total !== 1) {
          isFumble = false;
        }
      });
      if (isFumble) Hooks.callAll("onFumble");

      // TODO: add logic for critical success
    }

    await configured.toMessage({ flavor: title });

    return configured;
  }

  // HOOKS
  static async onFumble() {
    game.actors.forEach((actor) => {
      const fumble = actor.system.fumble;
      actor.update({ "system.fumble": fumble + 1 });
      // TODO: display message on fumble
    });
  }
}
