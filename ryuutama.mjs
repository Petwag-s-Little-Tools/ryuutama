import { RyuutamaActor } from "./modules/documents/RyuutamaActor.mjs";
import { activateItemsListeners } from "./modules/services/Items/Listeners/index.mjs";
import { configureGame } from "./modules/setup/index.mjs";
import {
  preloadHandlerbarsTemplates,
  registerHandleBarsHelpers,
} from "./modules/utils.mjs";

Hooks.once("init", () => {
  if (game.release.generation < 11) {
    throw new Error("The system does not support version previous to 11");
  }

  console.log("ryuutama | Starting Ryuutama System");
  console.log({ CONFIG, Actors, Items });

  // CONFIG.debug.hooks = true;

  configureGame(CONFIG, Actors, Items);

  preloadHandlerbarsTemplates();

  registerHandleBarsHelpers();
});

// Other Hooks
Hooks.on("renderChatLog", (app, html, data) => activateItemsListeners(html));
Hooks.on("renderChatPopout", (app, html, data) => activateItemsListeners(html));
Hooks.on("onFumble", (app, html, data) => {
  RyuutamaActor.onFumble();
});
