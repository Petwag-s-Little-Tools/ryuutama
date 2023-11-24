import { ryuutama } from "../config.mjs";
import { RyuutamaActor } from "../documents/RyuutamaActor.mjs";

export class LevelManager {
  MAXLEVEL = ryuutama.maxLevel;
  /**
   *
   * @param {RyuutamaActor} actor
   * @param {number} xpBonus
   * @returns {Promise<{level: number, xp: number}>}
   */
  static async checkLevel(actor, xpBonus) {
    const newXp = Math.max(actor.xp + xpBonus, 0);
    const newLevel = LevelManager.getLevel(newXp);

    if (newLevel > actor.level) {
      await LevelManager.levelUp(actor);
    } else if (newLevel < actor.level) {
      await LevelManager.levelDown(actor);
    }

    return { level: newLevel, xp: newXp };
  }

  /**
   *
   * @param {number} xp
   * @returns {number}
   */
  static getLevel(xp) {
    const levels = ryuutama.levels;

    for (const level of levels) {
      if (xp <= level.untilXp) return level.level;
    }

    return levels[levels.length - 1].level;
  }

  /**
   *
   * @param {RyuutamaActor} actor
   * @returns
   */
  static async levelUp(actor) {
    const level = actor.level;
    const title = `level up ${level} -> ${level + 1}`;
    console.log(title);
    const content = "<p>Test</p>";
    return new Promise((resolve) => {
      new Dialog({
        title,
        content,
        buttons: {
          accept: {
            label: game.i18n.localize("ryuutama.roll"),
            callback: (html) => resolve("youyou"),
          },
        },
        default: "accept",
        close: () => resolve(null),
      }).render(true);
    });
  }

  /**
   *
   * @param {RyuutamaActor} actor
   * @returns
   */
  static async levelDown(actor) {
    const level = actor.level;
    const title = `level down ${level} -> ${level - 1}`;

    const content = "<p>Test</p>";
    return new Promise((resolve) => {
      new Dialog({
        title,
        content,
        buttons: {
          accept: {
            label: game.i18n.localize("ryuutama.roll"),
            callback: (html) => resolve("youyou"),
          },
        },
        default: "accept",
        close: () => resolve(null),
      }).render(true);
    });
  }
}
