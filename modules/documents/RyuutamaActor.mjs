import { ryuutama } from "../config.mjs";
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

  /**
   * @returns {{die: number, actual: number}[]}
   */
  get stats() {
    const system = this.system;

    // TODO: Add cache and flag for refresh when change happens
    const stats = {};
    Object.entries(system.stats).forEach(([key, data]) => {
      const statusEffects = ryuutama.stats[key].statuses;

      const statusEffectsModifier = statusEffects.reduce(
        (accumulator, statusEffect) => {
          return accumulator + system.statuses[statusEffect];
        },
        0
      );

      const modifier = data.mod + data.condition - statusEffectsModifier;

      stats[key] = {
        die: data.die,
        actual: this.modifyDice(data.die, modifier),
      };
    });

    return stats;
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

  /**
   * Update the fumble value of a user by the increment value
   * It can be a positive or negative value
   * @param {number} increment
   */
  incrementFumble(increment) {
    const fumble = this.system.fumble;
    this.update({ "system.fumble": fumble + increment });
  }

  /**
   * Update the current Mp value of a user by the increment value
   * It can be a positive or negative value
   * @param {number} increment
   */
  incrementMp(increment) {
    const mp = this.system.mp.current;
    this.update({ "system.mp.current": mp + increment });
  }

  /**
   * Update the xp value of a user by the increment value
   * It can be a positive or negative value
   * @param {number} increment
   */
  incrementXP(increment) {
    const xp = this.system.xp;
    // XP can't go under 0
    // TODO: Deal with loosing level if decreasing XP
    // TODO: Deal with level up
    const newXp = Math.max(xp + increment, 0);
    this.update({ "system.xp": newXp });
  }

  /**
   * Use half of the remaining Mp of the actor rounded up
   */
  useHalfMp() {
    const halfMp = Math.round(this.system.mp.current / 2);
    this.incrementMp(-halfMp);
  }

  /**
   * ROLLS
   **/
  async rollCondition() {
    const roll = await this.roll(
      "str",
      "spi",
      "Condition for the day",
      false,
      false
    );

    if (roll.total === 2) {
      // TODO: Display condition choice on fumble
      // this.update({ "system.stats.str.condition": 0 });
    }

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
   * @param {string} stat1
   * @param {string | undefined} stat2
   * @param {string} title
   */
  async roll(stat1, stat2, title, fumblullable = true, concentrable = true) {
    const { fumble, mp } = this.system;

    const stats = this.stats;

    const die1 = stats[stat1].actual;
    const die2 = stats[!isNull(stat2) ? stat2 : stat1].actual;

    const roll = new ActionRoll(`1d${die1} + 1d${die2}`);

    const concentrationFumble = concentrable && fumble > 0;
    const concentrationMp = concentrable && mp.current > 0;

    const configured = await roll.configureDialog(
      title,
      concentrationFumble,
      concentrationMp
    );

    if (configured === null) return null;

    await configured.evaluate({ async: true });

    if (fumblullable && configured.isFumble) {
      Hooks.callAll("onFumble");

      // TODO: add logic for critical success
    }

    // if concentration has been used reduce whatever value
    if (configured.concentration === "fumble") {
      this.incrementFumble(-1);
    } else if (configured.concentration === "mp") {
      this.useHalfMp();
    } else if (configured.concentration === "dual") {
      this.incrementFumble(-1);
      this.useHalfMp();
    }

    await configured.toMessage({ flavor: title });

    return configured;
  }

  /**
   * HOOKS
   **/
  static async onFumble() {
    game.actors.forEach((actor) => {
      actor.incrementFumble(1);
      // TODO: display message on fumble
    });
  }

  /**
   * HELPERS
   **/
  modifyDice(die, modifier) {
    if (modifier === 0) return die;

    const dice = ryuutama.dice;

    let jumps = modifier;
    let currentDie = die;

    while (true) {
      if (jumps === 0) {
        break;
      } else if (jumps < 0) {
        currentDie = dice[currentDie].previous;
        jumps += 1;
      } else if (jumps > 0) {
        currentDie = dice[currentDie].next;
        jumps -= 1;
      }
    }

    return currentDie;
  }
}
