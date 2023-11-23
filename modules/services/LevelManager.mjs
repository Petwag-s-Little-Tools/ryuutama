import { RyuutamaActor } from "../documents/RyuutamaActor.mjs";

export class LevelManager {
  /**
   *
   * @param {RyuutamaActor} actor
   * @returns
   */
  static async levelUp(actor) {
    const level = actor.level;
    const title = `level up ${level.level} -> ${level.level + 1}`;
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
    const title = `level down ${level.level} -> ${level.level - 1}`;

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
