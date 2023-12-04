import { ryuutama } from "../config.mjs";
import { ActionRoll } from "../dice/ActionRoll.mjs";
import { LevelManager } from "../services/LevelManager.mjs";
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

  /*****************************
   * GETTER
   *****************************/
  get stats() {
    const system = this.system;

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

  get xp() {
    return this.system.xp;
  }

  get mp() {
    return this.system.mp.current;
  }

  get level() {
    return this.system.level;
  }

  /*****************************
   * ACTIONS
   *****************************/

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

  async rollCondition() {
    const roll = await this.roll(
      "str",
      "spi",
      "Condition for the day",
      false,
      false
    );

    const title = "Choose caracter loss for the day";
    const content = await renderTemplate(
      `systems/ryuutama/templates/dialog/condition-fumble.hbs`,
      {
        stats: this.stats,
      }
    );

    // Reset condition malus
    Array.from(Object.keys(this.stats)).forEach((stat) => {
      const key = `system.stats.${stat}.mod`;
      this.update({ [key]: 0 });
    });

    if (roll.isFumble) {
      await new Promise((resolve) => {
        new Dialog({
          title,
          content,
          buttons: {
            accept: {
              label: game.i18n.localize("ryuutama.accept"),
            },
          },
          default: "accept",
          close: (html) => resolve(this.onConditionMalusChoosen(html)),
        }).render(true);
      });
    }

    this.update({ "system.condition": roll.total });
  }

  onConditionMalusChoosen(html) {
    const form = html[0].querySelector("form");

    const selectedStat = form.stat.value;

    if (selectedStat === "") {
      const array = Array.from(Object.keys(this.stats));
      const randomElement = array[Math.floor(Math.random() * array.length)];
      const key = `system.stats.${randomElement}.mod`;
      this.update({ [key]: this.system.stats[randomElement].mod - 1 });
    } else {
      const key = `system.stats.${selectedStat}.mod`;
      this.update({ [key]: this.system.stats[selectedStat].mod - 1 });
    }
  }

  async rollAction() {
    const selectedStat = this.system.selectedStat;

    if (selectedStat.length <= 0) return;

    const statA = selectedStat[0];
    const statB = selectedStat[1];

    return await this.roll(
      statA ?? statB,
      statB ?? statA,
      `roll for ${selectedStat}`
    );
  }

  /**
   * @param {string} statA
   * @param {string | undefined} statB
   * @param {string} title
   */
  async roll(statA, statB, title, fumblullable = true, concentrable = true) {
    if (isNull(statA) && isNull(statB)) return;

    const stats = this.stats;

    let rolls = [];

    [statA, statB].forEach((stat) => {
      const die = isNull(stat) ? undefined : stats[stat]?.actual;
      if (die !== undefined) rolls.push(`1d${die}`);
    });

    if (rolls.length === 0) return;

    const roll = new ActionRoll(rolls.join(" + "));

    const { fumble, mp } = this.system;

    const concentrationFumble = concentrable && fumble > 0;
    const concentrationMp = concentrable && mp.current > 0;

    const configured = await roll.configureDialog(
      title,
      concentrationFumble,
      concentrationMp
    );

    if (configured === null) return null;

    await configured.evaluate({ async: true });

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

    if (configured.isCritical) {
      const html = await renderTemplate(
        "systems/ryuutama/templates/chat/critical-success.hbs"
      );
      const chatData = {
        user: game.user.id,
        content: html,
      };
      await ChatMessage.create(chatData);
    } else if (fumblullable && configured.isFumble) {
      Hooks.callAll("onFumble");
    }

    return configured;
  }

  /*****************************
   * SETUP
   *****************************/

  static async onFumble() {
    game.actors.forEach((actor) => {
      actor.incrementFumble(1);
    });
  }

  /*****************************
   * HELPERS
   *****************************/

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
    const mp = Math.max(this.mp + increment, 0);
    this.update({ "system.mp.current": mp });
  }

  /**
   * Update the xp value of a user by the increment value
   * It can be a positive or negative value
   * @param {number} increment
   */
  async incrementXP(increment) {
    await LevelManager.checkLevel(this, increment);
  }

  /**
   * Use half of the remaining Mp of the actor rounded up
   */
  useHalfMp() {
    const halfMp = Math.round(this.system.mp.current / 2);
    this.incrementMp(-halfMp);
  }

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
