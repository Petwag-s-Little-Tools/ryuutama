import { ryuutama } from "../config.mjs";
import { RyuutamaActor } from "../documents/RyuutamaActor.mjs";

/**
 * Class in charge of all xp calculation, level up and down
 */
export class LevelManager {
  static get levelMax() {
    return ryuutama.levels[ryuutama.levels.length - 1].level;
  }

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
      await LevelManager.levelUp(actor.level, newLevel);
    } else if (newLevel < actor.level) {
      await LevelManager.levelDown(actor.level, newLevel);
    }

    actor.update({
      "system.xp": newXp,
      "system.level": newLevel,
    });

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

    return LevelManager.levelMax;
  }

  /**
   *
   * @param {RyuutamaActor} actor
   * @returns
   */
  static async levelUp(initialLevel, targetLevel) {
    let level = initialLevel;

    while (level < targetLevel) {
      const title = `level up ${level} -> ${level + 1}`;
      const content = ryuutama.levels[level].bonuses.map(
        (bonus) => `<p>${bonus}</p>`
      );
      await new Promise((resolve) => {
        new Dialog({
          title,
          content,
          buttons: {
            accept: {
              label: game.i18n.localize("ryuutama.accept"),
              callback: (html) => resolve("youyou"),
            },
          },
          default: "accept",
          close: () => resolve(null),
        }).render(true);
      });

      level++;
    }
  }

  /**
   *
   * @param {RyuutamaActor} actor
   * @returns
   */
  static async levelDown(initialLevel, targetLevel) {
    let level = initialLevel;

    while (level > targetLevel) {
      const title = `level down ${level} -> ${level - 1}`;

      const content = ryuutama.levels[level - 1].bonuses.map(
        (bonus) => `<p>${bonus}</p>`
      );
      await new Promise((resolve) => {
        new Dialog({
          title,
          content,
          buttons: {
            accept: {
              label: game.i18n.localize("ryuutama.accept"),
              callback: (html) => resolve("youyou"),
            },
          },
          default: "accept",
          close: () => resolve(null),
        }).render(true);
      });

      level--;
    }
  }
}
